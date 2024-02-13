package inquisite

import (
	"context"
	"errors"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/microcosm-cc/bluemonday"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/architecture/cqrs"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands/schemas"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	"google.golang.org/protobuf/types/known/timestamppb"
)

var (
	ErrZeroLengthTags = errors.New("post has no tags")
)
var PostContentSaniter *bluemonday.Policy

type IEventAggregate interface {
	GUUID() string
}

func AddPost(userSessionID string, conn *websocket.Conn, op int, write message.Write, messagePayload map[string]interface{}, aggregate IEventAggregate) message.IErrorMessage {
	var command commands.ICommand
	var postTags []*schemas.PostTag
	commandBus := cqrs.CQRSFacade.CommandBus()

	postTags, err := addTags(messagePayload, postTags)
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	postDate := timestamppb.New(time.Now())
	postId, _ := uuid.NewUUID()
	cmdId, _ := uuid.NewUUID()
	post := &schemas.AddPost{
		Id:          &schemas.UUID{Value: cmdId.String()},
		Title:       messagePayload["title"].(string),
		Description: sanitizeTextInput(messagePayload["description"].(string)),
		AggregateId: &schemas.UUID{Value: postId.String()},
		PostTag:     postTags,
		PostDate:    postDate,
		Status:      setStatus(messagePayload["publish"].(bool)),
		UserId:      aggregate.GUUID(),
	}
	if err := checkPostQuality(post); err != nil {
		errMessage := message.ErrorMessage(0, err, userSessionID, messagePayload)
		write(conn, op, errMessage)
		return nil
	}

	command = &commands.AddPost{
		Command: &commands.Command{
			Payload: post,
		},
	}

	log.Printf("command sent by client ---- %+v \n ", command)
	err = commandBus.Send(context.Background(), command)
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	err = write(conn, op, &message.Message{
		Type:  message.MessageTypeAddPost,
		SUUID: userSessionID,
	})

	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	return nil
}

func setStatus(status bool) schemas.PostStatus {
	if status {
		return schemas.PostStatus_ACTIVE
	}
	return schemas.PostStatus_ARCHIVED
}

func addTags(msgBlob map[string]interface{}, tags []*schemas.PostTag) ([]*schemas.PostTag, error) {
	postTags := msgBlob["tags"].([]interface{})

	for _, tag := range postTags {
		tags = append(tags, &schemas.PostTag{
			Field: tag.(map[string]interface{})["label"].(string),
		})
	}

	return tags, nil
}

func checkPostQuality(post *schemas.AddPost) error {
	if len(post.PostTag) == 0 {
		return ErrZeroLengthTags
	}
	return nil
}

func sanitizeTextInput(clientText string) string {
	return PostContentSaniter.Sanitize(clientText)
}
