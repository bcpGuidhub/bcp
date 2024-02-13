package redis

import (
	"bytes"
	"context"
	"crypto/md5"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/redis/go-redis/v9"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/message"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

const (
	keyContactsEmailListIndex              = "contactsEmailListIndex"
	keyContacts                            = "contacts"
	keyContactsUUIDListIndex               = "contactsUUIDListIndex"
	keyContactAccessKey                    = "contactAccessKey"
	keyContactsOnline                      = "contactsOnline"
	KeyContactsByBusinessSectorListIndexes = "contactsByBusinessSectorListIndexes"
	KeyContactsByInviteListIndexes         = "contactsByInviteListIndexes"
	keyContactByUserName                   = "contactByUserName"
)

var _ = message.IModel(&Contact{})

type Contact struct {
	UUID         string    `json:"c_uuid"`
	Email        string    `json:"email"`
	AccessKey    string    `json:"access_key,omitempty"`
	Online       bool      `json:"online"`
	SessionUUID  string    `json:"-"`
	Avatar       string    `json:"avatar"`
	LastActivity time.Time `json:"last_activity"`
	Phone        string    `json:"phone"`
	UserName     string    `json:"user_name"`
	Address      string    `json:"address"`
	Position     string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
}

func (contact *Contact) GUUID() string {
	return contact.UUID
}

func (broker *MessageBroker) ContactAuth(email, password string) (*Contact, error) {

	contact, err := broker.ContactGetByEmail(email)

	if errors.Is(err, redis.Nil) {
		//contact, err = broker.ContactCreate(email, password)
		//if err != nil {
		//	return nil, err
		//}
	} else if err != nil {
		return nil, err
	}

	contact.AccessKey, err = broker.ContactUpdateAccessKey(contact.UUID)
	if err != nil {
		return nil, err
	}

	err = broker.ContactSetOnline(contact.UUID)
	if err != nil {
		return nil, err
	}
	return contact, nil
}

func (broker *MessageBroker) ContactGetByEmail(email string) (*Contact, error) {
	contact, err := broker.getContactFromListByEmail(email)
	if err != nil {
		return nil, fmt.Errorf("ContactGet[%s]: %w", email, err)
	}
	return contact, nil
}

func (broker *MessageBroker) getContactFromListByEmail(email string) (*Contact, error) {
	contactIndex, err := broker.getContactIndexByEmail(email)
	if err != nil {
		return nil, err
	}

	contact, err := broker.getContactFromList(contactIndex)
	if err != nil {
		return nil, err
	}

	contact.Online = broker.ContactIsOnline(contact.UUID)

	return contact, nil
}

func (broker *MessageBroker) getContactIndexByEmail(email string) (int64, error) {
	key := broker.getKeyContactsEmailListIndex(email)
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

func (broker *MessageBroker) getKeyContactsEmailListIndex(email string) string {
	return fmt.Sprintf("%s.%x", keyContactsEmailListIndex, md5.Sum([]byte(email)))
}

func (broker *MessageBroker) getContactFromList(contactIndex int64) (*Contact, error) {
	key := broker.getKeyContacts()

	value, err := broker.client.LIndex(context.Background(), key, contactIndex).Result()
	if err != nil {
		return nil, fmt.Errorf("getContactsFromList[%d]: %w", contactIndex, err)
	}

	contact := &Contact{}

	dec := json.NewDecoder(strings.NewReader(value))
	err = dec.Decode(contact)
	if err != nil {
		return nil, fmt.Errorf("getContactFromList[%d]: %w", contactIndex, err)
	}
	contact.Online = broker.ContactIsOnline(contact.UUID)
	return contact, nil
}

func (broker *MessageBroker) getKeyContacts() string {
	return keyContacts
}

func (broker *MessageBroker) ContactIsOnline(contactUUID string) bool {
	return broker.client.SIsMember(context.Background(), keyContactsOnline, contactUUID).Val()
}

func (broker *MessageBroker) ContactCreate(email, password string) (*Contact, error) {

	if contact, err := broker.getContactFromListByEmail(email); err == nil {
		return contact, err
	}

	contact := &Contact{
		UUID:      uuid.New().String(),
		Email:     email,
		CreatedAt: time.Now(),
	}

	//	if err := broker.addContact(contact); err != nil {
	//		return nil, err
	//	}

	return contact, nil
}
func (broker *MessageBroker) ContactCreateFromInvite(projectOwner *models.User, projectStakeholder *models.ProjectStakeholder) error {
	contact := &Contact{
		UUID:      projectStakeholder.ID,
		Email:     projectStakeholder.Email,
		CreatedAt: time.Now(),
		UserName:  fmt.Sprintf("%s.%s", projectStakeholder.FirstName, projectStakeholder.LastName),
	}

	daoPic := dao.NewStakeholderProfileImageDAO()
	pic, err := daoPic.GetByField(projectStakeholder.ID, "user_id")
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return err
	}
	if err == nil && pic.PublicUrl != "" {
		contact.Avatar = pic.PublicUrl
	}
	contactDetails := map[string]interface{}{
		"by_sector":  false,
		"by_invite":  true,
		"contact_id": projectOwner.ID,
	}
	if err := broker.addContact(contact, contactDetails); err != nil {
		return err
	}

	log.Printf("user set online %+v", contact)

	err = broker.ContactSetOnline(contact.UUID)
	if err != nil {
		return err
	}
	conversation := Conversation{
		UUID:        uuid.New().String(),
		Type:        OneToOne,
		UnreadCount: 1,
		CreatedAt:   time.Now(),
	}
	participants, err := broker.addParticipants([]string{projectOwner.ID, projectStakeholder.ID})
	if err != nil {
		return err
	}
	conversation.Participants = participants

	if err = broker.AddConversation(&conversation); err != nil {
		return err
	}

	msg := Message{
		UUID:        uuid.New().String(),
		Body:        fmt.Sprintf("<p>Salut</p><p>😀</p><p>%s vient de nous rejoindre. Bienvenue! </p><p>📣</p>", contact.UserName),
		ContentType: "text",
		CreatedAt:   contact.CreatedAt,
		SenderId:    contact.GUUID(),
		Attachments: []Attachment{},
	}

	_, err = broker.ConversationAppendMessage(conversation.GUUID(), msg)
	if err != nil {
		return err
	}

	return nil
}

func (broker *MessageBroker) addParticipants(participants []string) ([]Contact, error) {
	contacts := make([]Contact, 0, len(participants))
	for i := range participants {
		contact, err := broker.ContactGet(participants[i])
		if err != nil {
			return nil, err
		}
		contacts = append(contacts, *contact)
	}
	return contacts, nil
}

func (broker *MessageBroker) ContactCreateFromGuidHub(userI interface{}, contactDetails map[string]interface{}) error {
	user := userI.(*models.User)
	contact := &Contact{
		UUID:      user.ID,
		Email:     user.Email,
		CreatedAt: time.Now(),
		UserName:  fmt.Sprintf("%s.%s", user.FirstName, user.LastName),
		Phone:     user.Telephone,
	}
	daoPic := dao.NewUserProfileImageDAO()
	pic, err := daoPic.GetByField(user.ID, "user_id")
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return err
	}
	if err == nil && pic.PublicUrl != "" {
		contact.Avatar = pic.PublicUrl
	}

	if val, ok := contactDetails["address"]; ok {
		contact.Address = val.(string)
	}
	log.Printf("creating user %+v", contact)

	if err := broker.addContact(contact, contactDetails); err != nil {
		return err
	}

	log.Printf("user set online %+v", contact)

	err = broker.ContactSetOnline(contact.UUID)
	if err != nil {
		return err
	}

	conversation, err := broker.ConversationByBusinessSector(contactDetails["sector"].(string))
	if err != nil {
		return err
	}

	//broadcast new contact to community.
	b := bytes.NewBufferString("")
	e := json.NewEncoder(b)
	err = e.Encode(contact)
	if err != nil {
		return err
	}
	msg := Message{
		UUID:        uuid.New().String(),
		Body:        b.String(),
		ContentType: "newCommunityContact",
		CreatedAt:   contact.CreatedAt,
		SenderId:    contact.GUUID(),
		Attachments: []Attachment{},
	}

	_, err = broker.ConversationAppendMessage(conversation.GUUID(), msg)
	if err != nil {
		return err
	}

	msg = Message{
		UUID:        uuid.New().String(),
		Body:        fmt.Sprintf("<p>Salut</p><p>😀</p><p>%s vient de nous rejoindre. Bienvenue! </p><p>📣</p>", contact.UserName),
		ContentType: "text",
		CreatedAt:   contact.CreatedAt,
		SenderId:    contact.GUUID(),
		Attachments: []Attachment{},
	}

	_, err = broker.ConversationAppendMessage(conversation.GUUID(), msg)
	if err != nil {
		return err
	}

	return nil
}

