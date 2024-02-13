package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/helpers"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/instrumentation"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

var Env string

const (
	ONBOARDING_SUPPORT_EMAIL = "onboarding-support@guidhub.fr"
	COMPANY_ADMIN_NAME       = "guidhub"
	COMPANY_ADMIN_TEST_EMAIL = "mubarak@guidhub.fr"
)

type projectStakeholderDao interface {
	GetToken(token string) (*models.TokenStakeholder, error)
	CreateToken(token *models.TokenStakeholder) error
	GetByEmail(email string) (*models.ProjectStakeholder, error)
	GetById(id string) (*models.ProjectStakeholder, error)
	UpdateStakeholder(stakeholder *models.ProjectStakeholder, field string, value interface{}) error
	EditProjectStakeholder(pp *models.ProjectStakeholder) (*models.ProjectStakeholder, error)
	CreateProjectStakeholder(stakeholder *models.ProjectStakeholder) error
	DeleteStakeholder(p *models.ProjectStakeholder) error
}

type ProjectStakeholderService struct {
	dao projectStakeholderDao
}

func NewProjectStakeholderService(dao projectStakeholderDao) *ProjectStakeholderService {
	return &ProjectStakeholderService{dao: dao}
}

func (svc *ProjectStakeholderService) GetByEmail(email string) (*models.ProjectStakeholder, error) {
	return svc.dao.GetByEmail(email)
}

func (svc *ProjectStakeholderService) GetById(id string) (*models.ProjectStakeholder, error) {
	return svc.dao.GetById(id)
}

func (svc *ProjectStakeholderService) CreateProjectStakeholder(owner *models.User, stakeholder *models.ProjectStakeholder, project *models.Project) (messages.CreateStakeholder, error) {
	if err := svc.dao.CreateProjectStakeholder(stakeholder); err != nil {
		return messages.CreateStakeholder{}, err
	}

	if err := svc.InviteStakeholder(owner, stakeholder, project); err != nil {
		return messages.CreateStakeholder{}, err
	}
	return messages.CreateStakeholder{
		Stakeholder: stakeholder,
	}, nil
}

func (svc *ProjectStakeholderService) InviteStakeholder(owner *models.User, stakeholder *models.ProjectStakeholder, project *models.Project) error {
	var err error

	emailBlob := map[string]interface{}{
		"type":        "user",
		"from":        ONBOARDING_SUPPORT_EMAIL,
		"senderName":  COMPANY_ADMIN_NAME,
		"invitee":     stakeholder.FirstName,
		"projectName": project.Name,
		"subject":     messages.EmailSubjects["invitee_generic"],
		"user": map[string]string{
			"name":  stakeholder.FirstName,
			"email": stakeholder.Email,
		},
	}

	if emailBlob["embededLink"], err = svc.generateEmbebedLink(owner, stakeholder); err != nil {
		return err
	}

	if err := svc.SendEmail(emailBlob); err != nil {
		return err
	}

	return nil
}

func (svc *ProjectStakeholderService) generateEmbebedLink(owner *models.User, stakeholder *models.ProjectStakeholder) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"stakeholder": stakeholder.ID,
		"owner":       owner.ID,
		"created_at":  time.Now(),
	})
	tokenString, err := token.SignedString([]byte(OTPsecret))
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s%s", AppConfig.GetUserInviteEmbededLink(Env), tokenString), nil
}

func (svc *ProjectStakeholderService) SendEmail(emailBlob map[string]interface{}) error {
	if _, err := messages.SendInvitation(emailBlob); err != nil {
		return err
	}
	return nil
}

func (svc *ProjectStakeholderService) EditProjectStakeholder(p *models.ProjectStakeholder) (*models.ProjectStakeholder, error) {
	p, err := svc.dao.EditProjectStakeholder(p)
	if err != nil {
		return p, err
	}
	return p, nil
}

func (svc *ProjectStakeholderService) UpdateStakeholder(stakeholder *models.ProjectStakeholder, field string, value interface{}) (err error) {
	err = svc.dao.UpdateStakeholder(stakeholder, field, value)
	return
}

func (svc *ProjectStakeholderService) DeleteStakeholder(p *models.ProjectStakeholder) error {
	return svc.dao.DeleteStakeholder(p)
}

