package collider

type IError interface {
	Error() (uint32, error)
	ErrorMessage() string
}

type Error struct {
	code uint32
	err  error
}

func (err Error) Error() (uint32, error) {
	return err.code, err.err
}

func (err Error) ErrorMessage() string {
	return err.err.Error()
}

func newError(errCode uint32, err error) IError {
	return Error{code: errCode, err: err}
}

const (
	errCode uint32 = iota
	errCodeJSUnmarshal
	errCodeJSONMarshal
	errCodeWSRead
	errCodeWSWrite
	errCodeSignIn
	errCodeSignUp
	errCodeSignOut
	errCodeRedisChannelMessage
	errCodeRedisChannelUsers
	errCodeRedisGetSessionUUID
	errCodeRedisGetUserByUUID
	errCodeRedisChannelJoin
	errJoinBroadcastChannel
	errUnknownCommandType
	errDuplicateRegisterCommandType
	errMissingFieldsCommandType
	errReadDeadline
	errwebRTCReadMessage
	errwebsocketJSONReceive
	errClientNotRegistered
	errEmptyMessage
	errLeaveBroadcastChannel
	errFailedPublishMessageToBoardRoom
	errBoardRoomSizeRecovery
	errOnlineBoardRoomPeers
	errBoardCapacity
	errBoardRoomMessages
	errMissingSessionId
	errboardRoomConversations
	errBoardRoomAppendMessageFailed
)

// var (
// 	errWSRead        = errors.New("could not read websocket connection")
// 	errSignIn        = errors.New("could not signIn")
// 	errUserSetOnline = errors.New("could not set user status as OnLine")
// )
