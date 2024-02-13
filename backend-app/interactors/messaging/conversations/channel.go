package conversations

import (
	"log"
	"sync"

	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
)

type Channel struct {
	conn        *websocket.Conn
	contactUUID string
}

var sessionsJoins = map[string]map[string]Channel{}
var sessionsSync = &sync.RWMutex{}

var sessionChannel = map[string]string{}
var sessionChannelSync = &sync.RWMutex{}

func SessionsSendMessage(skipContactUUID, channelUUID string, write message.Write, msg *message.Message) {
	sessionsSync.RLock()
	defer sessionsSync.RUnlock()
	for _, data := range sessionsJoins[channelUUID] {
		if skipContactUUID != "" && skipContactUUID == data.contactUUID {
			continue
		}
		if err := write(data.conn, websocket.TextMessage, msg); err != nil {
			log.Println(err)
		}
	}
}

func SessionsRemove(sessionUUID string) {
	sessionChannelSync.RLock()
	channelUUID := sessionChannel[sessionUUID]
	sessionChannelSync.RUnlock()
	if channelUUID == "" {
		return
	}
	sessionsSync.Lock()
	if _, ok := sessionsJoins[channelUUID]; ok {
		delete(sessionsJoins[channelUUID], sessionUUID)
	}
	sessionsSync.Unlock()
}

func SessionAdd(conn *websocket.Conn, channelUUID, sessionUUID, contactUUID string) {
	sessionsSync.Lock()
	if _, ok := sessionsJoins[channelUUID]; !ok {
		sessionsJoins[channelUUID] = make(map[string]Channel, 0)
	}
	sessionsJoins[channelUUID][sessionUUID] = Channel{conn: conn, contactUUID: contactUUID}
	sessionsSync.Unlock()

	sessionChannelSync.Lock()
	sessionChannel[sessionUUID] = channelUUID
	sessionChannelSync.Unlock()

}