func (svc *ProjectStakeholderService) AuthStakeholder(stakeholder *models.ProjectStakeholder) (*models.ProjectStakeholder, bool, error) {
	u, err := svc.GetByEmail(stakeholder.Email)
	displayWelcomeFlash := false
	if err != nil {
		return nil, displayWelcomeFlash, err
	}
	if u.Pending() {
		return nil, displayWelcomeFlash, errors.New("user pending")
	}
	if !helpers.CheckPasswordHash(stakeholder.Password, u.Password) {
		return nil, displayWelcomeFlash, errUnknownUser
	}
	if u.LogInCount == 0 {
		displayWelcomeFlash = true
		daoProject := dao.NewProjectDAO()
		project, err := daoProject.GetProjectById(u.ProjectId)
		if err != nil {
			return nil, displayWelcomeFlash, err
		}
		daoOwnerProject := dao.NewUserDAO()
		owner, err := daoOwnerProject.GetById(project.UserId)
		if err != nil {
			return nil, displayWelcomeFlash, err
		}
		if err = redis.MessageBrokerClient.ContactCreateFromInvite(owner, u); err != nil {
			return nil, displayWelcomeFlash, err
		}
	}
	count := u.LogInCount + 1
	if err := svc.UpdateStakeholder(u, "log_in_count", count); err != nil {
		return u, displayWelcomeFlash, err
	}
	return u, displayWelcomeFlash, nil
}

func (svc *ProjectStakeholderService) RecoverStakeholder(email string) error {
	stakeholder, err := svc.GetByEmail(email)
	if err != nil {
		return err
	}
	if stakeholder.Email == "" {
		return errUnknownUser
	}
	// Create a new token object, specifying signing method and the claims
	// you would like it to contain.
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":    stakeholder.ID,
		"created_at": time.Now(),
	})
	secret := OTPsecret
	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return err
	}
	tok := models.TokenStakeholder{
		ID:      stakeholder.ID,
		Content: tokenString,
	}

	err = svc.CreateToken(&tok)
	if err != nil {
		return err
	}
	go func() {
		_, err := messages.SendStakeholderRenewEmail(&tok, stakeholder, EmailAdmin)
		if err != nil {
			instrumentation.LogAndPrintError(err)
		}
	}()
	return nil
}

func (svc *ProjectStakeholderService) CreateToken(token *models.TokenStakeholder) error {
	return svc.dao.CreateToken(token)
}

func (svc *ProjectStakeholderService) GetToken(token string) (*models.TokenStakeholder, error) {
	return svc.dao.GetToken(token)
}

func (svc *ProjectStakeholderService) CreateAuthPassword(stakeholder *models.ProjectStakeholder, password string) error {

	if err := svc.AppendPassword(stakeholder, password); err != nil {
		return err
	}

	if err := svc.UpdateStakeholder(stakeholder, "otp", helpers.GetTOTPToken(OTPsecret)); err != nil {
		return err
	}
	// send email to validate otp.
	go messages.SendOTPStakeholderEmail(stakeholder, ONBOARDING_SUPPORT_EMAIL)

	db := config.Datastore.ReadDatabase.Database(DB)
	filter := bson.M{"aggregate_id": stakeholder.ID}
	update := bson.M{
		"$set": bson.M{"aggregate_id": stakeholder.ID},
		"$addToSet": bson.M{"votes": bson.M{"vote_id": primitive.NewObjectID(),
			"voter_id": nil,
			"cast":     time.Now(),
			"weight":   DEFAULT_REPUTATION,
		}},
	}
	opts := options.Update().SetUpsert(true)
	_, err := db.Collection(dbCollectionCommunityReputations).UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return err
	}

	return nil
}

func (svc *ProjectStakeholderService) AppendPassword(stakeholder *models.ProjectStakeholder, password string) error {
	h, err := helpers.HashPassword(password)
	if err != nil {
		return err
	}
	if err := svc.UpdateStakeholder(stakeholder, "password", h); err != nil {
		return err
	}
	return nil
}

func (svc *ProjectStakeholderService) ModifyStakeholderPassword(stakeholder *models.ProjectStakeholder, password string) error {
	if err := svc.AppendPassword(stakeholder, password); err != nil {
		return err
	}
	go messages.SendStakeholderPasswordModificationEmail(stakeholder, EmailAdmin)
	return nil
}

func (svc *ProjectStakeholderService) SendFeedback(stakeholder *models.ProjectStakeholder, message string) error {
	_, err := messages.SendStakeholderFeedbackEmail(stakeholder, message, EmailAdmin)
	return err
}

func (svc *ProjectStakeholderService) ValidProjectStakeholderOtp(stakeholder *models.ProjectStakeholder, otp string) (messages.CreateProjectStakeholder, error) {
	if stakeholder.OTP != otp {
		return messages.CreateProjectStakeholder{}, errUnknownOtp
	}
	err := svc.UpdateStakeholder(stakeholder, "status", models.Live)
	if err != nil {
		return messages.CreateProjectStakeholder{}, errFailedValidationEmail
	}

	return messages.CreateProjectStakeholder{
		Path:    "valid_email",
		Message: EmailValidatedSuccess,
		User:    stakeholder}, nil
}
