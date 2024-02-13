package redis

import (
	"bytes"
	"context"
	"crypto/md5"
	"encoding/json"
	"errors"
	"fmt"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
)

type ConversationType string

const (
	OneToOne                                  ConversationType = "ONE_TO_ONE"
	Group                                     ConversationType = "GROUP"
	BusinessSector                            ConversationType = "ACTIVITY"
	keyConversationsBusinessSectorListIndex                    = "conversationBusinessSectorListIndex"
	keyConversations                                           = "conversations"
	KeyConversationsForParticipantListIndexes                  = "conversationsForParticipantListIndexes"
	keyConversationUnReadCount                                 = "conversationUnReadCount"
	keyConversationByUUIDListIndex                             = "conversationByUUIDListIndex"
)

var _ = message.IModel(&Conversation{})

type Conversation struct {
	UUID         string           `json:"id"`
	Participants []Contact        `json:"participants"`
	Type         ConversationType `json:"type"`
	UnreadCount  int64            `json:"unread_count"`
	Sector       string           `json:"sector"`
	CreatedAt    time.Time        `json:"create_at"`
}

type Message struct {
	UUID        string       `json:"id"`
	Body        string       `json:"body"`
	ContentType string       `json:"content_type"`
	Attachments []Attachment `json:"attachments"`
	CreatedAt   time.Time    `json:"created_at"`
	SenderId    string       `json:"sender_id"`
}

type Attachment struct {
	UUID     string `json:"id"`
	Title    string `json:"title"`
	Text     string `json:"text"`
	ImageURL string `json:"image_url"`
	ThumbURL string `json:"thumb_url"`
}

func (conversation *Conversation) GUUID() string {
	return conversation.UUID
}

func (message *Message) GUUID() string {
	return message.UUID
}
func (broker *MessageBroker) ConversationByBusinessSector(sector string) (*Conversation, error) {
	if err := broker.lockSync.Lock(); err != nil {
		return nil, fmt.Errorf("lock failed with error %v", err)
	}

	defer func() {
		if ok, err := broker.lockSync.Unlock(); !ok || err != nil {
			_ = fmt.Errorf("unlock failed with error %v", err)
		}

	}()

	conversation, err := broker.getConversationFromListByBusinessSector(sector)
	if err == redis.Nil {
		conversation = &Conversation{
			UUID:      uuid.New().String(),
			Type:      "ACTIVITY",
			CreatedAt: time.Now(),
			Sector:    sector,
		}

		if err = broker.AddConversation(conversation); err != nil {
			return nil, fmt.Errorf("ConversationGet[%s]: %w", sector, err)
		}
	}
	if err != nil {
		return nil, fmt.Errorf("ConversationGet[%s]: %w", sector, err)
	}

	return conversation, nil
}

func (broker *MessageBroker) getConversationFromListByBusinessSector(sector string) (*Conversation, error) {
	conversationIndex, err := broker.getConversationIndexBySector(sector)
	if err != nil {
		return nil, err
	}

	conversation, err := broker.getConversationFromList(conversationIndex)
	if err != nil {
		return nil, err
	}
	return conversation, nil
}

func (broker *MessageBroker) getConversationIndexBySector(sector string) (int64, error) {
	key := broker.getKeyConversationsBusinessSectorListIndex(sector)
	value, err := broker.client.Get(context.Background(), key).Result()
	if err != nil {
		return 0, err
	}
	index, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		return 0, err
	}
	return index, nil
}

func (broker *MessageBroker) getKeyConversationsBusinessSectorListIndex(sector string) string {
	return fmt.Sprintf("%s.%x", keyConversationsBusinessSectorListIndex, md5.Sum([]byte(sector)))
}

func (broker *MessageBroker) getConversationFromList(conversationIndex int64) (*Conversation, error) {
	key := broker.getKeyConversations()

	value, err := broker.client.LIndex(context.Background(), key, conversationIndex).Result()
	if err != nil {
		return nil, fmt.Errorf("getConversationsFromList[%d]: %w", conversationIndex, err)
	}

	conversation := &Conversation{}

	dec := json.NewDecoder(strings.NewReader(value))
	err = dec.Decode(conversation)
	if err != nil {
		return nil, fmt.Errorf("getConversationsFromList[%d]: %w", conversationIndex, err)
	}

	return conversation, nil
}

func (broker *MessageBroker) ConversationsByParticipantId(contactUUId string) ([]*Conversation, error) {
	conversations, err := broker.getConversationsFromListByParticipantId(contactUUId)
	if err != nil {
		return nil, fmt.Errorf("ConversationsGetByParticipantId[%s]: %w", contactUUId, err)
	}
	return conversations, nil
}

func (broker *MessageBroker) getConversationsFromListByParticipantId(contactUUId string) ([]*Conversation, error) {
	conversationIndexes, err := broker.getConversationIndexesForParticipant(contactUUId)
	if err != nil {
		return nil, err
	}
	conversations := make([]*Conversation, 0, len(conversationIndexes))

	for i := range conversationIndexes {
		conversation, err := broker.getConversationFromList(conversationIndexes[i])
		if err != nil {
			return nil, err
		}
		conversations = append(conversations, conversation)
	}
	return conversations, nil
}

