package cqrs

import (
	"context"
	"fmt"
	"log"

	"github.com/pkg/errors"
	eventstream "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/pkg/logging"
)

type CommandHandler interface {
	HandlerName() string
	NewCommand() interface{}
	Handle(ctx context.Context, cmd interface{}) error
}

type CommandProcessor struct {
	handlers      []CommandHandler
	generateTopic func(cmd interface{}) string
	consumer      ConsumerConstructor
	logger        logging.BCPLogger
	marshaler     eventstream.IEventMessageMarshaler
}

type ConsumerConstructor func(handlerName string) (eventstream.Reader, error)

func NewCommandProcessor(handlers []CommandHandler, generateTopic func(cmd interface{}) string, consumer ConsumerConstructor, logger logging.BCPLogger, marshaler eventstream.IEventMessageMarshaler) *CommandProcessor {
	return &CommandProcessor{
		handlers,
		generateTopic,
		consumer,
		logger,
		marshaler,
	}
}

func (cmdProcessor *CommandProcessor) AddHandlersToRouter(r *eventstream.Router) error {
	handledCommands := map[string]struct{}{}

	for i := range cmdProcessor.handlers {
		handler := cmdProcessor.handlers[i]
		log.Printf("handler === [%v]\n", handler)
		handlerName := handler.HandlerName()
		log.Printf("handlerName === [%v]\n", handlerName)
		commandName := eventstream.FullyQualifiedStructName(handler.NewCommand())
		log.Printf("commandName === [%v]\n", commandName)
		topicName := cmdProcessor.generateTopic(handler.NewCommand())
		log.Printf("topicName === %s\n", topicName)

		if _, ok := handledCommands[commandName]; ok {
			return DuplicateCommandHandlerError{commandName}
		}

		handledCommands[commandName] = struct{}{}

		logger, _ := logging.NewBCPZapLogger("info")

		handlerFunc, err := cmdProcessor.routerHandlerFunc(handler, logger)
		if err != nil {
			return err
		}

		logger.Debug("Adding CQRS command handler to router")

		subscriber, err := cmdProcessor.consumer(topicName)
		log.Printf("handler subscribed to topic  ---- %s \n", topicName)
		log.Printf("subscriber %+v \n", subscriber)
		if err != nil {
			return errors.Wrap(err, "cannot create subscriber for command processor")
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

func (cmdProcessor *CommandProcessor) routerHandlerFunc(handler CommandHandler, logger logging.BCPLogger) (eventstream.NoPublishHandlerFunc, error) {
	cmd := handler.NewCommand()
	cmdName := eventstream.StructName(cmd)

	if err := cmdProcessor.validateCommand(cmd); err != nil {
		return nil, err
	}

	return func(msg *eventstream.Message) error {
		log.Printf("cmdProcessor [routerHandlerFunc 95] -------- message for command handler -- [%v] \n", msg)
		cmd := handler.NewCommand()
		messageCmdName := eventstream.NameFromMessage(msg)
		log.Printf("cmdProcessor [routerHandlerFunc 98] -------- cmd -- [%v] ---- messageCmdName [%v] \n", cmd, messageCmdName)
		if messageCmdName != cmdName {

			return nil
		}

		if err := cmdProcessor.marshaler.Unmarshal(msg, cmd); err != nil {
			return err
		}

		log.Printf("cmdProcessor [routerHandlerFunc 108] -------- cmd after unmarshaling the message -- [%+v] \n", cmd)
		if err := handler.Handle(msg.Context(), cmd); err != nil {
			logger.Debug("Error when handling command")
			return err
		}

		return nil
	}, nil
}

// DuplicateCommandHandlerError occurs when a handler with the same name already exists.
type DuplicateCommandHandlerError struct {
	CommandName string
}

func (d DuplicateCommandHandlerError) Error() string {
	return fmt.Sprintf("command handler for command %s already exists", d.CommandName)
}

func (p CommandProcessor) validateCommand(cmd interface{}) error {
	// CommandHandler's NewCommand must return a pointer, because it is used to unmarshal
	if err := isPointer(cmd); err != nil {
		return errors.Wrap(err, "command must be a non-nil pointer")
	}

	return nil
}
