package interactors

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

var upGrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type projectDirectorDeletePayload struct {
	Id string `form:"id" json:"id" binding:"required"`
}
type projectDirectorEditPayload struct {
	Id                        string                                        `form:"id" json:"id" binding:"required"`
	FirstName                 string                                        `form:"first_name" json:"first_name"  binding:"required"`
	LastName                  string                                        `form:"last_name" json:"last_name" binding:"required"`
	PercentageEquityCapital   string                                        `form:"percentage_equity_capital" json:"percentage_equity_capital" binding:"required"`
	DirectorAcre              string                                        `form:"director_acre" json:"director_acre" binding:"required"`
	CompensationPartition     string                                        `form:"compensation_partition" json:"compensation_partition" binding:"required"`
	NetCompensationYear1      string                                        `form:"net_compensation_year_1" json:"net_compensation_year_1" binding:"required"`
	NetCompensationYear2      string                                        `form:"net_compensation_year_2" json:"net_compensation_year_2" binding:"required"`
	NetCompensationYear3      string                                        `form:"net_compensation_year_3" json:"net_compensation_year_3" binding:"required"`
	CotisationsSocialesYear1  string                                        `form:"cotisations_sociales_year_1" json:"cotisations_sociales_year_1" binding:"required"`
	CotisationsSocialesYear2  string                                        `form:"cotisations_sociales_year_2" json:"cotisations_sociales_year_2" binding:"required"`
	CotisationsSocialesYear3  string                                        `form:"cotisations_sociales_year_3" json:"cotisations_sociales_year_3" binding:"required"`
	DirectorRenumerationYears []projectDirectorRenumerationYearsEditPayload `form:"director_renumeration_years" json:"director_renumeration_years"`
	DirectorCotisationYears   []projectDirectorCotisationYearsEditPayload   `form:"director_cotisation_years" json:"director_cotisation_years"`
}
type projectDirectorCotisationYearsEditPayload struct {
	Id                string `form:"id" json:"id"`
	Year              string `form:"year" json:"year"`
	Month1Cotisation  string `form:"month_1_cotisation" json:"month_1_cotisation"`
	Month2Cotisation  string `form:"month_2_cotisation" json:"month_2_cotisation"`
	Month3Cotisation  string `form:"month_3_cotisation" json:"month_3_cotisation"`
	Month4Cotisation  string `form:"month_4_cotisation" json:"month_4_cotisation"`
	Month5Cotisation  string `form:"month_5_cotisation" json:"month_5_cotisation"`
	Month6Cotisation  string `form:"month_6_cotisation" json:"month_6_cotisation"`
	Month7Cotisation  string `form:"month_7_cotisation" json:"month_7_cotisation"`
	Month8Cotisation  string `form:"month_8_cotisation" json:"month_8_cotisation"`
	Month9Cotisation  string `form:"month_9_cotisation" json:"month_9_cotisation"`
	Month10Cotisation string `form:"month_10_cotisation" json:"month_10_cotisation"`
	Month11Cotisation string `form:"month_11_cotisation" json:"month_11_cotisation"`
	Month12Cotisation string `form:"month_12_cotisation" json:"month_12_cotisation"`
}
type projectDirectorCotisationYearsCreationPayload struct {
	Year              string `form:"year" json:"year"`
	Month1Cotisation  string `form:"month_1_cotisation" json:"month_1_cotisation"`
	Month2Cotisation  string `form:"month_2_cotisation" json:"month_2_cotisation"`
	Month3Cotisation  string `form:"month_3_cotisation" json:"month_3_cotisation"`
	Month4Cotisation  string `form:"month_4_cotisation" json:"month_4_cotisation"`
	Month5Cotisation  string `form:"month_5_cotisation" json:"month_5_cotisation"`
	Month6Cotisation  string `form:"month_6_cotisation" json:"month_6_cotisation"`
	Month7Cotisation  string `form:"month_7_cotisation" json:"month_7_cotisation"`
	Month8Cotisation  string `form:"month_8_cotisation" json:"month_8_cotisation"`
	Month9Cotisation  string `form:"month_9_cotisation" json:"month_9_cotisation"`
	Month10Cotisation string `form:"month_10_cotisation" json:"month_10_cotisation"`
	Month11Cotisation string `form:"month_11_cotisation" json:"month_11_cotisation"`
	Month12Cotisation string `form:"month_12_cotisation" json:"month_12_cotisation"`
}
type projectDirectorRenumerationYearsEditPayload struct {
	Id            string `form:"id" json:"id"`
	Year          string `form:"year" json:"year"`
	Month1Amount  string `form:"month_1_amount" json:"month_1_amount"`
	Month2Amount  string `form:"month_2_amount" json:"month_2_amount"`
	Month3Amount  string `form:"month_3_amount" json:"month_3_amount"`
	Month4Amount  string `form:"month_4_amount" json:"month_4_amount"`
	Month5Amount  string `form:"month_5_amount" json:"month_5_amount"`
	Month6Amount  string `form:"month_6_amount" json:"month_6_amount"`
	Month7Amount  string `form:"month_7_amount" json:"month_7_amount"`
	Month8Amount  string `form:"month_8_amount" json:"month_8_amount"`
	Month9Amount  string `form:"month_9_amount" json:"month_9_amount"`
	Month10Amount string `form:"month_10_amount" json:"month_10_amount"`
	Month11Amount string `form:"month_11_amount" json:"month_11_amount"`
	Month12Amount string `form:"month_12_amount" json:"month_12_amount"`
}
type projectDirectorRenumerationYearsCreationPayload struct {
	Year          string `form:"year" json:"year"`
	Month1Amount  string `form:"month_1_amount" json:"month_1_amount"`
	Month2Amount  string `form:"month_2_amount" json:"month_2_amount"`
	Month3Amount  string `form:"month_3_amount" json:"month_3_amount"`
	Month4Amount  string `form:"month_4_amount" json:"month_4_amount"`
	Month5Amount  string `form:"month_5_amount" json:"month_5_amount"`
	Month6Amount  string `form:"month_6_amount" json:"month_6_amount"`
	Month7Amount  string `form:"month_7_amount" json:"month_7_amount"`
	Month8Amount  string `form:"month_8_amount" json:"month_8_amount"`
	Month9Amount  string `form:"month_9_amount" json:"month_9_amount"`
	Month10Amount string `form:"month_10_amount" json:"month_10_amount"`
	Month11Amount string `form:"month_11_amount" json:"month_11_amount"`
	Month12Amount string `form:"month_12_amount" json:"month_12_amount"`
}
type projectDirectorCreationPayload struct {
	FirstName                 string                                            `form:"first_name" json:"first_name" binding:"required"`
	LastName                  string                                            `form:"last_name" json:"last_name" binding:"required"`
	PercentageEquityCapital   string                                            `form:"percentage_equity_capital" json:"percentage_equity_capital" binding:"required"`
	DirectorAcre              string                                            `form:"director_acre" json:"director_acre" binding:"required"`
	CompensationPartition     string                                            `form:"compensation_partition" json:"compensation_partition" binding:"required"`
	NetCompensationYear1      string                                            `form:"net_compensation_year_1" json:"net_compensation_year_1" binding:"required"`
	NetCompensationYear2      string                                            `form:"net_compensation_year_2" json:"net_compensation_year_2" binding:"required"`
	NetCompensationYear3      string                                            `form:"net_compensation_year_3" json:"net_compensation_year_3" binding:"required"`
	CotisationsSocialesYear1  string                                            `form:"cotisations_sociales_year_1" json:"cotisations_sociales_year_1" binding:"required"`
	CotisationsSocialesYear2  string                                            `form:"cotisations_sociales_year_2" json:"cotisations_sociales_year_2" binding:"required"`
	CotisationsSocialesYear3  string                                            `form:"cotisations_sociales_year_3" json:"cotisations_sociales_year_3" binding:"required"`
	DirectorRenumerationYears []projectDirectorRenumerationYearsCreationPayload `form:"director_renumeration_years" json:"director_renumeration_years"`
	DirectorCotisationYears   []projectDirectorCotisationYearsCreationPayload   `form:"director_cotisation_years" json:"director_cotisation_years"`
}