func (broker *MessageBroker) addContact(contact *Contact, contactDetails map[string]interface{}) error {
	if err := broker.lockSync.Lock(); err != nil {
		return fmt.Errorf("lock failed with error %v", err)
	}
	defer func() {
		if ok, err := broker.lockSync.Unlock(); !ok || err != nil {
			_ = fmt.Errorf("unlock failed with error %v", err)
		}

	}()

	b := bytes.NewBufferString("")
	e := json.NewEncoder(b)
	err := e.Encode(contact)
	if err != nil {
		return err
	}

	key := broker.getKeyContacts()

	elements, err := broker.client.RPush(context.Background(), key, b.String()).Result()
	if err != nil {
		return err
	}
	log.Printf("added user to contacts")

	index := elements - 1
	keyContactEmailIndex := broker.getKeyContactsEmailListIndex(contact.Email)
	keyContactUUIDIndex := broker.getKeyContactsUUIDListIndex(contact.UUID)

	err = broker.client.Set(context.Background(), keyContactEmailIndex, fmt.Sprintf("%d", index), 0).Err()
	if err != nil {
		return err
	}

	err = broker.client.Set(context.Background(), keyContactUUIDIndex, fmt.Sprintf("%d", index), 0).Err()
	if err != nil {
		broker.client.Del(context.Background(), keyContactEmailIndex)
		return err
	}

	// add to sector contacts
	if contactDetails["by_sector"].(bool) {
		keyContactSectorIndex := broker.getKeyContactsByBusinessSectorListIndexes(contactDetails["sector"].(string))
		err = broker.client.RPush(context.Background(), keyContactSectorIndex, fmt.Sprintf("%d", index)).Err()
		if err != nil {
			return err
		}
	}
	// add to contact invite
	if contactDetails["by_invite"].(bool) {
		keyContactInviteIndex := broker.getKeyContactsByInviteListIndexes(contactDetails["contact_id"].(string))
		err = broker.client.RPush(context.Background(), keyContactInviteIndex, fmt.Sprintf("%d", index)).Err()
		if err != nil {
			return err
		}
	}

	return nil
}

