package eventstream

import (
	"log"
	"reflect"

	"github.com/google/uuid"
	"github.com/pkg/errors"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/event_stream/commands"
	"google.golang.org/protobuf/proto"
)

type IEventMessageMarshaler interface {
	Marshal(v interface{}) (*Message, error)
	Unmarshal(msg *Message, v interface{}) (err error)
}

// NoProtoMessageError is returned when the given value does not implement proto.Message.
type NoProtoMessageError struct {
	v interface{}
}

type ProtobufMarshaler struct {
	NewUUID      func() string
	GenerateName func(v interface{}) string
}

func (e NoProtoMessageError) Error() string {
	rv := reflect.ValueOf(e.v)
	if rv.Kind() != reflect.Ptr {
		return "v is not proto.Message, you must pass pointer value to implement proto.Message"
	}

	return "v is not proto.Message"
}

func (m ProtobufMarshaler) Marshal(v interface{}) (*Message, error) {
	cmd, ok := v.(commands.ICommand)
	if !ok {
		return nil, errors.WithStack(NoProtoMessageError{v})
	}

	b, err := proto.Marshal(cmd.GetPayload())
	if err != nil {
		return nil, err
	}

	msg := NewMessage(
		m.newUUID(),
		m.GenerateName(cmd),
		m.Name(cmd),
		b,
	)
	msg.Metadata.Set("message_uuid", msg.UUID)
	log.Println("------- add  meta field to message -----------")
	log.Printf("meta field === %s ", m.Name(v))
	msg.Metadata.Set("name", m.Name(v))
	log.Println("------- marshaled message -----------")
	log.Println(msg)
	return msg, nil
}

func (m ProtobufMarshaler) newUUID() string {
	if m.NewUUID != nil {
		return m.NewUUID()
	}

	// default
	return uuid.New().String()
}

func (ProtobufMarshaler) Unmarshal(msg *Message, v interface{}) (err error) {
	return proto.Unmarshal(msg.Payload, v.(proto.Message))
}

func (m ProtobufMarshaler) Name(event interface{}) string {
	if m.GenerateName != nil {
		return m.GenerateName(event)
	}
	return FullyQualifiedStructName(event)
}

func (m ProtobufMarshaler) NameFromMessage(msg *Message) string {
	return msg.Metadata.Get("name")
}

// NameFromMessage returns the metadata name value for a given Message.
func NameFromMessage(msg *Message) string {
	return msg.Metadata.Get("name")
}
