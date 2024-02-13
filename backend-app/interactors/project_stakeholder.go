package interactors

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"time"

	"cloud.google.com/go/storage"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/golang-jwt/jwt"
	"github.com/jinzhu/gorm"
	"github.com/twinj/uuid"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/helpers"
	broker "gitlab.com/le-coin-des-entrepreneurs/backend-app/message_broker/redis"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

type projectStakeholderDeletePayload struct {
	Id string `form:"id" json:"id" binding:"required"`
}

type projectStakeholderEditPayload struct {
	Id          string `form:"id" json:"id" binding:"required"`
	FirstName   string `form:"first_name" json:"first_name"`
	LastName    string `form:"last_name" json:"last_name"`
	Role        string `form:"role" json:"role" binding:"required"`
	RoleDetails string `form:"role_details" json:"role_details" binding:"required"`
	Email       string `form:"email" json:"email"`
}

type projectStakeholderCreationPayload struct {
	Role         string                `form:"role"  json:"role" binding:"required"`
	RoleDetails  string                `form:"role_details"   json:"role_details" binding:"required"`
	FirstName    string                `form:"first_name"  json:"first_name"  binding:"required"`
	LastName     string                `form:"last_name"   json:"last_name" binding:"required"`
	Email        string                `form:"email"   json:"email" binding:"required"`
	ProfileImage *multipart.FileHeader `form:"profile_image"  json:"profile_image" `
	ImageExt     string                `form:"content_type_ext"  json:"content_type_ext" `
}

type StakeholderAuthPayload struct {
	TokenString string `json:"token" binding:"required"`
	Password    string `json:"password" binding:"required"`
}

func AuthStakeholder(c *gin.Context) {
	stakeholder, err := middlewares.GetAuthStakeholder(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := broker.MessageBrokerClient.UserSetOnline(stakeholder.ID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.Stakeholder(stakeholder))
}

func GetStakeholderProject(c *gin.Context) {
	stakeholder, err := middlewares.GetAuthStakeholder(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.OnGetStakeholderProject(stakeholder))
}

func Stakeholderlogin(c *gin.Context) {
	var loginVals login
	metaType := "stakeholder"
	if err := c.ShouldBind(&loginVals); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errror": "missing fields"})
		return
	}
	stakeholder := models.ProjectStakeholder{
		Email:    loginVals.Email,
		Password: loginVals.Password,
	}

	u, flashMessage, err := LoginStakeholder(c, &stakeholder)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	refreshToken, err := middlewares.SetClientAuth(c, u.ID, metaType)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"flash_message": flashMessage, "refresh_token": refreshToken})
}

func LoginStakeholder(c *gin.Context, stakeholder *models.ProjectStakeholder) (*models.ProjectStakeholder, bool, error) {
	dao := dao.NewProjectStakeholderDAO()
	svc := services.NewProjectStakeholderService(dao)
	u, flashMessage, err := svc.AuthStakeholder(stakeholder)
	if err != nil {
		return nil, flashMessage, err
	}
	return u, flashMessage, nil
}

