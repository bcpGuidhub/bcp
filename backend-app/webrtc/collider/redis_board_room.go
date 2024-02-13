package collider

import (
	"bytes"
	"context"
	"crypto/md5"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"strings"
	"time"

	"cloud.google.com/go/storage"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/helpers"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/interactors"
	broker "gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

var _ = IBoardRoom(&RedisBoardRoom{})

const (
	keyBoardRoomStakeholders  = "boardRoomStakeholders"
	keyBoardRoomConversations = "boardRoomConversations"
	keyBoardRoomMessages      = "boardRoomMessages"
	keyBoardRoomSession       = "boardRoomSession"
	boardRoomErrSize          = -1
	BOARD_ROOM_CAPACITY       = 4
)

// var (
// 	errBoardRoomCapacity = errors.New("board room at capacity")
// )

type Status int

const (
	Offline Status = iota
	online
)

type BoardRoomSeat struct {
	UUID         string `json:"id"`
	Status       Status `json:"status"`
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	Role         string `json:"role"`
	ProfileImage string `json:"profile_image"`
}

type BoardRoomMessage struct {
	BoardRoomID  string         `json:"board_room_id"`
	ClientID     string         `json:"client_id"`
	UUID         string         `json:"UUID"`
	Sender       *BoardRoomSeat `json:"sender,omitempty"`
	Message      string         `json:"message,omitempty"`
	CreatedAt    time.Time      `json:"CreatedAt,omitempty"`
	PeerId       string         `json:"peer_id,omitempty"`
	Session      string         `json:"session"`
	Conversation string         `json:"conversation,omitempty"`
}

type ChannelMessage struct {
	UUID        string                       `json:"uuid"`
	BoardRoomID string                       `json:"board_room_id"`
	ClientID    string                       `json:"client_id"`
	Message     BoardRoomConversationMessage `json:"message"`
	Session     string                       `json:"session"`
	Attachment  []map[string]interface{}     `json:"attachments"`
}

type BoardRoomConversationMessage struct {
	UUID        string              `json:"id"`
	Body        string              `json:"body"`
	ContentType string              `json:"content_type"`
	Attachments []broker.Attachment `json:"attachments"`
	CreatedAt   time.Time           `json:"created_at"`
	SenderId    string              `json:"sender_id"`
}

type RedisBoardRoom struct {
	UUID           string          `json:"board_room_uuid"`
	BoardRoomSeats []BoardRoomSeat `json:"seats"`
	Status         Status          `json:"board_room_status"`
	MessageBroker  *broker.MessageBroker
}

type BoardRoomLeave struct {
	BoardRoomID string `json:"board_room_id"`
	ClientID    string `json:"client_id"`
}

func newRedisBoardRoom(id string) *RedisBoardRoom {
	return &RedisBoardRoom{UUID: id,
		MessageBroker: broker.MessageBrokerClient,
	}
}

func (boardRoom *RedisBoardRoom) guuid() string {
	return boardRoom.UUID
}

func (boardRoom *RedisBoardRoom) initBoardRoom() (string, error) {
	err := boardRoom.hasSession()

	if err == redis.Nil {
		return boardRoom.setSession()
	}

	if err != nil {
		return "", err
	}

	return boardRoom.getBoardRoomSession()
}

func (boardRoom *RedisBoardRoom) setSession() (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":    boardRoom.guuid(),
		"created_at": time.Now(),
	})
	p, err := rand.Prime(rand.Reader, 64)
	if err != nil {
		return "", err
	}
	s := fmt.Sprintf("%s", p)
	tokenString, err := token.SignedString([]byte(s))
	if err != nil {
		return "", err
	}

	key := boardRoom.getBoardRoomSessionKey(boardRoom.guuid())

	_, err = boardRoom.MessageBroker.GetClient().Set(context.Background(), key, tokenString, 0).Result()
	return tokenString, err
}

