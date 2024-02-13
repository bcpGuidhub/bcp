package middlewares

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

const (
	layoutISO = "2006-01-02"
)

func UserActivityMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := GetAuthUserRegistration(c)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, err.Error())
			return
		}
		daoUserActivity := dao.NewUserActivityDAO()
		svcUserActivity := services.NewUserActivityService(daoUserActivity)
		userActivity, err := svcUserActivity.GetUserActivityById(user.ID)
		if err != nil && !gorm.IsRecordNotFoundError(err) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, err.Error())
			return
		}
		if gorm.IsRecordNotFoundError(err) {
			userA := models.UserActivity{
				ID:             user.ID,
				FirstLoginDate: time.Now(),
				LastAccessDate: time.Now(),
			}
			if err = svcUserActivity.CreateUserActivity(&userA); err != nil {
				c.AbortWithStatusJSON(http.StatusUnauthorized, err.Error())
				return
			}
		}
		if err == nil {
			err := svcUserActivity.UpdateField(userActivity, "last_access_date", time.Now())
			if err != nil {
				c.AbortWithStatusJSON(http.StatusUnauthorized, err.Error())
				return
			}
		}
		daoUserActivityDate := dao.NewUserActivityDateDAO()
		svcUserActivityDate := services.NewUserActivityDateService(daoUserActivityDate)
		date, err := time.Parse(layoutISO, time.Now().Format(layoutISO))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, err.Error())
			return
		}
		userActivityDate, err := svcUserActivityDate.GetUserActivityDateByAtDate(user.ID, date)
		if err != nil && !gorm.IsRecordNotFoundError(err) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, err.Error())
			return
		}
		if gorm.IsRecordNotFoundError(err) {
			userAd := models.UserActivityDate{
				UserId:      user.ID,
				AccessCount: 1,
				AccessDate:  date,
			}
			if err := svcUserActivityDate.CreateUserActivityDate(&userAd); err != nil {
				c.AbortWithStatusJSON(http.StatusUnauthorized, err.Error())
				return
			}
		}
		if err == nil {
			var count int
			count = userActivityDate.AccessCount + 1
			if err = svcUserActivityDate.UpdateAccessCount(userActivityDate, count); err != nil {
				c.AbortWithStatusJSON(http.StatusUnauthorized, err.Error())
				return
			}
		}
		c.Next()
	}
}
