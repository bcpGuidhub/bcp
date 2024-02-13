package middlewares

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/twinj/uuid"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/database"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

const (
	authCookieMaxAge       = time.Minute * 15
	userCookieSessionID    = cookiePrefix + "user-auth"
	advisorCookieSessionID = cookiePrefix + "stakeholder-auth"
)

type TokenDetails struct {
	AccessToken  string
	RefreshToken string
	AccessUuid   string
	RefreshUuid  string
	AtExpires    int64
	RtExpires    int64
}

type AccessDetails struct {
	AccessUuid string
	UserId     string
}

var TokenSecret string
var Env string

func CreateToken(metaId, metaType string) (*TokenDetails, error) {
	td := &TokenDetails{}
	td.AtExpires = time.Now().Add(authCookieMaxAge).Unix()
	td.AccessUuid = uuid.NewV4().String()

	td.RtExpires = time.Now().Add(time.Hour * 24 * 2).Unix()
	td.RefreshUuid = uuid.NewV4().String()

	var err error
	//Creating Access Token
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["access_uuid"] = td.AccessUuid
	atClaims[fmt.Sprintf("%s_id", metaType)] = metaId
	atClaims["exp"] = td.AtExpires
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	td.AccessToken, err = at.SignedString([]byte(TokenSecret))
	if err != nil {
		return nil, err
	}
	//Creating Refresh Token
	rtClaims := jwt.MapClaims{}
	rtClaims["refresh_uuid"] = td.RefreshUuid
	rtClaims[fmt.Sprintf("%s_id", metaType)] = metaId
	rtClaims["exp"] = td.RtExpires
	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
	td.RefreshToken, err = rt.SignedString([]byte(TokenSecret))
	if err != nil {
		return nil, err
	}
	return td, nil
}

func CreateAuth(userid string, td *TokenDetails) error {
	at := time.Unix(td.AtExpires, 0) //converting Unix to UTC(to Time object)
	rt := time.Unix(td.RtExpires, 0)
	now := time.Now()

	errAccess := database.RedisClient.Set(context.Background(), td.AccessUuid, userid, at.Sub(now)).Err()
	if errAccess != nil {
		return errAccess
	}
	errRefresh := database.RedisClient.Set(context.Background(), td.RefreshUuid, userid, rt.Sub(now)).Err()
	if errRefresh != nil {
		return errRefresh
	}
	return nil
}

func ExtractToken(r *http.Request, metaType string) (string, error) {
	var cookie *http.Cookie
	var err error
	if metaType == "stakeholder" {
		cookie, err = r.Cookie(advisorCookieSessionID)
	} else {
		cookie, err = r.Cookie(userCookieSessionID)
	}
	if err != nil {
		return "", err
	}
	return cookie.Value, nil
	//	bearToken := r.Header.Get("Authorization")
	//	//normally Authorization the_token_xxx
	//	strArr := strings.Split(bearToken, " ")
	//	if len(strArr) == 2 {
	//		return strArr[1]
	//	}
	//	return ""
}

func VerifyToken(r *http.Request, metaType string) (*jwt.Token, error) {
	tokenString, err := ExtractToken(r, metaType)
	if err != nil {
		return nil, err
	}
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(TokenSecret), nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
}

func TokenValid(r *http.Request, metaType string) error {
	token, err := VerifyToken(r, metaType)
	if err != nil {
		return err
	}
	if !token.Valid {
		return errors.New("token is invalid")
	}
	return nil
}

func ExtractTokenMetadata(r *http.Request, metaType string) (*AccessDetails, error) {
	var userid string
	var ok bool
	token, err := VerifyToken(r, metaType)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		accessUuid, ok := claims["access_uuid"].(string)
		if !ok {
			return nil, err
		}
		userid, ok = claims[fmt.Sprintf("%s_id", metaType)].(string)
		if !ok {
			return nil, err
		}
		return &AccessDetails{
			AccessUuid: accessUuid,
			UserId:     userid,
		}, nil
	}
	return nil, err
}

func FetchAuth(authD *AccessDetails) (string, error) {
	userid, err := database.RedisClient.Get(context.Background(), authD.AccessUuid).Result()
	if err != nil {
		return "", err
	}
	return userid, nil
}

func DeleteAuth(givenUuid string) error {
	_, err := database.RedisClient.Del(context.Background(), givenUuid).Result()
	if err != nil {
		return err
	}
	return nil
}

func SetClientAuth(c *gin.Context, tokenPayload, metaType string) (map[string]string, error) {
	refreshToken := make(map[string]string)
	ts, err := CreateToken(tokenPayload, metaType)
	if err != nil {
		return refreshToken, err
	}
	err = CreateAuth(tokenPayload, ts)
	if err != nil {
		return refreshToken, err
	}
	refreshToken["refresh_token"] = ts.RefreshToken
	SetCookie(c, ts, Env, metaType)
	return refreshToken, nil
}
func SetClientPasswordAuth(c *gin.Context, tokenPayload, metaType string) (err error) {
	ts, err := CreateToken(tokenPayload, metaType)
	if err != nil {
		return
	}
	err = CreateAuth(tokenPayload, ts)
	if err != nil {
		return
	}
	SetCookie(c, ts, Env, metaType)
	return
}

func TokenAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := TokenValid(c.Request, "user")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, err.Error())
			return
		}
		c.Next()
	}
}

func StakeholderTokenAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := TokenValid(c.Request, "stakeholder")
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			c.Abort()
			return
		}
		c.Next()
	}
}

func RefreshToken(refreshToken, metaType string) (TokenDetails, error) {
	//verify the token
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(TokenSecret), nil
	})
	if err != nil {
		return TokenDetails{}, err
	}
	//Since token is valid, get the uuid:
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		refreshUuid, ok := claims["refresh_uuid"].(string)
		if !ok {
			return TokenDetails{}, errors.New("token is invalid")
		}
		userId, ok := claims[fmt.Sprintf("%s_id", metaType)].(string)
		if !ok {
			return TokenDetails{}, errors.New("token is invalid")
		}
		//Delete the previous Refresh Token
		delErr := DeleteAuth(refreshUuid)
		if delErr != nil {
			return TokenDetails{}, delErr
		}
		//Create new pairs of refresh and access tokens
		ts, createErr := CreateToken(userId, metaType)
		if createErr != nil {
			return TokenDetails{}, createErr
		}
		//save the tokens metadata to redis
		saveErr := CreateAuth(userId, ts)
		if saveErr != nil {
			return TokenDetails{}, saveErr
		} else {
			return *ts, nil
		}
	}
	return TokenDetails{}, errors.New("token is invalid")
}

// GetAuthUser extracts a user id
// if one exists from a request.
// Check if the user has validated their account
// thus live.
func GetAuthUser(c *gin.Context) (*models.User, error) {

	authUser, err := GetAuthUserRegistration(c)
	if err != nil {
		return authUser, err
	}
	if !authUser.Live() || authUser.ID == "" {
		return nil, errors.New("user is not authorised")
	}

	return authUser, nil
}

func GetAuthStakeholder(c *gin.Context) (*models.ProjectStakeholder, error) {

	authStakeholder, err := GetAuthStakeholderRegistration(c)
	if err != nil {
		return authStakeholder, err
	}
	if !authStakeholder.Live() || authStakeholder.ID == "" {
		return nil, errors.New("user is not authorised")
	}

	return authStakeholder, nil
}

func ClearAuthMeta(c *gin.Context, metaType string) {
	au, err := ExtractTokenMetadata(c.Request, metaType)
	if err == nil && au.AccessUuid != "" {
		DeleteAuth(au.AccessUuid)
	}
	DeleteCookie(c, Env, metaType)
}

func GetAuthUserRegistration(c *gin.Context) (*models.User, error) {
	var user models.User
	tokenAuth, err := ExtractTokenMetadata(c.Request, "user")
	if err != nil {
		return &user, err
	}
	userId, err := FetchAuth(tokenAuth)
	if err != nil {
		return &user, err
	}
	dao := dao.NewUserDAO()
	authUser, err := dao.GetById(userId)
	if err != nil {
		return authUser, errors.New("user is not authorised")
	}
	return authUser, nil
}

func GetAuthStakeholderRegistration(c *gin.Context) (*models.ProjectStakeholder, error) {
	var stakeholder models.ProjectStakeholder
	tokenAuth, err := ExtractTokenMetadata(c.Request, "stakeholder")
	if err != nil {
		return &stakeholder, err
	}
	stakeholderId, err := FetchAuth(tokenAuth)
	if err != nil {
		return &stakeholder, err
	}
	dao := dao.NewProjectStakeholderDAO()
	authStakeholder, err := dao.GetById(stakeholderId)
	if err != nil {
		return authStakeholder, errors.New("user is not authorised")
	}
	return authStakeholder, nil
}

func SetCookie(c *gin.Context, token *TokenDetails, env, metaType string) {
	var name string
	if metaType == "stakeholder" {
		name = advisorCookieSessionID
	} else {
		name = userCookieSessionID
	}

	maxAge := int(token.AtExpires - time.Now().Unix())
	path := "/"
	domain := ""
	secure := true
	httpOnly := true
	if env == "dev" || env == "staging" {
		secure = false
	}
	c.SetCookie(
		name,
		token.AccessToken,
		maxAge,
		path,
		domain,
		secure,
		httpOnly)

}

func DeleteCookie(c *gin.Context, env, metaType string) {
	var name string
	if metaType == "stakeholder" {
		name = advisorCookieSessionID
	} else {
		name = userCookieSessionID
	}
	value := ""
	maxAge := -1
	path := "/"
	domain := ""
	secure := true
	httpOnly := true
	if env == "dev" || env == "staging" {
		secure = false
	}
	c.SetCookie(
		name,
		value,
		maxAge,
		path,
		domain,
		secure,
		httpOnly,
	)
}