func (broker *MessageBroker) getKeyContactsUUIDListIndex(contactUUID string) string {
	return fmt.Sprintf("%s.%s", keyContactsUUIDListIndex, contactUUID)
}

func (broker *MessageBroker) ContactUpdateAccessKey(contactUUID string) (string, error) {
	key := broker.getKeyContactAccessKey(contactUUID)
	accessKey := uuid.New().String()

	err := broker.client.Set(context.Background(), key, accessKey, 0).Err()
	if err != nil {
		return "", err
	}
	return accessKey, nil
}

func (broker *MessageBroker) getKeyContactAccessKey(contactUUID string) string {
	return fmt.Sprintf("%s.%s", keyContactAccessKey, contactUUID)
}

func (broker *MessageBroker) ContactSetOnline(contactUUID string) error {
	return broker.client.SAdd(context.Background(), keyContactsOnline, contactUUID).Err()
}

func (broker *MessageBroker) ContactGet(contactUUID string) (*Contact, error) {
	contact, err := broker.getContactFromListByUUID(contactUUID)
	if err != nil {
		return nil, fmt.Errorf("ContactGet[%s]: %w", contactUUID, err)
	}
	return contact, nil
}

func (broker *MessageBroker) ContactUpdate(contact *Contact) error {
	contactIndex, err := broker.getContactIndexByUUID(contact.GUUID())
	if err != nil {
		return err
	}

	key := broker.getKeyContacts()
	b := bytes.NewBufferString("")
	e := json.NewEncoder(b)
	err = e.Encode(contact)
	if err != nil {
		return err
	}

	_, err = broker.client.LSet(context.Background(), key, contactIndex, b.String()).Result()
	if err != nil {
		return err
	}

	return nil
}
func (broker *MessageBroker) getContactFromListByUUID(contactUUID string) (*Contact, error) {

	contactIndex, err := broker.getContactIndexByUUID(contactUUID)
	if err != nil {
		return nil, fmt.Errorf("getContactFromListByUUID[%s] : %w", contactUUID, err)
	}

	contact, err := broker.getContactFromList(contactIndex)
	if err != nil {
		return nil, fmt.Errorf("getContactFromList[%s] : %w", contactUUID, err)
	}

	contact.Online = broker.ContactIsOnline(contactUUID)

	return contact, nil
}

