package message

import (
	"github.com/gorilla/websocket"
)

type (
	MessageType string
)

const (
	MessageTypeSys                               MessageType = "sys"
	MessageTypeReady                             MessageType = "ready"
	MessageTypeError                             MessageType = "error"
	MessageTypeContacts                          MessageType = "contacts"
	MessageTypeSignIn                            MessageType = "signIn"
	MessageTypeSignUp                            MessageType = "signUp"
	MessageTypeSignOut                           MessageType = "signOut"
	MessageTypeAuthorized                        MessageType = "authorized"
	MessageTypeUnAuthorized                      MessageType = "unauthorized"
	MessageTypeChannelMessage                    MessageType = "channelMessage"
	MessageTypeConversationMessages              MessageType = "conversationMessages"
	MessageTypeConversation                      MessageType = "conversationID"
	MessageTypeChannelLeave                      MessageType = "channelLeave"
	MessageTypeGetConversations                  MessageType = "getConversations"
	MessageTypeGetContacts                       MessageType = "getContacts"
	MessageTypeSetContactOnline                  MessageType = "contactSetOnline"
	MessageTypeSetContactOffline                 MessageType = "contactSetOffline"
	MessageTypeMarkConversationAsSeen            MessageType = "conversationMarkAsSeen"
	MessageTypeGetConversationByUUID             MessageType = "conversationByUUID"
	MessageTypeGetConversationByOtherParticipant MessageType = "conversationByOtherParticipant"
	MessageTypeConversationJoin                  MessageType = "conversationJoin"
	MessageTypeConversationLeave                 MessageType = "conversationLeave"
	MessageTypeConversationMessage               MessageType = "conversationMessage"
	MessageTypeAddPost                           MessageType = "c_add_post"
	MessageTypeAddRevisionToPost                 MessageType = "c_add_revision_post"
	MessageTypeAddRevisionToAnswer               MessageType = "c_add_revision_answer"
	MessageTypeCommentOnPost                     MessageType = "c_comment_on_post"
	MessageTypeCommentOnAnswer                   MessageType = "c_comment_on_answer"
	MessageTypeFlagComment                       MessageType = "c_flag_comment"
	MessageTypeRetractFlagComment                MessageType = "c_retract_flag_comment"
	MessageTypeFlagAnswer                        MessageType = "c_flag_answer"
	MessageTypeRetractFlagAnswer                 MessageType = "c_retract_flag_answer"
	MessageTypeFlagPost                          MessageType = "c_flag_post"
	MessageTypeRetractFlagPost                   MessageType = "c_retract_flag_post"
	MessageTypeVoteUpPost                        MessageType = "c_vote_up_post"
	MessageTypeRetractVoteUpPost                 MessageType = "c_retract_vote_up_post"
	MessageTypeVoteUpAnswer                      MessageType = "c_vote_up_answer"
	MessageTypeRetractVoteUpAnswer               MessageType = "c_retract_vote_up_answer"
	MessageTypeVoteUpComment                     MessageType = "c_vote_up_comment"
	MessageTypeRetractVoteUpComment              MessageType = "c_retract_vote_up_comment"
	MessageTypeVoteDownPost                      MessageType = "c_vote_down_post"
	MessageTypeRetractVoteDownPost               MessageType = "c_retract_vote_down_post"
	MessageTypeVoteDownAnswer                    MessageType = "c_vote_down_answer"
	MessageTypeRetractVoteDownAnswer             MessageType = "c_retract_vote_down_answer"
	MessageTypeAcceptAnswer                      MessageType = "c_accept_answer"
	MessageTypeRetractAcceptAnswer               MessageType = "c_retract_accept_answer"
)

type IModel interface {
	GUUID() string
}

type Ready struct {
	SessionUUID string `json:"session_uuid"`
}

type SignIn struct {
	UUID     string `json:"uuid"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignUp struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignOut struct {
	UUID string `json:"uuid"`
}

type Authorized struct {
	SenderUUID string `json:"sender_uuid"`
	AccessKey  string `json:"access_key"`
}

type Auth struct {
	SignIn     *SignIn     `json:"sign_in,omitempty"`
	SignUp     *SignUp     `json:"sign_up,omitempty"`
	SignOut    *SignOut    `json:"sign_out,omitempty"`
	Authorized *Authorized `json:"authorized,omitempty"`
}

type ChannelJoin struct {
	ConversationUUID string `json:"conversation_uuid,omitempty"`
}

type ChannelLeave struct {
	ConversationUUID string `json:"conversation_uuid"`
}

type Channel struct {
	Leave *ChannelLeave `json:"channel_leave,omitempty"`
	Join  *ChannelJoin  `json:"channel_join,omitempty"`
}

type SysMessage struct {
	Type         MessageType   `json:"type"`
	Message      string        `json:"message,omitempty"`
	SignIn       *SignIn       `json:"sign_in,omitempty"`
	ChannelJoin  *ChannelJoin  `json:"channel_join,omitempty"`
	ChannelLeave *ChannelLeave `json:"channel_leave,omitempty"`
}

type Contacts struct {
	Sector []IModel `json:"sector"`
	Invite []IModel `json:"invite"`
}

type Message struct {
	SenderUUID            string      `json:"sender_uuid,omitempty"`
	ActiveConversationId  string      `json:"active_conversation_id,omitempty"`
	ConversationId        string      `json:"conversation_id,omitempty"`
	ParticipantUUID       string      `json:"participant_uuid,omitempty"`
	SUUID                 string      `json:"ssuid,omitempty"`
	Type                  MessageType `json:"type"`
	RecipientsSessionUUID []string    `json:"participants,omitempty"`
	Error                 *MsError    `json:"error,omitempty"`
	Auth                  *Auth       `json:"auth,omitempty"`
	SysMessage            *SysMessage `json:"sys_message,omitempty"`
	Ready                 *Ready      `json:"ready,omitempty"`
	Contacts              *Contacts   `json:"contacts,omitempty"`
	Conversations         []IModel    `json:"conversations,omitempty"`
	Channel               *Channel    `json:"channel,omitempty"`
	Contact               IModel      `json:"contact,omitempty"`
	ChannelMessage        IModel      `json:"channel_message,omitempty"`
	Conversation          IModel      `json:"conversation,omitempty"`
	Messages              []IModel    `json:"messages,omitempty"`
}

type Write func(conn *websocket.Conn, op int, message *Message) error