func CreateProjectDirector(c *gin.Context) {
	projectId := c.Param("id")

	var p projectDirectorCreationPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pI := models.ProjectDirector{
		ProjectId:                projectId,
		FirstName:                p.FirstName,
		LastName:                 p.LastName,
		PercentageEquityCapital:  p.PercentageEquityCapital,
		DirectorAcre:             p.DirectorAcre,
		CompensationPartition:    p.CompensationPartition,
		NetCompensationYear1:     p.NetCompensationYear1,
		NetCompensationYear2:     p.NetCompensationYear2,
		NetCompensationYear3:     p.NetCompensationYear3,
		CotisationsSocialesYear1: p.CotisationsSocialesYear1,
		CotisationsSocialesYear2: p.CotisationsSocialesYear2,
		CotisationsSocialesYear3: p.CotisationsSocialesYear3,
	}
	dao := dao.NewProjectDirectorDAO()
	svc := services.NewProjectDirectorService(dao)
	years := []*models.ProjectDirectorRenumerationYear{}
	cotisationYears := []*models.ProjectDirectorCotisationYear{}
	for _, v := range p.DirectorRenumerationYears {
		ry := models.ProjectDirectorRenumerationYear{
			Year:          v.Year,
			Month1Amount:  v.Month1Amount,
			Month2Amount:  v.Month2Amount,
			Month3Amount:  v.Month3Amount,
			Month4Amount:  v.Month4Amount,
			Month5Amount:  v.Month5Amount,
			Month6Amount:  v.Month6Amount,
			Month7Amount:  v.Month7Amount,
			Month8Amount:  v.Month8Amount,
			Month9Amount:  v.Month9Amount,
			Month10Amount: v.Month10Amount,
			Month11Amount: v.Month11Amount,
			Month12Amount: v.Month12Amount,
		}
		years = append(years, &ry)
	}
	for _, v := range p.DirectorCotisationYears {
		cotisationY := models.ProjectDirectorCotisationYear{
			Year:              v.Year,
			Month1Cotisation:  v.Month1Cotisation,
			Month2Cotisation:  v.Month2Cotisation,
			Month3Cotisation:  v.Month3Cotisation,
			Month4Cotisation:  v.Month4Cotisation,
			Month5Cotisation:  v.Month5Cotisation,
			Month6Cotisation:  v.Month6Cotisation,
			Month7Cotisation:  v.Month7Cotisation,
			Month8Cotisation:  v.Month8Cotisation,
			Month9Cotisation:  v.Month9Cotisation,
			Month10Cotisation: v.Month10Cotisation,
			Month11Cotisation: v.Month11Cotisation,
			Month12Cotisation: v.Month12Cotisation,
		}
		cotisationYears = append(cotisationYears, &cotisationY)
	}
	i, err := svc.CreateProjectDirector(&pI, years, cotisationYears)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.OnCreateDirector(&i))
}
func FetchProjectDirectors(c *gin.Context) {
	projectId := c.Param("id")

	c.JSON(200, response.FetchProjectDirectors(projectId))
}

