package conversations

import (
	"bytes"
	"context"
	"crypto/md5"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"time"

	"cloud.google.com/go/storage"
	"github.com/redis/go-redis/v9"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/helpers"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/interactors"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	broker "gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

func Message(data []byte, sessionUUID, sector string, conn *websocket.Conn, op int, write message.Write, msg *message.Message) message.IErrorMessage {

	channelMsg, err := SerialiseChannelMessage(data)
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	log.Printf("serialised channelMsg sent from client :{ %+v }", channelMsg)
	if channelMsg.ConversationId == "" {

		// create conversation
		err := New(channelMsg, sector)
		if err == redis.Nil {
			return nil
		}
		if err != nil {
			return message.NewErrorMessage(0, err)
		}
	}
	log.Println("append message ----")
	// add message to conversation
	channelUUID, errMsg := appendMessage(channelMsg)
	if errMsg != nil {
		return errMsg
	}

	conversation, err := broker.MessageBrokerClient.ConversationGetByUUID(channelMsg.ConversationId)
	if err == redis.Nil {
		return nil
	}
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	err = write(conn, op, &message.Message{
		Type:         message.MessageTypeGetConversationByUUID,
		Conversation: conversation,
	})
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	log.Printf("appended message to channelUUID : %s", channelUUID)
	// SessionsSendMessage(msg.SenderUUID, channelUUID, write, msg)

	return nil
}

func appendMessage(channelMsg *broker.ChannelMessage) (string, message.IErrorMessage) {

	msg := broker.Message{
		UUID:        channelMsg.Message.UUID,
		Body:        channelMsg.Message.Body,
		ContentType: channelMsg.Message.ContentType,
		CreatedAt:   channelMsg.Message.CreatedAt,
		SenderId:    channelMsg.Message.SenderId,
		Attachments: channelMsg.Message.Attachments,
	}

	channelUUID, err := broker.MessageBrokerClient.ConversationAppendMessage(channelMsg.ConversationId, msg)
	if err != nil {
		return "", message.NewErrorMessage(0, err)
	}

	return channelUUID, nil
}

func addAttachment(msgBlob map[string]interface{}, attachments []broker.Attachment, messageId string) ([]broker.Attachment, error) {
	msgType := msgBlob["channel_message"].(map[string]interface{})["message"].(map[string]interface{})["content_type"].(string)
	messageAttachments := msgBlob["channel_message"].(map[string]interface{})["attachments"].([]interface{})
	if msgType != "text" {
		for _, attachment := range messageAttachments {
			attachmentId := uuid.New().String()
			url, err := uploadBlob(attachment, attachmentId, messageId)
			log.Printf("blob url upload to cloud storage [[ %v ]]", url)
			if err != nil {
				return nil, err
			}
			attachments = append(attachments, broker.Attachment{
				UUID:     attachmentId,
				ImageURL: url,
				ThumbURL: url,
				Text:     attachment.(map[string]interface{})["message"].(string),
				Title:    attachment.(map[string]interface{})["name"].(string),
			})
		}
	}

	return attachments, nil
}

func uploadBlob(file interface{}, attachmentId, messageId string) (string, error) {

	fileBlob := file.(map[string]interface{})

	fName := fileBlob["name"].(string)
	blob, err := base64.StdEncoding.DecodeString(fileBlob["file"].(string))
	if err != nil {
		return "", err
	}

	blobReader := bytes.NewReader(blob)

	entity := storage.AllUsers
	role := storage.RoleReader
	bucket := fmt.Sprintf("%x", md5.Sum([]byte(fmt.Sprintf("%x.%x", attachmentId, messageId))))
	if err := helpers.CreateStorageBucket(bucket, interactors.ProjectId); err != nil {
		return "", err
	}

	ctx := context.Background()

	client, err := storage.NewClient(ctx)

	if err != nil {
		return "", err
	}
	defer client.Close()

	ctx, cancel := context.WithTimeout(ctx, time.Second*100)
	defer cancel()
	// Upload an object with storage.Writer.
	wc := client.Bucket(bucket).Object(fName).NewWriter(ctx)
	if _, err = io.Copy(wc, blobReader); err != nil {
		return "", err
	}
	if err := wc.Close(); err != nil {
		return "", err
	}
	acl := client.Bucket(bucket).Object(fName).ACL()
	if err := acl.Set(ctx, entity, role); err != nil {
		return "", err
	}

	url := fmt.Sprintf("%s/%s/%s", services.ObjectStorage, bucket, fName)

	return url, nil
}

func SerialiseChannelMessage(data []byte) (*broker.ChannelMessage, error) {

	var msgBlob map[string]interface{}
	var msgPayload broker.Message

	messageId := uuid.New().String()
	creationTime := time.Now()
	channelMsg := &broker.ChannelMessage{}

	if err := json.Unmarshal(data, &msgBlob); err != nil {
		return channelMsg, err
	}
	log.Printf("serialising blob :::: [[ %v ]]", msgBlob)
	for k, v := range msgBlob["channel_message"].(map[string]interface{}) {
		switch k {
		case "conversation_id":
			if v != nil {
				channelMsg.ConversationId = v.(string)
			}
		case "recipient_ids":
			if v != nil {
				recipients := make([]string, len(v.([]interface{})))
				for i, recId := range v.([]interface{}) {
					recipients[i] = recId.(string)
				}
				channelMsg.RecipientIds = recipients
			}
		case "message":
			msgPayload.UUID = messageId
			for kMsg, vMsg := range v.(map[string]interface{}) {
				switch kMsg {
				case "body":
					msgPayload.Body = vMsg.(string)
				case "content_type":
					msgPayload.ContentType = vMsg.(string)
				case "sender_id":
					msgPayload.SenderId = vMsg.(string)
				}
			}
		case "attachments":
			var attachments []broker.Attachment
			attachments, err := addAttachment(msgBlob, attachments, messageId)
			log.Printf("loaded attachments [[ %v ]]", attachments)
			if err != nil {
				return channelMsg, err
			}
			msgPayload.Attachments = attachments
		case "conversation_type":
			channelMsg.Type = broker.ConversationType(v.(string))
		}
	}

	msgPayload.CreatedAt = creationTime
	channelMsg.Message = msgPayload

	return channelMsg, nil
}
