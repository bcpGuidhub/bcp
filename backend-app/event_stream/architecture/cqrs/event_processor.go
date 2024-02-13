package cqrs

import (
	"context"
	"log"

	"github.com/pkg/errors"
	eventstream "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/pkg/logging"
)

type EventHandler interface {
	HandlerName() string
	NewEvent() interface{}
	Handle(ctx context.Context, event interface{}) error
}

// EventProcessor determines which EventHandler should handle event received from event bus.
type EventProcessor struct {
	handlers      []EventHandler
	generateTopic func(cmd interface{}) string
	consumer      ConsumerConstructor
	logger        logging.BCPLogger
	marshaler     eventstream.IEventMessageMarshaler
}

func NewEventProcessor(
	handlers []EventHandler,
	generateTopic func(cmd interface{}) string, consumer ConsumerConstructor, logger logging.BCPLogger, marshaler eventstream.IEventMessageMarshaler) *EventProcessor {
	return &EventProcessor{
		handlers,
		generateTopic,
		consumer,
		logger,
		marshaler,
	}
}

func (eventProcessor *EventProcessor) AddHandlersToRouter(r *eventstream.Router) error {
	for i := range eventProcessor.Handlers() {
		handler := eventProcessor.handlers[i]
		handlerName := handler.HandlerName()
		// eventName := eventstream.FullyQualifiedStructName(handler.NewEvent())
		// topicName := eventProcessor.generateTopic(eventName)
		topicName := eventProcessor.generateTopic(handler.NewEvent())

		logger, _ := logging.NewBCPZapLogger("info")

		handlerFunc, err := eventProcessor.routerHandlerFunc(handler, logger)
		if err != nil {
			return err
		}

		logger.Debug("Adding CQRS event handler to router")

		subscriber, err := eventProcessor.consumer(topicName)
		if err != nil {
			return errors.Wrap(err, "cannot create subscriber for event processor")
		}

		r.AddNoPublisherHandler(
			handlerName,
			topicName,
			subscriber,
			handlerFunc,
		)
	}

	return nil
}

func (eventProcessor *EventProcessor) Handlers() []EventHandler {
	return eventProcessor.handlers
}

func (eventProcessor *EventProcessor) routerHandlerFunc(handler EventHandler, logger logging.BCPLogger) (eventstream.NoPublishHandlerFunc, error) {
	initEvent := handler.NewEvent()
	expectedEventName := eventstream.StructName(initEvent)

	if err := eventProcessor.validateEvent(initEvent); err != nil {
		return nil, err
	}

	return func(msg *eventstream.Message) error {
		log.Printf("EventProcessor[routerHandlerFunc 85] -------- message for command handler -- [%v] \n", msg)
		event := handler.NewEvent()
		messageEventName := eventstream.NameFromMessage(msg)
		log.Printf("EventProcessor[routerHandlerFunc 98] -------- event -- [%v] ---- messageEventName [%v] \n", initEvent, messageEventName)
		if messageEventName != expectedEventName {

			return nil
		}

		if err := eventProcessor.marshaler.Unmarshal(msg, event); err != nil {
			return err
		}
		log.Printf("EventProcessor[routerHandlerFunc 97] -------- event after unmarshaling the message -- [%+v] \n", event)
		if err := handler.Handle(msg.Context(), event); err != nil {
			return err
		}

		return nil
	}, nil
}

func (eventProcessor *EventProcessor) validateEvent(event interface{}) error {
	// EventHandler's NewEvent must return a pointer, because it is used to unmarshal
	if err := isPointer(event); err != nil {
		return errors.Wrap(err, "command must be a non-nil pointer")
	}

	return nil
}