func EditProjectDirector(c *gin.Context) {
	projectId := c.Param("id")

	var p projectDirectorEditPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectDirectorDAO()
	svc := services.NewProjectDirectorService(dao)
	pI := models.ProjectDirector{
		ID:                       p.Id,
		FirstName:                p.FirstName,
		LastName:                 p.LastName,
		PercentageEquityCapital:  p.PercentageEquityCapital,
		DirectorAcre:             p.DirectorAcre,
		CompensationPartition:    p.CompensationPartition,
		NetCompensationYear1:     p.NetCompensationYear1,
		NetCompensationYear2:     p.NetCompensationYear2,
		NetCompensationYear3:     p.NetCompensationYear3,
		CotisationsSocialesYear1: p.CotisationsSocialesYear1,
		CotisationsSocialesYear2: p.CotisationsSocialesYear2,
		CotisationsSocialesYear3: p.CotisationsSocialesYear3,
	}
	years := []*models.ProjectDirectorRenumerationYear{}
	cotisationYears := []*models.ProjectDirectorCotisationYear{}
	for _, v := range p.DirectorRenumerationYears {
		ry := models.ProjectDirectorRenumerationYear{
			ID:            v.Id,
			Year:          v.Year,
			Month1Amount:  v.Month1Amount,
			Month2Amount:  v.Month2Amount,
			Month3Amount:  v.Month3Amount,
			Month4Amount:  v.Month4Amount,
			Month5Amount:  v.Month5Amount,
			Month6Amount:  v.Month6Amount,
			Month7Amount:  v.Month7Amount,
			Month8Amount:  v.Month8Amount,
			Month9Amount:  v.Month9Amount,
			Month10Amount: v.Month10Amount,
			Month11Amount: v.Month11Amount,
			Month12Amount: v.Month12Amount,
		}
		years = append(years, &ry)
	}
	for _, v := range p.DirectorCotisationYears {
		cotisationY := models.ProjectDirectorCotisationYear{
			ID:                v.Id,
			Year:              v.Year,
			Month1Cotisation:  v.Month1Cotisation,
			Month2Cotisation:  v.Month2Cotisation,
			Month3Cotisation:  v.Month3Cotisation,
			Month4Cotisation:  v.Month4Cotisation,
			Month5Cotisation:  v.Month5Cotisation,
			Month6Cotisation:  v.Month6Cotisation,
			Month7Cotisation:  v.Month7Cotisation,
			Month8Cotisation:  v.Month8Cotisation,
			Month9Cotisation:  v.Month9Cotisation,
			Month10Cotisation: v.Month10Cotisation,
			Month11Cotisation: v.Month11Cotisation,
			Month12Cotisation: v.Month12Cotisation,
		}
		cotisationYears = append(cotisationYears, &cotisationY)
	}
	_, err := svc.EditProjectDirector(&pI, years, cotisationYears)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.FetchProjectDirectors(projectId))
}

