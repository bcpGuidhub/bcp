package inquisite

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/architecture/cqrs"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands/schemas"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func RetractVoteUpAnswer(userSessionID string, conn *websocket.Conn, op int, write message.Write, messagePayload map[string]interface{}, aggregate IEventAggregate) message.IErrorMessage {
	var command commands.ICommand
	commandBus := cqrs.CQRSFacade.CommandBus()

	postDate := timestamppb.New(time.Now())
	cmdId, _ := uuid.NewUUID()
	vote := &schemas.RetractVoteUpAnswer{
		Id:       &schemas.UUID{Value: cmdId.String()},
		AnswerId: &schemas.UUID{Value: messagePayload["aggregate_id"].(string)},
		Cast:     postDate,
		VoterId:  aggregate.GUUID(),
	}

	command = &commands.RetractVoteUpAnswer{
		Command: &commands.Command{
			Payload: vote,
		},
	}

	err := commandBus.Send(context.Background(), command)

	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	err = write(conn, op, &message.Message{
		Type:  message.MessageTypeRetractVoteUpAnswer,
		SUUID: userSessionID,
	})

	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	return nil
}