func (boardRoom *RedisBoardRoom) getBoardRoomSession() (string, error) {
	key := boardRoom.getBoardRoomSessionKey(boardRoom.guuid())
	return boardRoom.MessageBroker.GetClient().Get(context.Background(), key).Result()
}

func (boardRoom *RedisBoardRoom) hasSession() error {
	key := boardRoom.getBoardRoomSessionKey(boardRoom.guuid())
	_, err := boardRoom.MessageBroker.GetClient().Get(context.Background(), key).Result()
	return err
}

func (boardRoom *RedisBoardRoom) boardRoomGetMessages() ([]BoardRoomMessage, IError) {
	key := boardRoom.getKeyBoardRoomConversationMessages()
	values, err := boardRoom.MessageBroker.GetClient().ZRange(context.Background(), key, 0, -1).Result()
	if err != nil {
		return nil, newError(errBoardRoomMessages, err)
	}

	messages := make([]BoardRoomMessage, 0, len(values))

	for i := range values {
		message := BoardRoomMessage{}
		dec := json.NewDecoder(strings.NewReader(values[i]))
		err := dec.Decode(&message)
		if err != nil {
			return nil, newError(errBoardRoomMessages, err)
		}

		messages = append(messages, message)
	}

	return messages, nil
}

func (boardRoom *RedisBoardRoom) onlineBoardRoomPeers() ([]BoardRoomSeat, IError) {

	var err error

	key := boardRoom.getKeyBoardRoomSeats()
	peersOnline, err := boardRoom.MessageBroker.GetClient().HGetAll(context.Background(), key).Result()

	if err != nil {
		return nil, newError(errOnlineBoardRoomPeers, err)
	}
	daoProject := dao.NewProjectDAO()
	project, err := daoProject.GetProjectById(boardRoom.guuid())
	if err != nil {
		return nil, newError(errOnlineBoardRoomPeers, err)
	}

	daoOwnerProject := dao.NewUserDAO()
	owner, err := daoOwnerProject.GetById(project.UserId)
	if err != nil {
		return nil, newError(errOnlineBoardRoomPeers, err)
	}
	ownerdto := response.User(owner)
	stakeholders := response.FetchProjectStakeholders(boardRoom.guuid())
	onlinePeers := make([]BoardRoomSeat, 0, len(peersOnline))

	for k := range peersOnline {
		if k == project.UserId {
			onlinePeers = append(onlinePeers, BoardRoomSeat{
				UUID:         ownerdto.ID,
				Status:       online,
				FirstName:    ownerdto.FirstName,
				LastName:     ownerdto.LastName,
				ProfileImage: ownerdto.ProfileImage,
			})
		} else {
			for _, stakeholder := range stakeholders {
				if stakeholder.ID == k {
					onlinePeers = append(onlinePeers, BoardRoomSeat{
						UUID:         stakeholder.ID,
						Status:       online,
						FirstName:    stakeholder.FirstName,
						LastName:     stakeholder.LastName,
						Role:         stakeholder.Role,
						ProfileImage: stakeholder.ProfileImage,
					})
				}
			}
		}

	}

	return onlinePeers, nil
}

func (boardRoom *RedisBoardRoom) joinBoardRoom(clientId string) (*broker.ChannelPubSub, IError) {
	return boardRoom.sync(clientId)
}

func (boardRoom *RedisBoardRoom) leaveBoardRoom(message wsClientMsg) IError {

	if err := boardRoom.publishMessageToBoardRoom(message); err != nil {
		return err
	}

	err := boardRoom.leaveBroadcastChannel(message.ClientID)
	if err != nil {
		return newError(errLeaveBroadcastChannel, err)
	}

	errI := boardRoom.statusBoardRoom()
	if errI != nil {
		return errI
	}

	return nil
}

