package conversations

import (
	"encoding/json"
	"log"
	"strings"

	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
)

func Receiver(conn *websocket.Conn, channel *redis.ChannelPubSub, write message.Write) {
	defer channel.Closed()

	for {
		select {
		case publishedMsg := <-channel.Channel():
			msg := &redis.Message{}
			dec := json.NewDecoder(strings.NewReader(publishedMsg.Payload))
			log.Printf("message[[ %s ]] published on pubsub channel %+v", publishedMsg.Payload, channel)
			err := dec.Decode(msg)
			if err != nil {
				log.Println(err)
			} else {
				err := write(conn, websocket.TextMessage, &message.Message{
					Type:           message.MessageTypeChannelMessage,
					ChannelMessage: msg,
				})
				if err != nil {
					log.Println(err)
				}
			}
		case <-channel.Close():
			return
		}
	}
}