func CreateProjectStakeholder(c *gin.Context) {
	projectId := c.Param("id")

	var p projectStakeholderCreationPayload
	if err := c.ShouldBindWith(&p, binding.FormMultipart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pI := &models.ProjectStakeholder{
		ProjectId:   projectId,
		FirstName:   p.FirstName,
		LastName:    p.LastName,
		Role:        p.Role,
		RoleDetails: p.RoleDetails,
		Email:       p.Email,
		Status:      models.PendingPassword,
	}

	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projectStakeholderDao := dao.NewProjectStakeholderDAO()
	svc := services.NewProjectStakeholderService(projectStakeholderDao)
	projectDAO := dao.NewProjectDAO()
	project, err := projectDAO.GetProjectById(projectId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}
	i, err := svc.CreateProjectStakeholder(user, pI, project)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if p.ProfileImage != nil {
		file, err := p.ProfileImage.Open()
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		if err = StakeholderUploadProfileImage(i.Stakeholder.ID, p.ImageExt, file); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(200, response.OnCreateStakeholder(&i))
}

func FetchProjectStakeholders(c *gin.Context) {
	projectId := c.Param("id")

	c.JSON(200, response.FetchProjectStakeholders(projectId))
}

func EditProjectStakeholder(c *gin.Context) {
	var p projectStakeholderEditPayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectStakeholderDAO()
	svc := services.NewProjectStakeholderService(dao)
	pI := models.ProjectStakeholder{
		ID:          p.Id,
		FirstName:   p.FirstName,
		LastName:    p.LastName,
		Role:        p.Role,
		RoleDetails: p.RoleDetails,
	}
	i, err := svc.EditProjectStakeholder(&pI)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.OnEditStakeholder(i))
}

func DeleteProjectStakeholder(c *gin.Context) {
	projectId := c.Param("id")

	var i projectStakeholderDeletePayload
	if err := c.ShouldBindJSON(&i); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectStakeholderDAO()
	svc := services.NewProjectStakeholderService(dao)
	p := models.ProjectStakeholder{
		ID: i.Id,
	}
	if err := svc.DeleteStakeholder(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.FetchProjectStakeholders(projectId))
}

func StakeholderPasswordRecover(c *gin.Context) {
	var payload PasswordRecoverPayload
	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dao := dao.NewProjectStakeholderDAO()
	svc := services.NewProjectStakeholderService(dao)
	if err := svc.RecoverStakeholder(payload.Email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errror": "User unknown"})
		return
	}
	middlewares.ClearAuthMeta(c, "stakeholder")
	c.JSON(200, gin.H{
		"message": "email sent",
	})
}

func RefreshStakeholderToken(c *gin.Context) {
	mapToken := map[string]string{}
	metaType := "stakeholder"
	if err := c.ShouldBindJSON(&mapToken); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	refreshToken := mapToken["refresh_token"]
	ts, saveErr := middlewares.RefreshToken(refreshToken, metaType)
	if saveErr != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": saveErr.Error()})
		return
	}
	middlewares.SetCookie(c, &ts, Env, metaType)
	tokens := map[string]string{
		"refresh_token": ts.RefreshToken,
	}
	c.JSON(http.StatusCreated, tokens)
}

