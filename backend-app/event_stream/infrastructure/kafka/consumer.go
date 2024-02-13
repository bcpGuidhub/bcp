package kafka

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/segmentio/kafka-go"
	"github.com/segmentio/kafka-go/sasl/plain"
	eventstream "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/pkg/logging"
)

type Consumer struct {
	reader      *kafka.Reader
	consumersWg sync.WaitGroup
	closing     chan struct{}
	closed      bool
	logger      logging.BCPLogger
	errChan     chan error
}

// NewConsumer creates new kafka consumer.
func NewConsumer(topic string, appLogger logging.BCPLogger) *Consumer {
	var reader *kafka.Reader

	if Env == "dev" {
		reader = kafka.NewReader(kafka.ReaderConfig{
			Brokers: []string{"kafka0:9092", "kafka1:9092", "kafka2:9092"},
			Topic:   topic,
			// GroupID: uuid.New().String(),
			GroupID: topic,
			// Partition: 0,
			// MinBytes:  10e3, // 10KB
			// MaxBytes:  10e6, // 10MB
			StartOffset: kafka.LastOffset,
		})
	} else {
		// mechanism, err := scram.Mechanism(scram.SHA512, os.Getenv("KAFKA_SASL_USERNAME"), os.Getenv("KAFKA_SASL_PASSWORD"))
		// if err != nil {
		// 	panic(err)
		// }
		mechanism := plain.Mechanism{
			Username: os.Getenv("KAFKA_SASL_USERNAME"),
			Password: os.Getenv("KAFKA_SASL_PASSWORD"),
		}

		dialer := &kafka.Dialer{
			Timeout:       10 * time.Second,
			DualStack:     true,
			SASLMechanism: mechanism,
		}

		reader = kafka.NewReader(kafka.ReaderConfig{
			Brokers: []string{os.Getenv("KAFKA_BOOTSTRAP_SERVER_9092"), os.Getenv("KAFKA_BOOTSTRAP_SERVER_9093")},
			Topic:   topic,
			GroupID: uuid.New().String(),
			// Partition: 0,
			// MinBytes:  10e3, // 10KB
			// MaxBytes:  10e6, // 10MB
			StartOffset: kafka.LastOffset,
			Dialer:      dialer,
		})
	}

	return &Consumer{
		reader:  reader,
		logger:  appLogger.Clone(),
		closing: make(chan struct{}),
		errChan: make(chan error),
	}
}

func (c *Consumer) Subscribe(ctx context.Context) (<-chan *eventstream.Message, error) {
	if c.closed {
		return nil, errors.New("subscriber closed")
	}
	c.consumersWg.Add(1)

	c.logger.AddContext("kafka consumer topic", c.reader.Config().Topic)
	c.logger.AddContext("kafka consumer uuid", uuid.New().String())
	c.logger.AddContext("kafka consumer group", c.reader.Config().GroupID)
	c.logger.Info("Subscribing to Kafka topic")

	messageChan := make(chan *eventstream.Message)

	consumeClosed, err := c.consumeMessages(ctx, messageChan)
	log.Printf("now running the subscriber :: [%v]", consumeClosed)
	if err != nil {
		c.consumersWg.Done()
		return nil, err
	}

	go func() {
		// log.Println("will try reconnecting")
		// c.handleReconnects(ctx, messageChan, consumeClosed)
		if consumeClosed != nil {
			log.Println("------------- consuming ------------- ")
			<-consumeClosed
			c.logger.Debug("consumeMessages stopped")
		} else {
			c.logger.Debug("empty consumeClosed")
		}
		close(messageChan)
		c.consumersWg.Done()
	}()

	return messageChan, nil
}

func (c *Consumer) Close() error {
	if c.closed {
		return nil
	}

	c.closed = true
	close(c.closing)
	c.consumersWg.Wait()

	c.logger.Debug("Kafka subscriber closed")

	return nil
}

