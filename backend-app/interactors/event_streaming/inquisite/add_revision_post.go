package inquisite

import (
	"context"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/architecture/cqrs"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands/schemas"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func AddRevisionToPost(userSessionID string, conn *websocket.Conn, op int, write message.Write, messagePayload map[string]interface{}, aggregate IEventAggregate) message.IErrorMessage {
	var command commands.ICommand
	commandBus := cqrs.CQRSFacade.CommandBus()
	var postTags []*schemas.PostTag
	postTags, err := addTags(messagePayload, postTags)
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	postDate := timestamppb.New(time.Now())
	cmdId, _ := uuid.NewUUID()
	editPost := &schemas.AddRevisionToPost{
		Id:          &schemas.UUID{Value: cmdId.String()},
		PostDate:    postDate,
		AggregateId: &schemas.UUID{Value: messagePayload["aggregate_id"].(string)},
		Author:      aggregate.GUUID(),
		Description: sanitizeTextInput(messagePayload["description"].(string)),
		EditSummary: sanitizeTextInput(messagePayload["summary"].(string)),
		Title:       sanitizeTextInput(messagePayload["title"].(string)),
		PostTag:     postTags,
	}

	command = &commands.AddRevisionToPost{
		Command: &commands.Command{
			Payload: editPost,
		},
	}

	log.Printf("command edit post sent by client ---- %+v \n ", command)
	err = commandBus.Send(context.Background(), command)
	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	err = write(conn, op, &message.Message{
		Type:  message.MessageTypeAddRevisionToPost,
		SUUID: userSessionID,
	})

	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	return nil
}
