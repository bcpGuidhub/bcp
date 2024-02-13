package interactors

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"net/http"
	"os"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	middlewares "gitlab.com/le-coin-des-entrepreneurs/backend-app/middleware"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
	"googlemaps.github.io/maps"
)

const (
	DESTINATION_THRESHOLD = 25
	SEARCH_RADUIS         = 50000
)

type BetaAgencies struct {
	BetaAgencies []BetaAgency `json:"agencies"`
}
type BetaAgency struct {
	Region     string `json:"region"`
	Title      string `json:"title"`
	Adresse    string `json:"adresse"`
	Adresse_2  string `json:"adresse_2"`
	CodePostal string `json:"code_postal"`
	Ville      string `json:"ville"`
	Lat        string `json:"lat"`
	Lng        string `json:"lng"`
}
type BetaDestinationAgency struct {
	Meta        *maps.DistanceMatrixElement `json:"meta"`
	Destination string                      `json:"destination"`
	GeoMeta     maps.GeocodingResult        `json:"geo_meta"`
}

func AgencyGeoSearch(c *gin.Context) {
	user, err := middlewares.GetAuthUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err)
		return
	}
	dao := dao.NewProjectAddressDAO()
	svc := services.NewProjectAddressService(dao)
	pAddress, err := svc.GetById(user.ID)
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	gc, err := maps.NewClient(maps.WithAPIKey(os.Getenv("GOOGLE_SERVICES_API_KEY")))
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, err.Error())
		return
	}

	desc, err := os.Open("./beta_agencies_geo_locations.json")
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, err.Error())
		return
	}
	defer desc.Close()

	blob, err := ioutil.ReadAll(desc)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, err.Error())
		return
	}
	var betaAgencies BetaAgencies

	err = json.Unmarshal(blob, &betaAgencies)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, err.Error())
		return
	}
	var destinationsPartition [][]string
	pSize := int(math.Ceil(float64(len(betaAgencies.BetaAgencies)) / float64(DESTINATION_THRESHOLD)))

	for i := 0; i < pSize; i++ {
		d := []string{}
		for j := i * DESTINATION_THRESHOLD; j < (DESTINATION_THRESHOLD*(i+1)) && j < len(betaAgencies.BetaAgencies); j++ {
			address := fmt.Sprintf("%s, %s", betaAgencies.BetaAgencies[j].Lat, betaAgencies.BetaAgencies[j].Lng)
			d = append(d, address)
		}
		destinationsPartition = append(destinationsPartition, d)
	}
	var distancePartitions []*maps.DistanceMatrixRequest
	for _, partition := range destinationsPartition {
		req := &maps.DistanceMatrixRequest{
			Origins:      []string{fmt.Sprintf("%f, %f", pAddress.GeographicalArea.Lat, pAddress.GeographicalArea.Lng)},
			Destinations: partition,
			Mode:         maps.TravelModeDriving,
			Language:     "fr",
		}
		distancePartitions = append(distancePartitions, req)
	}
	channel := make(chan *maps.DistanceMatrixResponse, len(destinationsPartition))
	go getDistanceMatrix(gc, distancePartitions, channel)
	var locations []*maps.DistanceMatrixResponse
	for res := range channel {
		locations = append(locations, res)
	}
	var destAgencies []BetaDestinationAgency
	for j, r := range locations {
		for i, destination_address := range r.DestinationAddresses {
			dest := locations[j].Rows[0].Elements[i]
			if dest.Distance.Meters < SEARCH_RADUIS {
				req := maps.GeocodingRequest{
					Address: destination_address,
					Region:  "fr",
				}
				results, err := gc.Geocode(context.Background(), &req)
				if err != nil {
					c.JSON(http.StatusUnprocessableEntity, err.Error())
					return
				}
				if len(results) > 0 {
					destAgency := BetaDestinationAgency{
						Meta:        dest,
						Destination: destination_address,
						GeoMeta:     results[0],
					}
					destAgencies = append(destAgencies, destAgency)
				}
			}
		}
	}
	c.JSON(200, destAgencies)
}

func getDistanceMatrix(gc *maps.Client, r []*maps.DistanceMatrixRequest, c chan *maps.DistanceMatrixResponse) {
	var wg sync.WaitGroup
	go func() {
		wg.Wait()
		close(c)
	}()
	for _, req := range r {
		wg.Add(1)
		go func(c chan *maps.DistanceMatrixResponse, req *maps.DistanceMatrixRequest) {
			res, err := gc.DistanceMatrix(context.Background(), req)
			if err != nil {
				panic(err)
			}
			c <- res
			defer wg.Done()
		}(c, req)
	}
}