func (broker *MessageBroker) getConversationIndexesForParticipant(contactUUId string) ([]int64, error) {

	key := broker.getKeyConversationsForParticipantListIndexes(contactUUId)

	conversations, err := broker.client.LLen(context.Background(), key).Result()
	if err != nil {
		return nil, err
	}

	values, err := broker.client.LRange(context.Background(), key, 0, conversations).Result()
	if err != nil {
		return nil, err
	}

	indexes := make([]int64, 0, conversations)

	for i := range values {
		index, err := strconv.ParseInt(values[i], 10, 64)
		if err != nil {
			return nil, err
		}
		indexes = append(indexes, index)
	}

	return indexes, nil
}

func (broker *MessageBroker) getKeyConversationsForParticipantListIndexes(contactUUId string) string {
	return fmt.Sprintf("%s.%x", KeyConversationsForParticipantListIndexes, contactUUId)
}

func (broker *MessageBroker) getKeyConversations() string {
	return keyConversations
}

func (broker *MessageBroker) ConversationMarkAsSeen(conversationId string) error {
	key := broker.getKeyConversationUnReadCount(conversationId)
	err := broker.client.Set(context.Background(), key, fmt.Sprintf("%d", 0), 0).Err()
	if err != nil {
		return err
	}
	return nil
}

func (broker *MessageBroker) getKeyConversationUnReadCount(conversationId string) string {
	return fmt.Sprintf("%s.%s", keyConversationUnReadCount, conversationId)
}

func (broker *MessageBroker) getConversationUnReadCount(conversationId string) (int64, error) {
	key := broker.getKeyConversationUnReadCount(conversationId)
	value, err := broker.client.Get(context.Background(), key).Result()
	if err != nil {
		return 0, err
	}

	count, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (broker *MessageBroker) ConversationGetByUUID(conversationId string) (*Conversation, error) {
	key := broker.getkeyConversationByUUID(conversationId)

	value, err := broker.client.Get(context.Background(), key).Result()
	if err != nil {
		return nil, err
	}

	index, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		return nil, err
	}

	conversation, err := broker.getConversationFromList(index)
	if err != nil {
		return nil, err
	}

	return conversation, nil
}

func (broker *MessageBroker) getkeyConversationByUUID(conversationId string) string {
	return fmt.Sprintf("%s.%s", keyConversationByUUIDListIndex, conversationId)
}

func (broker *MessageBroker) GetByOtherParticipant(userUUID, participantUserName string) (*Conversation, error) {
	userConversationsListIndexes, err := broker.getConversationIndexesForParticipant(userUUID)
	if err != nil {
		return nil, err
	}

	participant, err := broker.getContactByUserName(participantUserName)
	if err != nil {
		return nil, err
	}

	participantConversationsListIndexes, err := broker.getConversationIndexesForParticipant(participant.UUID)
	if err != nil {
		return nil, err
	}

	sort.Slice(userConversationsListIndexes, func(i, j int) bool { return userConversationsListIndexes[i] < userConversationsListIndexes[j] })
	sort.Slice(participantConversationsListIndexes, func(i, j int) bool {
		return participantConversationsListIndexes[i] < participantConversationsListIndexes[j]
	})

	for x := range userConversationsListIndexes {
		j := sort.Search(len(participantConversationsListIndexes), func(i int) bool {
			return participantConversationsListIndexes[i] >= userConversationsListIndexes[x]
		})
		if j < len(participantConversationsListIndexes) && participantConversationsListIndexes[j] == userConversationsListIndexes[x] {
			return broker.getConversationFromList(participantConversationsListIndexes[j])
		}
	}

	return nil, fmt.Errorf("GetByOtherParticipant[%s][%s]: %w", userUUID, participantUserName, errors.New("Conversation not found"))
}

func (broker *MessageBroker) AddConversation(conversation *Conversation) error {

	buff := bytes.NewBufferString("")
	enc := json.NewEncoder(buff)
	err := enc.Encode(conversation)
	if err != nil {
		return err
	}

	key := broker.getKeyConversations()

	elements, err := broker.client.RPush(context.Background(), key, buff.String()).Result()
	if err != nil {
		return err
	}

	index := elements - 1
	keyConversationUUIDIndex := broker.getkeyConversationByUUID(conversation.UUID)

	err = broker.client.Set(context.Background(), keyConversationUUIDIndex, fmt.Sprintf("%d", index), 0).Err()
	if err != nil {
		return err
	}

	if conversation.Type == "ACTIVITY" {
		keyConversationBySectorIndex := broker.getKeyConversationsBusinessSectorListIndex(conversation.Sector)

		if err = broker.client.Set(context.Background(), keyConversationBySectorIndex, fmt.Sprintf("%d", index), 0).Err(); err != nil {
			return err
		}
	}

	for i := range conversation.Participants {

		keyConversationsByParticipant := broker.getKeyConversationsForParticipantListIndexes(conversation.Participants[i].UUID)
		err = broker.client.RPush(context.Background(), keyConversationsByParticipant, fmt.Sprintf("%d", index)).Err()
		if err != nil {
			return err
		}
	}

	return nil
}