func (broker *MessageBroker) getContactIndexByUUID(contactUUID string) (int64, error) {

	key := broker.getKeyContactsUUIDListIndex(contactUUID)
	value, err := broker.client.Get(context.Background(), key).Result()
	if err != nil {
		return 0, fmt.Errorf("getContactIndexByUUID: %w", err)
	}

	indx, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("getContactIndexByUUID: %w", err)
	}

	return indx, nil
}

func (broker *MessageBroker) ContactSignOut(contactUUID string) {
	accessKey := broker.getKeyContactAccessKey(contactUUID)
	broker.ContactDeleteAccessKey(accessKey)
	broker.ContactSetOffline(contactUUID)
}

func (broker *MessageBroker) ContactDeleteAccessKey(contactUUID string) {
	key := broker.getKeyContactAccessKey(contactUUID)
	broker.client.Del(context.Background(), key)
}

func (broker *MessageBroker) ContactSetOffline(contactUUID string) {
	broker.client.SRem(context.Background(), keyContactsOnline, contactUUID)
}

func (broker *MessageBroker) ContactAll() ([]*Contact, error) {

	key := broker.getKeyContacts()
	items, err := broker.client.LLen(context.Background(), key).Result()
	if err != nil {
		return nil, err
	}

	values, err := broker.client.LRange(context.Background(), key, 0, items).Result()
	if err != nil {
		return nil, err
	}
	contacts := make([]*Contact, items)

	for i := range values {
		contact := &Contact{}
		dec := json.NewDecoder(strings.NewReader(values[i]))
		err = dec.Decode(contact)
		if err != nil {
			return nil, fmt.Errorf("[%s]: %w", values[i], err)
		}
		contact.Online = broker.ContactIsOnline(contact.UUID)
		contacts[i] = contact
	}
	return contacts, nil
}

func (broker *MessageBroker) ContactsByInvite(contactUUID string) ([]*Contact, error) {
	contacts, err := broker.getContactsFromListByInvite(contactUUID)
	if err != nil {
		return nil, fmt.Errorf("ContactsGet[%s]: %w", contactUUID, err)
	}
	return contacts, nil
}

