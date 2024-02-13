package services

import (
	"context"
	"errors"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/helpers"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/instrumentation"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

const (
	dbname                   = "DB_INQUIST"
	DEFAULT_REPUTATION int64 = 1
)

var (
	DB                               = os.Getenv(dbname)
	dbCollectionCommunityReputations = "community.reputations"
)

var (
	UserPendingDeletion      = "user account is closed"
	UserCreationFailed       = "Failed to create user"
	UserCreationSucces       = "User validation code sent to email."
	EmailAdmin               = "support@guidhub.fr"
	errUnknownOtp            = errors.New("oTP code is unknown to the user")
	EmailValidatedSuccess    = "email was successfully validated"
	errFailedValidationEmail = errors.New("failed validation")
	errUnknownUser           = errors.New("unknown user credentials")
	errInvalidCode           = errors.New("code is invalid")
)
var OTPsecret string

type userDAO interface {
	GetByEmail(email string) (*models.User, error)
	CreateUser(user *models.User) error
	UpdateUser(user *models.User, field string, value interface{}) error
	Updates(user *models.User) error
	CreateToken(token *models.Token) error
	GetToken(token string) (*models.Token, error)
	GetById(id string) (*models.User, error)
	DeleteUser(user *models.User) error
}

type UserService struct {
	dao userDAO
}

// NewUserService creates a new UserService with the given user DAO.
func NewUserService(dao userDAO) *UserService {
	return &UserService{dao: dao}
}

// GetByEmail just retrieves user using User DAO, here can be additional logic for processing data retrieved by DAOs
func (s *UserService) GetByEmail(email string) (*models.User, error) {
	return s.dao.GetByEmail(email)
}

func (s *UserService) GetById(id string) (*models.User, error) {
	return s.dao.GetById(id)
}

// CreateUser creates a new user.
func (s *UserService) CreateUser(user *models.User) (messages.CreateUser, error) {
	// check if the user exists.
	u, err := s.GetByEmail(user.Email)
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return messages.CreateUser{}, err
	}
	if u.Email != "" && err == nil {
		if !u.ValidUser() {
			return messages.CreateUser{
				Path:    "user_delete",
				Message: UserPendingDeletion,
			}, nil
		}
		if u.Live() {
			return messages.CreateUser{
				Path:    "login",
				Message: "",
				User:    u,
			}, nil
		}
	}
	// 	//Read the secret token from file system
	// 	data, err := ioutil.ReadFile("dummy_secret.pem")
	// 	check(err)
	// 	secret := string(data)
	user.OTP = helpers.GetTOTPToken(OTPsecret)

	if u.Email != "" {
		err = s.UpdateUser(u, "otp", user.OTP)
		if err != nil {
			return messages.CreateUser{}, err
		}
		// send email to validate otp.
		go messages.SendOTPEmail(user, ONBOARDING_SUPPORT_EMAIL)

		// send sms to validate email.
		go messages.SendUserAccountValidationCode(user)
		return messages.CreateUser{
			Path:    "email_validated",
			Message: "User being validated.",
			User:    u,
		}, nil
	}
	user.Status = "pending_otp_validation"
	err = s.dao.CreateUser(user)
	if err != nil {
		return messages.CreateUser{}, err
	}

	// send email to validate otp.
	go messages.SendOTPEmail(user, ONBOARDING_SUPPORT_EMAIL)
	// send sms to validate email.
	go messages.SendUserAccountValidationCode(user)

	db := config.Datastore.ReadDatabase.Database(DB)
	filter := bson.M{"aggregate_id": user.ID}
	update := bson.M{
		"$set": bson.M{"aggregate_id": user.ID},
		"$addToSet": bson.M{"votes": bson.M{"vote_id": primitive.NewObjectID(),
			"voter_id": nil,
			"cast":     time.Now(),
			"weight":   DEFAULT_REPUTATION,
		}},
	}
	opts := options.Update().SetUpsert(true)
	_, err = db.Collection(dbCollectionCommunityReputations).UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return messages.CreateUser{}, err
	}

	return messages.CreateUser{
		Path:    "validate_email",
		Message: UserCreationSucces,
		User:    user,
	}, nil
}

// UpdateUser will update the given field on a user.
func (s *UserService) UpdateUser(user *models.User, field string, value interface{}) (err error) {
	err = s.dao.UpdateUser(user, field, value)
	return
}
func (s *UserService) Updates(user *models.User) (err error) {
	err = s.dao.Updates(user)
	return
}