func (boardRoom *RedisBoardRoom) sync(clientId string) (*broker.ChannelPubSub, IError) {

	err := boardRoom.takeSeatBoardRoom(clientId)
	if err != nil {
		return nil, newError(errJoinBroadcastChannel, err)
	}

	errI := boardRoom.statusBoardRoom()
	if err != nil {
		return nil, errI
	}

	pubSubChannel := boardRoom.MessageBroker.ChannelSubscribe(boardRoom.guuid())
	return pubSubChannel, nil
}

func (boardRoom *RedisBoardRoom) takeSeatBoardRoom(clientId string) error {
	key := boardRoom.getKeyBoardRoomSeats()
	if err := boardRoom.MessageBroker.GetClient().HSet(context.Background(), key, clientId, time.Now().String()).Err(); err != nil {
		return err
	}

	return nil
}

func (boardRoom *RedisBoardRoom) leaveBroadcastChannel(clientId string) error {
	key := boardRoom.getKeyBoardRoomSeats()
	val, err := boardRoom.MessageBroker.GetClient().HDel(context.Background(), key, clientId).Result()

	if val == 0 {
		return errors.New("missing client in board room")
	}

	if err != nil {
		return err
	}

	_, err = boardRoom.MessageBroker.CloseChannel(boardRoom.UUID)
	if err != nil {
		return err
	}

	return nil
}

func (boardRoom *RedisBoardRoom) getKeyBoardRoomSeats() string {
	return fmt.Sprintf("%s.%s", keyBoardRoomStakeholders, boardRoom.guuid())
}

func (boardRoom *RedisBoardRoom) getBoardRoomSessionKey(BoardRoomID string) string {
	return fmt.Sprintf("%s.%s", keyBoardRoomSession, BoardRoomID)
}

func (boardRoom *RedisBoardRoom) publishMessageToBoardRoom(message wsClientMsg) IError {
	boardRoomMesssage := &BoardRoomMessage{
		BoardRoomID: message.BoardRoomID,
		ClientID:    message.ClientID,
		UUID:        uuid.NewString(),
		Message:     message.Msg,
		PeerId:      message.PeerId,
		CreatedAt:   time.Now(),
		Session:     message.SessionUUID,
	}

	err := boardRoom.publish(boardRoomMesssage)
	if err != nil {
		return newError(errFailedPublishMessageToBoardRoom, err)
	}

	return nil
}

func (boardRoom *RedisBoardRoom) publish(boardRoomMesssage *BoardRoomMessage) error {
	buff := bytes.NewBufferString("")
	enc := json.NewEncoder(buff)
	err := enc.Encode(boardRoomMesssage)
	if err != nil {
		return err
	}

	if err = boardRoom.MessageBroker.GetClient().Publish(context.Background(), boardRoom.UUID, buff.String()).Err(); err != nil {
		return err
	}

	return nil
}

func (boardRoom *RedisBoardRoom) statusBoardRoom() IError {
	key := boardRoom.getKeyBoardRoomSeats()
	len, err := boardRoom.MessageBroker.GetClient().HLen(context.Background(), key).Result()

	if err != nil {
		return newError(errBoardRoomSizeRecovery, err)
	}

	if len > 1 {
		boardRoom.Status = online
	} else {
		boardRoom.Status = Offline
	}

	return nil
}

func (boardRoom *RedisBoardRoom) getBoardRoomStatus() Status {
	return boardRoom.Status
}

func (boardRoom *RedisBoardRoom) boardRoomConversations(msg wsClientMsg, blobPayload []byte) IError {
	channelMsg, err := boardRoom.serialiseChannelMessage(msg, blobPayload)
	if err != nil {
		return newError(errboardRoomConversations, err)
	}

	return boardRoom.appendMessage(channelMsg)
}

