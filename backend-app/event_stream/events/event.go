package events

import (
	"google.golang.org/protobuf/proto"
)

type (
	EventType string
	EventData proto.Message
)

const (
	EventTypePostAdded               EventType = "c_post_added"
	EventTypePostAnswerAdded         EventType = "c_post_answer_added"
	EventTypePostEditAdded           EventType = "c_post_edit_added"
	EventTypePostAnswerEditAdded     EventType = "c_post_answer_edit_added"
	EventTypePostUpVoted             EventType = "c_post_up_voted"
	EventTypeRetractedPostUpVoted    EventType = "c_retracted_post_up_voted"
	EventTypePostDownVoted           EventType = "c_post_down_voted"
	EventTypeRetractedPostDownVoted  EventType = "c_retracted_post_down_voted"
	EventTypeAnswerUpVoted           EventType = "c_answer_up_voted"
	EventTypeAnswerDownVoted         EventType = "c_answer_down_voted"
	EventTypeAnswerAccepted          EventType = "c_answer_up_accepted"
	EventTypeRetractedAnswerAccepted EventType = "c_retracted_answer_up_accepted"
)

type IEvent interface {
	EventType() EventType
	Data() EventData
	// Timestamp() time.Time
	// Metadata() map[string]interface{}
	// String() string
}

type Event struct {
	Payload EventData
	Type    EventType
}

func (event *Event) Data() EventData {
	return event.Payload
}

func (event *Event) EventType() EventType {
	return event.Type
}

// An Event implements the ICommand interafce
// thus can be marshaled by the ProtobufMarshaler
func (event *Event) GetPayload() proto.Message {
	return event.Payload
}

type PostAdded struct {
	*Event
}

type PostAnswerAdded struct {
	*Event
}

type PostRevisionAdded struct {
	*Event
}

type AnswerRevisionAdded struct {
	*Event
}

type PostUpVoted struct {
	*Event
}

type RetractedPostUpVoted struct {
	*Event
}

type PostDownVoted struct {
	*Event
}

type RetractedPostDownVoted struct {
	*Event
}

type AnswerUpVoted struct {
	*Event
}

type AnswerDownVoted struct {
	*Event
}

type AnswerAccepted struct {
	*Event
}

type RetractedAnswerAccepted struct {
	*Event
}
