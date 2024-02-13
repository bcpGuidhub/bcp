package collider

import (
	"errors"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

var (
	ErrMaxRoomCapacityExceeded = errors.New("max room capacity reached")
)

type IBoardRoom interface {
	guuid() string
	initBoardRoom() (string, error)
	setSession() (string, error)
	getBoardRoomSession() (string, error)
	hasSession() error
	boardRoomGetMessages() ([]BoardRoomMessage, IError)
	joinBoardRoom(clientId string) (*redis.ChannelPubSub, IError)
	leaveBoardRoom(message wsClientMsg) IError
	publishMessageToBoardRoom(message wsClientMsg) IError
	statusBoardRoom() IError
	onlineBoardRoomPeers() ([]BoardRoomSeat, IError)
	getBoardRoomStatus() Status
	boardRoomConversations(msg wsClientMsg, blobPayload []byte) IError
}