func (s *UserService) ValidOtp(user *models.User, otp string) (messages.CreateUser, error) {
	if user.OTP != otp {
		return messages.CreateUser{}, errUnknownOtp
	}
	err := s.UpdateUser(user, "status", "live")
	if err != nil {
		return messages.CreateUser{}, errFailedValidationEmail
	}

	return messages.CreateUser{
		Path:    "valid_email",
		Message: EmailValidatedSuccess,
		User:    user}, nil
}

func (s *UserService) CreatePassword(user *models.User, password string) error {
	h, err := helpers.HashPassword(password)
	if err != nil {
		return err
	}
	if err := s.UpdateUser(user, "password", h); err != nil {
		return err
	}

	return nil
}
func (s *UserService) ModifyUserPassword(user *models.User, password string) error {
	if err := s.CreatePassword(user, password); err != nil {
		return err
	}
	go messages.SendPasswordModificationEmail(user, ONBOARDING_SUPPORT_EMAIL)
	return nil
}
func (s *UserService) ModifyUserEmail(user *models.User, email string) error {
	if err := s.UpdateUser(user, "email", email); err != nil {
		return err
	}
	go messages.SendEmailModificationEmail(user, ONBOARDING_SUPPORT_EMAIL)
	return nil
}
func (s *UserService) ModifyUserPhone(user *models.User, phone string) error {
	if err := s.UpdateUser(user, "telephone", phone); err != nil {
		return err
	}
	return nil
}
func (s *UserService) SendFeedback(user *models.User, message string) error {
	_, err := messages.SendUserFeedbackEmail(user, message, EmailAdmin)
	return err
}

func (s *UserService) AuthUser(user *models.User) (*models.User, bool, error) {
	u, err := s.GetByEmail(user.Email)
	displayWelcomeFlash := false
	if err != nil {
		return nil, displayWelcomeFlash, err
	}
	if u.Pending() {
		return nil, displayWelcomeFlash, errors.New("user pending")
	}
	if !helpers.CheckPasswordHash(user.Password, u.Password) {
		return nil, displayWelcomeFlash, errUnknownUser
	}
	if u.LogInCount == 0 {
		displayWelcomeFlash = true
	}
	count := u.LogInCount + 1
	if err := s.UpdateUser(u, "log_in_count", count); err != nil {
		return u, displayWelcomeFlash, err
	}
	return u, displayWelcomeFlash, nil
}

func (s *UserService) CreateToken(token *models.Token) error {
	return s.dao.CreateToken(token)
}

func (s *UserService) RecoverUser(email string) error {
	user, err := s.GetByEmail(email)
	if err != nil {
		return err
	}
	if user.Email == "" {
		return errUnknownUser
	}
	// Create a new token object, specifying signing method and the claims
	// you would like it to contain.
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":    user.ID,
		"created_at": time.Now(),
	})
	secret := OTPsecret
	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return err
	}
	tok := models.Token{
		ID:      user.ID,
		Content: tokenString,
	}

	err = s.CreateToken(&tok)
	if err != nil {
		return err
	}
	go func() {
		_, err := messages.SendRenewEmail(&tok, user, EmailAdmin)
		if err != nil {
			instrumentation.LogAndPrintError(err)
		}
	}()
	return nil
}

func (s *UserService) GetToken(token string) (*models.Token, error) {
	return s.dao.GetToken(token)
}
func (s *UserService) ValidUserProjectValidationPhoneOtp(user *models.User, code string) error {
	if user.PhoneValidationOtp != code {
		return errInvalidCode
	}
	return s.UpdateUser(user, "reachable_by_phone_for_rdv_validation", true)
}
func (s *UserService) ValidUserPhoneOtp(user *models.User, code string) error {
	if user.PhoneValidationOtp != code {
		return errInvalidCode
	}
	return s.UpdateUser(user, "reachable_by_phone", true)
}

func (s *UserService) ResendUserValidationPhoneCode(user *models.User) error {
	go messages.SendUserAccountValidationCode(user)
	return nil
}
func (s *UserService) ResendUserPhoneCode(u *models.User) error {
	user, err := s.GetById(u.ID)
	if err != nil {
		return err
	}
	go messages.SendUserValidationCode(user)
	return nil
}

func (s *UserService) SendUserPhoneCode(u *models.User) error {
	code := helpers.GetTOTPToken(OTPsecret)
	err := s.UpdateUser(u, "phone_validation_otp", code)
	if err != nil {
		return err
	}
	err = s.UpdateUser(u, "rechable_by_phone", false)
	if err != nil {
		return err
	}
	go messages.SendUserValidationCode(u)
	return nil
}
func (s *UserService) DeleteUser(u *models.User) error {
	return s.dao.DeleteUser(u)
}
