package kafka

import (
	"context"
	"log"
	"os"

	"github.com/segmentio/kafka-go"
	"github.com/segmentio/kafka-go/sasl/plain"
	eventstream "gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream"
)

var Env string

type Producer struct {
	writer *kafka.Writer
}

func NewProducer() *Producer {
	var writer *kafka.Writer

	if Env == "dev" {
		writer = &kafka.Writer{
			Addr:     kafka.TCP("kafka0:9092", "kafka1:9092", "kafka2:9092"),
			Balancer: &kafka.LeastBytes{},
		}
	} else {
		// mechanism, err := scram.Mechanism(scram.SHA512, os.Getenv("KAFKA_SASL_USERNAME"), os.Getenv("KAFKA_SASL_PASSWORD"))
		// if err != nil {
		// 	panic(err)
		// }

		mechanism := plain.Mechanism{
			Username: os.Getenv("KAFKA_SASL_USERNAME"),
			Password: os.Getenv("KAFKA_SASL_PASSWORD"),
		}
		// Transports are responsible for managing connection pools and other resources,
		// it's generally best to create a few of these and share them across your
		// application.
		sharedTransport := &kafka.Transport{
			SASL: mechanism,
		}

		writer = &kafka.Writer{
			// Addr:      kafka.TCP(os.Getenv("KAFKA_BOOTSTRAP_SERVER_9092"), os.Getenv("KAFKA_BOOTSTRAP_SERVER_9093")),
			Addr: kafka.TCP(
				"kafka-1-kafka-0.kafka-1-kafka-headless.production.svc.cluster.local:9092",
				"kafka-1-kafka-2.kafka-1-kafka-headless.production.svc.cluster.local:9092",
				"kafka-1-kafka-1.kafka-1-kafka-headless.production.svc.cluster.local:9092",
			),
			Balancer:  &kafka.Hash{},
			Transport: sharedTransport,
		}
	}

	return &Producer{
		writer: writer,
	}
}

func (p *Producer) Write(messages ...*eventstream.Message) error {
	kMessages := p.marshal(messages...)
	log.Printf("marshal to kafka.Message %+v \n", kMessages)
	if err := p.writer.WriteMessages(context.Background(), kMessages...); err != nil {
		log.Printf("error while writing to kafka producer %+v", err)
		return err
	}
	log.Println("-------------- done writing to producer -----------------")
	return nil
}

func (p *Producer) Close() error {
	return p.writer.Close()
}

func (p *Producer) marshal(messages ...*eventstream.Message) []kafka.Message {
	m := make([]kafka.Message, 0, len(messages))
	for _, message := range messages {
		km := kafka.Message{
			Topic: message.Topic,
			Value: message.Payload,
			Key:   []byte(message.Key),
		}
		km.Headers = []kafka.Header{
			{Key: "message_uuid", Value: []byte(message.UUID)},
			{Key: "name", Value: []byte(message.Metadata.Get("name"))},
		}
		m = append(m, km)
	}
	return m
}
