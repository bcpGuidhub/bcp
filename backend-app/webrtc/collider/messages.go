package collider

import "github.com/gorilla/websocket"

type (
	MessageType string
)

const (
	MessageTypePeerOfferSignaling        MessageType = "peerOffer"
	MessageTypePeerAnswerSignaling       MessageType = "peerAnswer"
	MessageTypePeerIceCandidateSignaling MessageType = "iceCandidate"
	MessageTypeConversationMessage       MessageType = "boardRoomConversationMessage"
	MessageTypeSys                       MessageType = "sys"
	MessageTypeReady                     MessageType = "ready"
	MessageTypeError                     MessageType = "error"
	MessageTypeBoardRoomJoin             MessageType = "joinBoardRoom"
	MessageTypeBoardRoomPeerJoined       MessageType = "peerJoinedBoardRoom"
	MessageTypeBoardRoomMessage          MessageType = "board_room_message"
	MessageTypeBoardRoomMessages         MessageType = "boardRoomMessages"
	MessageTypeBoardRoomLeave            MessageType = "leaveCall"
)

// WebSocket message from the client.
type wsClientMsg struct {
	Cmd          MessageType            `json:"cmd"`
	BoardRoomID  string                 `json:"board_room_id"`
	ClientID     string                 `json:"client_id"`
	Msg          string                 `json:"msg"`
	SessionUUID  string                 `json:"ssuid"`
	PeerId       string                 `json:"peer_id,omitempty"`
	Conversation map[string]interface{} `json:"conversation,omitempty"`
}

type DataError struct {
	Code    uint32      `json:"code"`
	Error   string      `json:"error"`
	Payload interface{} `json:"payload"`
}

type DataSys struct {
	Type           MessageType     `json:"type"`
	Message        string          `json:"message,omitempty"`
	BoardRoomLeave *BoardRoomLeave `json:"board_room_leave,omitempty"`
}

type DataReady struct {
	SessionUUID string `json:"sessionUUID"`
}

type DataJoinBoardRoom struct {
	SessionUUID    string          `json:"sessionUUID"`
	BoardRoomId    string          `json:"boardRoomId"`
	ClientId       string          `json:"clientId"`
	HasSeat        bool            `json:"hasSeat"`
	Status         bool            `json:"status"`
	BoardRoomSeats []BoardRoomSeat `json:"seats"`
}

type DataBoardRoomMessages struct {
	SessionUUID string             `json:"sessionUUID"`
	BoardRoomId string             `json:"boardRoomId"`
	ClientId    string             `json:"clientId"`
	Messages    []BoardRoomMessage `json:"messages"`
}

type Message struct {
	SessionUUID       string                 `json:"SUUID,omitempty"`
	Type              MessageType            `json:"type"`
	ClientID          string                 `json:"client_id,omitempty"`
	Sys               *DataSys               `json:"sys,omitempty"`
	Ready             *DataReady             `json:"ready,omitempty"`
	Error             *DataError             `json:"error,omitempty"`
	BoardRoomMessage  *BoardRoomMessage      `json:"board_room_message,omitempty"`
	BoardRoomLeave    *BoardRoomLeave        `json:"board_room_leave,omitempty"`
	JoinBoardRoom     *DataJoinBoardRoom     `json:"on_join_board_room,omitempty"`
	BoardRoomMessages *DataBoardRoomMessages `json:"on_board_room_messages,omitempty"`
}

type Write func(conn *websocket.Conn, op int, message interface{}) error