func (boardRoom *RedisBoardRoom) serialiseChannelMessage(msg wsClientMsg, blobPayload []byte) (*ChannelMessage, error) {

	var msgBlob map[string]interface{}
	var msgPayload BoardRoomConversationMessage

	messageId := uuid.New().String()
	creationTime := time.Now()
	channelMsg := &ChannelMessage{}

	if err := json.Unmarshal(blobPayload, &msgBlob); err != nil {
		return channelMsg, err
	}

	log.Printf("serialising blob :::: [[ %v ]]", msgBlob)

	for k, v := range msgBlob["conversation"].(map[string]interface{}) {
		switch k {
		case "message":
			for kMsg, vMsg := range v.(map[string]interface{}) {
				switch kMsg {
				case "body":
					msgPayload.Body = vMsg.(string)
				case "content_type":
					msgPayload.ContentType = vMsg.(string)
				}
			}
		case "attachments":
			var attachments []broker.Attachment
			attachments, err := boardRoom.addAttachment(msgBlob, attachments, messageId)
			log.Printf("loaded attachments [[ %v ]]", attachments)
			if err != nil {
				return channelMsg, err
			}
			msgPayload.Attachments = attachments
		}
	}

	msgPayload.UUID = messageId
	msgPayload.SenderId = msg.ClientID
	msgPayload.CreatedAt = creationTime

	channelMsg.BoardRoomID = msg.BoardRoomID
	channelMsg.ClientID = msg.ClientID
	channelMsg.Session = msg.SessionUUID
	channelMsg.Message = msgPayload

	return channelMsg, nil
}

func (boardRoom *RedisBoardRoom) addAttachment(msgBlob map[string]interface{}, attachments []broker.Attachment, messageId string) ([]broker.Attachment, error) {
	msgType := msgBlob["conversation"].(map[string]interface{})["message"].(map[string]interface{})["content_type"].(string)
	messageAttachments := msgBlob["conversation"].(map[string]interface{})["attachments"].([]interface{})
	if msgType != "text" {
		for _, attachment := range messageAttachments {
			attachmentId := uuid.New().String()
			url, err := boardRoom.uploadBlob(attachment, attachmentId, messageId)
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

func (boardRoom *RedisBoardRoom) uploadBlob(file interface{}, attachmentId, messageId string) (string, error) {

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

func (boardRoom *RedisBoardRoom) appendMessage(channelMsg *ChannelMessage) IError {

	err := boardRoom.conversationAppendMessage(channelMsg)
	if err != nil {
		return newError(errBoardRoomAppendMessageFailed, err)
	}

	return nil
}

func (boardRoom *RedisBoardRoom) conversationAppendMessage(channelMsg *ChannelMessage) error {

	msg := BoardRoomConversationMessage{
		UUID:        channelMsg.Message.UUID,
		Body:        channelMsg.Message.Body,
		ContentType: channelMsg.Message.ContentType,
		CreatedAt:   channelMsg.Message.CreatedAt,
		SenderId:    channelMsg.Message.SenderId,
		Attachments: channelMsg.Message.Attachments,
	}

	buff := bytes.NewBufferString("")
	enc := json.NewEncoder(buff)
	err := enc.Encode(msg)
	if err != nil {
		return err
	}

	boardRoomMesssage := &BoardRoomMessage{
		BoardRoomID:  channelMsg.BoardRoomID,
		ClientID:     channelMsg.ClientID,
		UUID:         uuid.NewString(),
		CreatedAt:    msg.CreatedAt,
		Session:      channelMsg.Session,
		Conversation: buff.String(),
	}

	err = boardRoom.publish(boardRoomMesssage)
	if err != nil {
		return err
	}

	buff = bytes.NewBufferString("")
	enc = json.NewEncoder(buff)
	err = enc.Encode(boardRoomMesssage)
	if err != nil {
		return err
	}

	key := boardRoom.getKeyBoardRoomConversationMessages()
	err = boardRoom.MessageBroker.GetClient().ZAdd(context.Background(), key, redis.Z{Score: float64(msg.CreatedAt.Unix()), Member: buff.String()}).Err()
	if err != nil {
		return err
	}

	return nil
}

func (boardRoom *RedisBoardRoom) getKeyBoardRoomConversationMessages() string {
	return fmt.Sprintf("%s.%s", keyBoardRoomConversations, boardRoom.guuid())
}