func (c *Consumer) handleReconnects(ctx context.Context, output chan *eventstream.Message, consumeClosed chan struct{}) {
	for {
		// nil channel will cause deadlock
		if consumeClosed != nil {
			log.Println("------------- consuming ------------- ")
			<-consumeClosed
			c.logger.Debug("consumeMessages stopped")
		} else {
			c.logger.Debug("empty consumeClosed")
		}

		select {
		// it's important to don't exit before consumeClosed,
		// to not trigger s.subscribersWg.Done() before consumer is closed
		case <-c.closing:
			c.logger.Debug("Closing subscriber, no reconnect needed")
			return
		case <-ctx.Done():
			c.logger.Debug("Ctx cancelled, no reconnect needed")
			return
		default:
			c.logger.Debug("Not closing, reconnecting")
		}

		// log.Println("Reconnecting consumer")

		// var err error
		// consumeClosed, err = c.consumeMessages(ctx, output)
		// if err != nil {
		// 	c.logger.Error(fmt.Sprintf("Cannot reconnect messages consumer : %v", err))
		// }
	}
}

func (c *Consumer) consumeMessages(ctx context.Context, messageChan chan *eventstream.Message) (consumeMessagesClosed chan struct{}, err error) {

	ctx, cancel := context.WithCancel(ctx)
	go func() {
		select {
		case <-c.closing:
			c.logger.Debug("Closing subscriber, cancelling consumeMessages")
			cancel()
		case <-ctx.Done():
			// avoid goroutine leak
		}
	}()
	log.Println("begin consuming")
	consumeMessagesClosed, err = c.consume(ctx, messageChan)
	log.Printf("consumeMessagesClosed [%v]", consumeMessagesClosed)
	if err != nil {
		c.logger.Debug(
			"Starting consume failed, cancelling context")
		cancel()
		return nil, err
	}

	go func() {
		log.Println("<-consumeMessagesClosed")
		<-consumeMessagesClosed
		log.Println("after <-consumeMessagesClosed")
		if err := c.reader.Close(); err != nil {
			c.logger.Error(fmt.Sprintf("Cannot close client %v", err))
		} else {
			c.logger.Debug("consumer closed")
		}
	}()

	return consumeMessagesClosed, nil
}

func (c *Consumer) unmarshal(kafkaMessage kafka.Message) (*eventstream.Message, error) {
	metadata := make(eventstream.Metadata, len(kafkaMessage.Headers))
	for _, header := range kafkaMessage.Headers {
		metadata.Set(string(header.Key), string(header.Value))
	}
	msg := eventstream.NewMessage(metadata.Get("message_uuid"), kafkaMessage.Topic, string(kafkaMessage.Key), kafkaMessage.Value)
	msg.Metadata = metadata
	return msg, nil
}

func (c *Consumer) consume(ctx context.Context, output chan *eventstream.Message) (chan struct{}, error) {
	consumeClosed := make(chan struct{})
	handleErrorsCtx, cancelHandleErrors := context.WithCancel(context.Background())
	handleErrorsDone := c.handleErrors(handleErrorsCtx)
	go func() {
		defer func() {
			cancelHandleErrors()
			<-handleErrorsDone

			if err := c.reader.Close(); err != nil {
				c.logger.Info(fmt.Sprintf("consumer close with error %v", err))
			}

			c.logger.Info("Consuming done")
			close(consumeClosed)
		}()

	ConsumeLoop:
		for {
			select {
			default:
				c.logger.Debug("Not closing")
			case <-c.closing:
				c.logger.Debug("consumer is closing, stopping Consume loop")
				break ConsumeLoop
			case <-ctx.Done():
				c.logger.Debug("Ctx was cancelled, stopping Consume loop")
				break ConsumeLoop
			}

			kafkaMessage, err := c.reader.ReadMessage(ctx)
			if err != nil {
				c.logger.Error(err.Error())
				break ConsumeLoop
			}
			fmt.Printf("------- [kafka message] at offset %d: %s = %s\n", kafkaMessage.Offset, string(kafkaMessage.Key), string(kafkaMessage.Value))

			message, err := c.unmarshal(kafkaMessage)
			if err != nil {
				c.logger.Error(err.Error())
				break ConsumeLoop
			}
			log.Printf("----- [app message]  ===  %+v  ----------- ", message)
			output <- message

		}
	}()

	return consumeClosed, nil
}

func (c *Consumer) handleErrors(ctx context.Context) chan struct{} {
	done := make(chan struct{})

	go func() {
		defer close(done)

		for {
			select {
			case err := <-c.errChan:
				if err == nil {
					continue
				}

				c.logger.Error(fmt.Sprintf("segmentio kafka-go internal error %v", err))
			case <-ctx.Done():
				return
			}
		}
	}()

	return done
}
