package kafka

import (
	"context"
	"log"

	"github.com/google/uuid"
	eventstream "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream"
)

type CommandBusWriteStream struct {
	producer  eventstream.Writer
	marshaler eventstream.IEventMessageMarshaler
}

func NewCommandbusWriteStream() *CommandBusWriteStream {
	return &CommandBusWriteStream{
		producer:  NewProducer(),
		marshaler: NewProtoBufMarshaler(),
	}
}

func (bus *CommandBusWriteStream) Send(ctx context.Context, command interface{}) error {
	log.Printf("begin marshalling the message %+v \n", command)
	msg, err := bus.marshaler.Marshal(command)
	if err != nil {
		return err
	}

	log.Printf("write message to producer %+v \n", msg)
	return bus.producer.Write(msg)
}

func NewProtoBufMarshaler() eventstream.IEventMessageMarshaler {
	return eventstream.ProtobufMarshaler{
		NewUUID:      func() string { return uuid.New().String() },
		GenerateName: eventstream.StructName,
	}
}
