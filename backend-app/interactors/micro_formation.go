package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
)

func GetMicroFormations(c *gin.Context) {
	_, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err)
		return
	}
	dao := dao.NewMicroFormationDAO()
	formations := dao.FetchMicroFormations()
	c.JSON(200, response.MicroFormations(formations))
}

func MicroFormationViewed(c *gin.Context) {
	formationId := c.Param("id")
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err)
		return
	}
	dao := dao.NewMicroFormationViewCountDAO()
	if err := dao.AssignMicroFormationViewCount(formationId, user.ID); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}
	c.JSON(200, microFormationViews(formationId))
}

func MicroFormationLiked(c *gin.Context) {
	formationId := c.Param("id")
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err)
		return
	}
	daoMicroFormationView := dao.NewMicroFormationViewPopularityDAO()
	err = daoMicroFormationView.AssignMicroFormationViewPopularity(formationId, user.ID)
	if err != nil {
		if dao.IsDuplicateKeyviolation(err) {
			c.JSON(200, "like_downgrade")
			return
		} else {
			c.JSON(http.StatusBadRequest, err)
			return
		}
	}
	c.JSON(200, microFormationPopularity(formationId))
}

func MicroFormationLikedRemove(c *gin.Context) {
	formationId := c.Param("id")
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err)
		return
	}
	daoMicroFormationView := dao.NewMicroFormationViewPopularityDAO()
	err = daoMicroFormationView.RemoveMicroFormationViewPopularity(formationId, user.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}
	c.JSON(200, microFormationViews(formationId))
}

func GetMicroFormationsStakeholder(c *gin.Context) {
	_, err := middlewares.GetAuthStakeholder(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err)
		return
	}
	dao := dao.NewMicroFormationDAO()
	formations := dao.FetchMicroFormations()
	c.JSON(200, response.MicroFormations(formations))
}

func MicroFormationViewedStakeholder(c *gin.Context) {
	formationId := c.Param("id")
	stakeholder, err := middlewares.GetAuthStakeholder(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err)
		return
	}
	dao := dao.NewMicroFormationViewCountStakeholderDAO()
	if err := dao.AssignMicroFormationViewCount(formationId, stakeholder.ID); err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}
	c.JSON(200, microFormationViews(formationId))
}

func MicroFormationLikedStakeholder(c *gin.Context) {
	formationId := c.Param("id")
	stakeholder, err := middlewares.GetAuthStakeholder(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err)
		return
	}
	daoMicroFormationView := dao.NewMicroFormationViewPopularityStakeholderDAO()
	err = daoMicroFormationView.AssignMicroFormationViewPopularity(formationId, stakeholder.ID)
	if err != nil {
		if dao.IsDuplicateKeyviolation(err) {
			c.JSON(200, "like_downgrade")
			return
		} else {
			c.JSON(http.StatusBadRequest, err)
			return
		}
	}
	c.JSON(200, microFormationPopularity(formationId))
}

func MicroFormationLikedRemoveStakeholder(c *gin.Context) {
	formationId := c.Param("id")
	stakeholder, err := middlewares.GetAuthStakeholder(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err)
		return
	}
	daoMicroFormationView := dao.NewMicroFormationViewPopularityStakeholderDAO()
	err = daoMicroFormationView.RemoveMicroFormationViewPopularity(formationId, stakeholder.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}
	c.JSON(200, microFormationViews(formationId))
}

func microFormationViews(formationId string) int {
	userDao := dao.NewMicroFormationViewCountDAO()
	stakeholderDao := dao.NewMicroFormationViewCountStakeholderDAO()
	views := userDao.FetchMicroFormationViewCounts(formationId) + stakeholderDao.FetchMicroFormationViewCounts(formationId)
	return views
}

func microFormationPopularity(formationId string) int {
	userDao := dao.NewMicroFormationViewPopularityDAO()
	stakeholderDao := dao.NewMicroFormationViewPopularityStakeholderDAO()
	likes := userDao.FetchMicroFormationViewPopularity(formationId) + stakeholderDao.FetchMicroFormationViewPopularity(formationId)
	return likes
}