func (broker *MessageBroker) getContactsFromListByInvite(contactUUID string) ([]*Contact, error) {
	contactsIndexes, err := broker.getContactsByInviteIndexes(contactUUID)
	if err != nil {
		return nil, err
	}

	contacts := make([]*Contact, len(contactsIndexes))

	for i := range contactsIndexes {
		contact, err := broker.getContactFromList(contactsIndexes[i])
		if err != nil {
			return nil, err
		}
		contacts[i] = contact
	}
	return contacts, nil
}

func (broker *MessageBroker) getContactsByInviteIndexes(contactUUID string) ([]int64, error) {

	key := broker.getKeyContactsByInviteListIndexes(contactUUID)

	contacts, err := broker.client.LLen(context.Background(), key).Result()
	if err != nil {
		return nil, err
	}

	values, err := broker.client.LRange(context.Background(), key, 0, contacts).Result()
	if err != nil {
		return nil, err
	}

	indexes := make([]int64, contacts)

	for i := range values {
		index, err := strconv.ParseInt(values[i], 10, 64)
		if err != nil {
			return nil, err
		}
		indexes[i] = index
	}

	return indexes, nil
}

func (broker *MessageBroker) getKeyContactsByInviteListIndexes(contactUUID string) string {
	return fmt.Sprintf("%s.%s", KeyContactsByInviteListIndexes, contactUUID)
}

func (broker *MessageBroker) ContactsByBusinessSector(sector string) ([]*Contact, error) {
	contacts, err := broker.getContactsFromListByBusinessSector(sector)
	if err != nil {
		return nil, fmt.Errorf("ContactsGet[%s]: %w", sector, err)
	}
	return contacts, nil
}

func (broker *MessageBroker) getContactsFromListByBusinessSector(sector string) ([]*Contact, error) {
	contactsIndexes, err := broker.getContactsByBusinessSectorIndexes(sector)
	if err != nil {
		return nil, err
	}

	contacts := make([]*Contact, len(contactsIndexes))

	for i := range contactsIndexes {
		contact, err := broker.getContactFromList(contactsIndexes[i])
		if err != nil {
			return nil, err
		}
		contacts[i] = contact
	}
	return contacts, nil
}

func (broker *MessageBroker) getContactsByBusinessSectorIndexes(sector string) ([]int64, error) {

	key := broker.getKeyContactsByBusinessSectorListIndexes(sector)

	contacts, err := broker.client.LLen(context.Background(), key).Result()
	if err != nil {
		return nil, err
	}
	values, err := broker.client.LRange(context.Background(), key, 0, contacts).Result()
	if err != nil {
		return nil, err
	}

	indexes := make([]int64, 0, contacts)
	for i := range values {
		index, err := strconv.ParseInt(values[i], 10, 64)
		if err != nil {
			return nil, err
		}
		indexes = append(indexes, index)
	}

	return indexes, nil
}

func (broker *MessageBroker) getKeyContactsByBusinessSectorListIndexes(sector string) string {
	return fmt.Sprintf("%s.%x", KeyContactsByBusinessSectorListIndexes, md5.Sum([]byte(sector)))
}

func (broker *MessageBroker) getContactByUserName(userName string) (*Contact, error) {
	contact, err := broker.getContactFromListByUserName(userName)
	if err != nil {
		return nil, fmt.Errorf("ContactGet[%s]: %w", userName, err)
	}
	return contact, nil
}

func (broker *MessageBroker) getContactFromListByUserName(userName string) (*Contact, error) {
	contactIndex, err := broker.getContactIndexByUserName(userName)
	if err != nil {
		return nil, err
	}

	contact, err := broker.getContactFromList(contactIndex)
	if err != nil {
		return nil, err
	}

	contact.Online = broker.ContactIsOnline(contact.UUID)

	return contact, nil
}

func (broker *MessageBroker) getContactIndexByUserName(userName string) (int64, error) {
	key := broker.getKeyContactByUserName(userName)
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

func (broker *MessageBroker) getKeyContactByUserName(userName string) string {
	return fmt.Sprintf("%s.%x", keyContactByUserName, md5.Sum([]byte(userName)))
}
