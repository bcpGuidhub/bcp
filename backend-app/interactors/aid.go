package interactors

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

var (
	// aidUrl       = "https://aides-entreprises.fr/api/public/V1.3/action/model/Aide
	aidUrl       = "https://api.aides-entreprises.fr/v1.1/aides"
	terittoryUrl = "https://api.aides-entreprises.fr/v1.1/territoires"
)

type financialAidQuery struct {
	query []queryPayload
}

type queryPayload struct {
	Id       string
	Name     string
	Resource string
}

func GetFinancialAid(c *gin.Context) {
	queryV := c.Request.URL.Query()["query[]"]
	loc := c.Request.URL.Query().Get("zone")
	page := c.Request.URL.Query().Get("page")
	queryAid := financialAidQuery{}
	for _, v := range queryV {
		data := queryPayload{}
		err := json.Unmarshal([]byte(v), &data)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		queryAid.query = append(queryAid.query, data)
	}
	apiQ := map[string][]string{}
	for _, q := range queryAid.query {
		key := q.Resource
		apiQ[key] = append(apiQ[key], q.Id)
	}
	var strQuery string
	for k, v := range apiQ {
		strQuery = strQuery + fmt.Sprintf("%s=%s&", k, strings.Join(v[:], ","))
	}
	strQuery = fmt.Sprintf("%s?%slimit=%d&clean_html=%t&show_indexation=%t&offset=%s", aidUrl, strQuery, 10, true, true, page)
	if loc != "" {
		strQuery = fmt.Sprintf("%s&territoire=%s", strQuery, loc)
	}
	body, err := fetchResult(strQuery)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, string(body))
}

func GetAid(c *gin.Context) {
	id := c.Param("aid")
	strQuery := fmt.Sprintf("%s/%s?clean_html=%t", aidUrl, id, true)
	log.Printf("%s", strQuery)
	body, err := fetchResult(strQuery)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, string(body))
}
func GetTerritory(c *gin.Context) {
	ter := c.Param("geoid")
	strQuery := fmt.Sprintf("%s?full_text=%s&limit=20&offset=0", terittoryUrl, ter)
	body, err := fetchResult(strQuery)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, string(body))

}

func fetchResult(url string) ([]byte, error) {
	method := "GET"
	client := &http.Client{}
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("accept", "application/json")
	req.Header.Add("X-Aidesentreprises-Key", os.Getenv("Aidesentreprises_Key"))
	req.Header.Add("X-Aidesentreprises-Id", os.Getenv("X_Aidesentreprises_Id"))
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	return ioutil.ReadAll(res.Body)
}
