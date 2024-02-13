package auth

import (
	"sync"

	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

const (
	errCodeOK uint32 = iota
	errCodeJSONUnmarshal

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
	errCodeContactSetOnline
)

var contactsConn map[string]*websocket.Conn
var contactsConnSync = &sync.RWMutex{}

func SignIn(sessionUUID string, conn *websocket.Conn, op int, write message.Write, msg *message.Message) message.IErrorMessage {
	contact, err := redis.MessageBrokerClient.ContactAuth(msg.Auth.SignIn.Email, msg.Auth.SignIn.Password)
	if err != nil {
		return message.NewErrorMessage(errCodeSignIn, err)
	}

	err = write(conn, op, &message.Message{
		Type: message.MessageTypeAuthorized,
		Auth: &message.Auth{
			Authorized: &message.Authorized{
				SenderUUID: contact.UUID,
				AccessKey:  contact.AccessKey,
			},
		},
	})

	if err != nil {
		return message.NewErrorMessage(0, err)
	}

	err = redis.MessageBrokerClient.ContactSetOnline(contact.UUID)
	if err != nil {
		return message.NewErrorMessage(errCodeContactSetOnline, err)
	}
	contactsConnSync.Lock()
	contactsConn[msg.SenderUUID] = conn

	for _, conn := range contactsConn {
		err := write(conn, op, &message.Message{
			Type: message.MessageTypeSys,
			SysMessage: &message.SysMessage{
				Type: message.MessageTypeSignIn,
				SignIn: &message.SignIn{
					UUID:  contact.UUID,
					Email: contact.Email,
				},
			},
		})
		if err != nil {
			return message.NewErrorMessage(0, err)
		}
	}
	contactsConnSync.Unlock()

	return nil
}
