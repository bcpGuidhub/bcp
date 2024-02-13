package interactors

import (
	"context"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"time"

	"cloud.google.com/go/storage"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
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

var (
	ProjectId string
	Env       string
	// whiteList = map[string][]string{
	// 	"email": {"baraka00007x@gmail.com", "charlotte.facon@live.fr", "pfacon22500@gmail.com", "oceanephilippe46@gmail.com"},
	// },
	// whiteList = map[string][]string{
	// 	"email": {"baraka00007x@gmail.com", "charlotte.facon@live.fr", "basuddem@yahoo.co.uk"},
	// }
	// whiteList = map[string][]string{}
)

type login struct {
	Email    string `form:"email" json:"email" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}

// UserCreationPayload is the payload
// required to create a User.
type UserCreationPayload struct {
	Email       string `form:"email" json:"email" binding:"required"`
	FirstName   string `form:"first_name" json:"first_name" binding:"required"`
	LastName    string `form:"last_name" json:"last_name" binding:"required"`
	Telephone   string `form:"telephone" json:"telephone" binding:"required"`
	RgdpConsent string `form:"rgdp_consent" json:"rgdp_consent" binding:"required"`
	CguConsent  bool   `form:"cgu_consent" json:"cgu_consent" binding:"required"`
	Password    string `form:"password" json:"password" binding:"required"`
}

// OtpValidationPayload is the payload
// required to validate email.
type OtpValidationPayload struct {
	Otp string `form:"otp"  json:"otp" binding:"required"`
}

type PasswordPayload struct {
	Password string `form:"password" json:"password" binding:"required"`
}

type PasswordRecoverPayload struct {
	Email string `form:"email"  json:"email" binding:"required"`
}

type userPhoneCodePayload struct {
	Code string `form:"activation_phone_verification_code" json:"activation_phone_verification_code" binding:"required"`
	Id   string `form:"user_id" json:"user_id" binding:"required"`
}

type userPhoneValidationPayload struct {
	Telephone string `form:"telephone" json:"telephone" binding:"required"`
	Id        string `form:"user_id" json:"user_id" binding:"required"`
}

// type EmailPayload struct {
// 	Email string `form:"email" binding:"required"`
// }

// type PhonePayload struct {
// 	Telephone string `form:"telephone" binding:"required"`
// }

type FeedbackPayload struct {
	Message string `form:"message"  json:"message" binding:"required"`
}

// type NamePayload struct {
// 	FirstName string `form:"first_name"`
// 	LastName  string `form:"last_name"`
// }

type UserProfile struct {
	FirstName    string                `form:"first_name"  json:"first_name"`
	LastName     string                `form:"last_name"  json:"last_name"`
	Telephone    string                `form:"telephone"  json:"telephone"`
	ProfileImage *multipart.FileHeader `form:"profile_image"  json:"profile_image"`
	ImageExt     string                `form:"content_type_ext"  json:"content_type_ext"`
}

func GetUserProjects(c *gin.Context) {
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.OnGetUserProjects(user))
}

func GetAuthUser(c *gin.Context) {
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := broker.MessageBrokerClient.UserSetOnline(user.ID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.User(user))
}

func UserPassword(c *gin.Context) {
	var payload PasswordPayload
	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := middlewares.GetAuthUserRegistration(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewUserDAO()
	svc := services.NewUserService(dao)
	err = svc.CreatePassword(user, payload.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if user.LogInCount == 0 {
		go messages.SendWelcomeEmail(user, services.EmailAdmin)
	}
	middlewares.ClearAuthMeta(c, "user")
	c.JSON(200, gin.H{
		"message": "created password",
	})
}

// UserCreate create resource.
func UserCreate(c *gin.Context) {
	var payload UserCreationPayload
	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// if Env != "dev" {
	// 	t := false
	// 	for _, v := range whiteList["email"] {
	// 		if payload.Email == v {
	// 			t = true
	// 		}
	// 	}

	// 	if !t {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": "USER NOT PERMITTED"})
	// 		return
	// 	}
	// }
	rgdp := false
	if payload.RgdpConsent == "Oui" {
		rgdp = true
	}
	daoUser := dao.NewUserDAO()
	svc := services.NewUserService(daoUser)
	h, err := helpers.HashPassword(payload.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user := models.User{
		Email:       payload.Email,
		FirstName:   payload.FirstName,
		LastName:    payload.LastName,
		Telephone:   payload.Telephone,
		RgdpConsent: rgdp,
		CguConsent:  payload.CguConsent,
		Password:    h,
	}
	m, err := svc.CreateUser(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := middlewares.SetClientPasswordAuth(c, m.User.ID, "user"); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.OnCreateUser(&m))
}

// GetUser handles requests for user query
// by email.
func GetUser(c *gin.Context) {
	s := services.NewUserService(dao.NewUserDAO())
	email := c.Param("email")
	if user, err := s.GetByEmail(email); err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	} else {
		c.JSON(http.StatusOK, response.OnGetUser(user))
	}
}

// ValidateOtp handles otp validation  request
func ValidateOtp(c *gin.Context) {
	var payload OtpValidationPayload

	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := middlewares.GetAuthUserRegistration(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewUserDAO()
	svc := services.NewUserService(dao)
	m, err := svc.ValidOtp(user, payload.Otp)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "user not permitted.",
		})
		return
	}
	c.JSON(200, response.OnCreateUser(&m))
}

func ResendValidationCode(c *gin.Context) {
	user, err := middlewares.GetAuthUserRegistration(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewUserDAO()
	svc := services.NewUserService(dao)
	err = svc.ResendUserValidationPhoneCode(user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "user not permitted.",
		})
		return
	}
	c.JSON(200, "sms sent")
}

func LoginUser(c *gin.Context, user *models.User) (*models.User, bool, error) {
	dao := dao.NewUserDAO()
	svc := services.NewUserService(dao)
	u, flashMessage, err := svc.AuthUser(user)
	if err != nil {
		return nil, flashMessage, err
	}
	return u, flashMessage, nil
}

func UserPasswordRecover(c *gin.Context) {
	var payload PasswordRecoverPayload
	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dao := dao.NewUserDAO()
	svc := services.NewUserService(dao)
	if err := svc.RecoverUser(payload.Email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errror": "User unknown"})
		return
	}
	middlewares.ClearAuthMeta(c, "user")
	c.JSON(200, gin.H{
		"message": "email sent",
	})
}

func Login(c *gin.Context) {
	var loginVals login
	metaType := "user"
	if err := c.ShouldBind(&loginVals); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errror": "missing fields"})
		return
	}
	user := models.User{
		Email:    loginVals.Email,
		Password: loginVals.Password,
	}

	u, flashMessage, err := LoginUser(c, &user)
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

func RefreshUserToken(c *gin.Context) {
	mapToken := map[string]string{}
	metaType := "user"
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

func Logout(c *gin.Context) {
	metaType := "user"
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

func UserProjectValidationVerifyPhoneCode(c *gin.Context) {
	var p userPhoneCodePayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	dao := dao.NewUserDAO()
	svc := services.NewUserService(dao)
	user, err := svc.GetById(p.Id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	if err := svc.ValidUserProjectValidationPhoneOtp(user, p.Code); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	c.JSON(200, gin.H{
		"message": "code valid",
	})
}

func UserVerifyPhoneCode(c *gin.Context) {
	var p userPhoneCodePayload
	if err := c.ShouldBind(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	dao := dao.NewUserDAO()
	svc := services.NewUserService(dao)
	user, err := svc.GetById(p.Id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	if err := svc.ValidUserPhoneOtp(user, p.Code); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	c.JSON(200, gin.H{
		"message": "code valid",
	})
}

func UserResendPhoneCode(c *gin.Context) {
	var e userPhoneValidationPayload

	if err := c.ShouldBind(&e); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	user := models.User{
		ID:        e.Id,
		Telephone: e.Telephone,
	}
	dao := dao.NewUserDAO()
	svc := services.NewUserService(dao)

	if err := svc.ResendUserPhoneCode(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	c.JSON(200, gin.H{
		"message": "code sent",
	})
}

func UserSendPhoneCode(c *gin.Context) {
	var e userPhoneValidationPayload

	if err := c.ShouldBind(&e); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	user := models.User{
		ID:        e.Id,
		Telephone: e.Telephone,
	}
	dao := dao.NewUserDAO()
	svc := services.NewUserService(dao)
	if err := svc.SendUserPhoneCode(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	c.JSON(200, gin.H{
		"message": "code sent",
	})
}

func UserUploadProfileImage(id, cType string, file multipart.File) error {
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
	if err := createUserProfileImage(bucket, id, cType, object); err != nil {
		return err
	}
	log.Printf("%s", fmt.Sprintf("%s/%s/%s", services.ObjectStorage, bucket, object))
	return nil
}

func createUserProfileImage(bucket, id, cType, filename string) (err error) {
	dao := dao.NewUserProfileImageDAO()
	svc := services.NewUserProfileImageService(dao)
	if _, err := svc.GetByField(id, "user_id"); err != nil {
		if gorm.IsRecordNotFoundError(err) {
			p := models.UserProfileImage{
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
	p := models.UserProfileImage{
		ID:          id,
		ContentType: cType,
		Bucket:      bucket,
	}
	err = svc.ModifyUserProfileImage(&p, filename)

	return
}

func UserPasswordModify(c *gin.Context) {
	var payload PasswordPayload
	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewUserDAO()
	svc := services.NewUserService(dao)
	err = svc.ModifyUserPassword(user, payload.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	middlewares.ClearAuthMeta(c, "user")
	c.JSON(200, gin.H{
		"message": "password modified",
	})
}

// func UserEmailModify(c *gin.Context) {
// 	var payload EmailPayload
// 	if err := c.ShouldBind(&payload); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	user, err := middlewares.GetAuthUser(c)
// 	if err != nil {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
// 		return
// 	}
// 	dao := dao.NewUserDAO()
// 	svc := services.NewUserService(dao)
// 	err = svc.ModifyUserEmail(user, payload.Email)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	middlewares.ClearAuthMeta(c, "user")
// 	c.JSON(200, gin.H{
// 		"message": "email modified",
// 	})
// }

// func UserPhoneModify(c *gin.Context) {
// 	var payload PhonePayload
// 	if err := c.ShouldBind(&payload); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	user, err := middlewares.GetAuthUser(c)
// 	if err != nil {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
// 		return
// 	}
// 	dao := dao.NewUserDAO()
// 	svc := services.NewUserService(dao)
// 	err = svc.ModifyUserPhone(user, payload.Telephone)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(200, gin.H{
// 		"message": "phone modified",
// 	})
// }

// func UserNameModify(c *gin.Context) {
// 	var payload NamePayload
// 	if err := c.ShouldBind(&payload); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	user, err := middlewares.GetAuthUser(c)
// 	if err != nil {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
// 		return
// 	}
// 	dao := dao.NewUserDAO()
// 	svc := services.NewUserService(dao)
// 	modifyUser := models.User{
// 		ID:        user.ID,
// 		FirstName: payload.FirstName,
// 		LastName:  payload.LastName,
// 	}
// 	err = svc.Updates(&modifyUser)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(200, gin.H{
// 		"message": "name modified",
// 	})
// }

func UserFeedback(c *gin.Context) {
	var payload FeedbackPayload
	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewUserDAO()
	svc := services.NewUserService(dao)
	err = svc.SendFeedback(user, payload.Message)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{
		"message": "feedback sent",
	})
}

func DeleteUser(c *gin.Context) {
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewUserDAO()
	svc := services.NewUserService(dao)
	err = svc.DeleteUser(user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{
		"message": "user deleted",
	})
}

func UpdateUserProfile(c *gin.Context) {
	var payload UserProfile
	if err := c.ShouldBindWith(&payload, binding.FormMultipart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	if payload.ProfileImage != nil {
		file, err := payload.ProfileImage.Open()
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		if err = UserUploadProfileImage(user.ID, payload.ImageExt, file); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	dao := dao.NewUserDAO()
	svc := services.NewUserService(dao)
	modifyUser := models.User{
		ID:        user.ID,
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
		Telephone: payload.Telephone,
	}

	err = svc.Updates(&modifyUser)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"message": "profile modified",
	})

}
