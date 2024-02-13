package kafka

import (
	"context"

	eventstream "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream"
)

var EventBus *EventBusWriteStream

// EventBus transports events to event handlers.
type EventBusWriteStream struct {
	producer  eventstream.Writer
	marshaler eventstream.IEventMessageMarshaler
}

func NewEventBusWriteStream() *EventBusWriteStream {
	return &EventBusWriteStream{
		producer:  NewProducer(),
		marshaler: NewProtoBufMarshaler(),
	}
}

func (bus *EventBusWriteStream) Send(ctx context.Context, event interface{}) error {
	msg, err := bus.marshaler.Marshal(event)
	if err != nil {
		return err
	}

	return bus.producer.Write(msg)
}