func StakeholderPassword(c *gin.Context) {
	var payload PasswordPayload
	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	stakeholder, err := middlewares.GetAuthStakeholderRegistration(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectStakeholderDAO()
	svc := services.NewProjectStakeholderService(dao)
	err = svc.ModifyStakeholderPassword(stakeholder, payload.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if stakeholder.LogInCount == 0 {
		go messages.SendWelcomeEmailStakeholder(stakeholder, services.EmailAdmin)
	}
	middlewares.ClearAuthMeta(c, "stakeholder")
	c.JSON(200, gin.H{
		"message": "created password",
	})
}

func StakeholderPasswordModify(c *gin.Context) {
	var payload PasswordPayload
	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	stakeholder, err := middlewares.GetAuthStakeholder(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectStakeholderDAO()
	svc := services.NewProjectStakeholderService(dao)
	err = svc.ModifyStakeholderPassword(stakeholder, payload.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	middlewares.ClearAuthMeta(c, "stakeholder")
	c.JSON(200, gin.H{
		"message": "password modified",
	})
}

func StakeholderFeedback(c *gin.Context) {
	var payload FeedbackPayload
	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	stakeholder, err := middlewares.GetAuthStakeholder(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectStakeholderDAO()
	svc := services.NewProjectStakeholderService(dao)
	err = svc.SendFeedback(stakeholder, payload.Message)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{
		"message": "feedback sent",
	})
}

func StakeholderLogout(c *gin.Context) {
	metaType := "stakeholder"
	au, err := middlewares.ExtractTokenMetadata(c.Request, metaType)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	delErr := middlewares.DeleteAuth(au.AccessUuid)
	if delErr != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	middlewares.DeleteCookie(c, Env, metaType)
	broker.MessageBrokerClient.ContactSetOffline(au.UserId)
	c.JSON(http.StatusOK, "Successfully logged out")
}

func StakeholderUploadProfileImage(id, cType string, file multipart.File) error {
	object := fmt.Sprintf("%s-%s", services.ObjectName, uuid.NewV4().String())
	entity := storage.AllUsers
	role := storage.RoleReader

	defer file.Close()
	//create bucket
	bucket := uuid.NewV4().String()
	if err := helpers.CreateStorageBucket(bucket, ProjectId); err != nil {
		return err
	}
	ctx := context.Background()
	client, err := storage.NewClient(ctx)

	if err != nil {
		return err
	}
	defer client.Close()

	ctx, cancel := context.WithTimeout(ctx, time.Second*100)
	defer cancel()
	// Upload an object with storage.Writer.
	wc := client.Bucket(bucket).Object(object).NewWriter(ctx)
	if _, err = io.Copy(wc, file); err != nil {
		return err
	}
	if err := wc.Close(); err != nil {
		return err
	}
	acl := client.Bucket(bucket).Object(object).ACL()
	if err := acl.Set(ctx, entity, role); err != nil {
		return err
	}
	if err := createStakeholderProfileImage(bucket, id, cType, object); err != nil {
		return err
	}
	log.Printf("%s", fmt.Sprintf("%s/%s/%s", services.ObjectStorage, bucket, object))
	return nil
}

func createStakeholderProfileImage(bucket, id, cType, filename string) (err error) {
	dao := dao.NewStakeholderProfileImageDAO()
	svc := services.NewStakeholderProfileImageService(dao)
	if _, err := svc.GetByField(id, "user_id"); err != nil {
		if gorm.IsRecordNotFoundError(err) {
			p := models.StakeholderProfileImage{
				ID:          id,
				ContentType: cType,
				Bucket:      bucket,
			}
			if err = svc.CreateProfileImage(&p, filename); err != nil {
				return err
			}
			return nil
		}
		return err
	}
	p := models.StakeholderProfileImage{
		ID:          id,
		ContentType: cType,
		Bucket:      bucket,
	}
	err = svc.ModifyStakeholderProfileImage(&p, filename)

	return
}

func StakeholderAuthInviteToken(c *gin.Context) {
	var authPayload StakeholderAuthPayload

	if err := c.ShouldBind(&authPayload); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	token, err := StakeholderAuthTokenValid(authPayload.TokenString)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		stakeholderId, ok := claims["stakeholder"].(string)
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "missing fields in token",
			})
			return
		}

		dao := dao.NewProjectStakeholderDAO()
		svc := services.NewProjectStakeholderService(dao)
		stakeholder, err := svc.GetById(stakeholderId)
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
		if err := svc.CreateAuthPassword(stakeholder, authPayload.Password); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := middlewares.SetClientPasswordAuth(c, stakeholder.ID, "stakeholder"); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, response.Stakeholder(stakeholder))
	}
}

func StakeholderAuthTokenValid(tokenString string) (*jwt.Token, error) {
	token, err := VerifyStakeholderAuthToken(tokenString)
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, errors.New("token is invalid")
	}
	return token, nil
}

func VerifyStakeholderAuthToken(tokenString string) (*jwt.Token, error) {

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(services.OTPsecret), nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
}

// ValidateStakeholderOtp handles otp validation  request
func ValidateStakeholderOtp(c *gin.Context) {
	var payload OtpValidationPayload

	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	stakeholder, err := middlewares.GetAuthStakeholderRegistration(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectStakeholderDAO()
	svc := services.NewProjectStakeholderService(dao)
	m, err := svc.ValidProjectStakeholderOtp(stakeholder, payload.Otp)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "user not permitted.",
		})
		return
	}
	c.JSON(200, response.OnCreateProjectStackholder(&m))
}

func ResendStakeholderValidationCode(c *gin.Context) {
	stakeholder, err := middlewares.GetAuthStakeholderRegistration(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	if _, err := messages.SendOTPStakeholderEmail(stakeholder, services.ONBOARDING_SUPPORT_EMAIL); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, "sent")
}