func DeleteProjectDirector(c *gin.Context) {
	projectId := c.Param("id")

	var i projectDirectorDeletePayload
	if err := c.ShouldBindJSON(&i); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectDirectorDAO()
	svc := services.NewProjectDirectorService(dao)
	p := models.ProjectDirector{
		ID: i.Id,
	}
	if err := svc.DeleteDirector(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.FetchProjectDirectors(projectId))
}
func DirectorCotisationProcessing(c *gin.Context) {
	//Upgrade get request to webSocket protocol
	ws, err := upGrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	defer ws.Close()
	var data struct {
		ID string `json:"id"`
	}
	//Read data in ws
	err = ws.ReadJSON(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Write ws data, pong 10 times
	var count = 0
	for {
		count++
		if count > 10 {
			break
		}
		dao := dao.NewProjectDirectorDAO()
		svc := services.NewProjectDirectorService(dao)
		director, err := svc.GetProjectDirector(data.ID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if director.ProcessingCotisations == "true" {
			err = ws.WriteJSON(response.DirectorDto{
				ProcessingCotisations: "true",
			})
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
		} else {
			err = ws.WriteJSON(response.FetchProjectDirector(director))
			if err != nil {
				log.Println("error write json: " + err.Error())
			}
			break
		}
		time.Sleep(5 * time.Second)
	}
}
