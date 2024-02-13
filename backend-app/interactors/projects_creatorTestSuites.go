package interactors

import (
	"context"
	"net/http"
	"os"
	"sync"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"go.mongodb.org/mongo-driver/mongo"
	"gopkg.in/mgo.v2/bson"
)

var (
	dbname                                        = "DB_BUSINESS_TEST_SUITES"
	DB                                            = os.Getenv(dbname)
	dbCollectionCreatorProjectTestSuite           = "testSuites.creator"
	dbCollectionCreatorProjectTestSuiteConditions = "testSuitesConditions.creator"
	dbCollectionCreatorProjectTestSuiteFollowUp   = "testSuitesFollowUp.creator"
	dbCollectionCreatorProjectTestSuiteSupport    = "testSuitesSupport.creator"
)

func GetCreatorProjectTestSuite(c *gin.Context) {

	projectId := c.Param("id")

	var keyLength int = 4
	errChan := make(chan error, keyLength)
	var wg sync.WaitGroup

	wg.Add(keyLength)

	var responseObj = struct {
		sync.RWMutex
		responsePayload map[string]interface{}
	}{responsePayload: make(map[string]interface{}, keyLength)}

	go getTestSuite(projectId, errChan, &responseObj, &wg)
	go getTestSuiteConditions(projectId, errChan, &responseObj, &wg)
	go getTestSuiteFollowUps(projectId, errChan, &responseObj, &wg)
	go getTestSuiteSupport(projectId, errChan, &responseObj, &wg)

	if err := <-errChan; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err})
		return
	}

	wg.Wait()
	defer close(errChan)
	c.JSON(200, responseObj.responsePayload)

}

func getTestSuite(projectId string, errChan chan<- error, responsePayload *struct {
	sync.RWMutex
	responsePayload map[string]interface{}
}, wg *sync.WaitGroup) {

	defer wg.Done()

	filter := bson.M{"aggregate_id": projectId}
	var conditons bson.M
	cxt := context.Background()
	db := config.Datastore.ReadDatabase.Database(DB)
	collection := db.Collection(dbCollectionCreatorProjectTestSuite)
	err := collection.FindOne(cxt, filter).Decode(&conditons)
	if err != nil && err != mongo.ErrNoDocuments {
		errChan <- err
	}
	errChan <- nil
	responsePayload.Lock()
	defer responsePayload.Unlock()
	responsePayload.responsePayload["test_suite"] = conditons
}

func getTestSuiteConditions(projectId string, errChan chan<- error, responsePayload *struct {
	sync.RWMutex
	responsePayload map[string]interface{}
}, wg *sync.WaitGroup) {

	defer wg.Done()

	filter := bson.M{"aggregate_id": projectId}
	var conditons bson.M
	cxt := context.Background()
	db := config.Datastore.ReadDatabase.Database(DB)
	collection := db.Collection(dbCollectionCreatorProjectTestSuiteConditions)
	err := collection.FindOne(cxt, filter).Decode(&conditons)
	if err != nil && err != mongo.ErrNoDocuments {
		errChan <- err
	}
	errChan <- nil
	responsePayload.Lock()
	defer responsePayload.Unlock()
	responsePayload.responsePayload["test_suite_conditions"] = conditons
}

func getTestSuiteFollowUps(projectId string, errChan chan<- error, responsePayload *struct {
	sync.RWMutex
	responsePayload map[string]interface{}
}, wg *sync.WaitGroup) {

	defer wg.Done()

	filter := bson.M{"aggregate_id": projectId}
	var conditons bson.M
	cxt := context.Background()
	db := config.Datastore.ReadDatabase.Database(DB)
	collection := db.Collection(dbCollectionCreatorProjectTestSuiteFollowUp)
	err := collection.FindOne(cxt, filter).Decode(&conditons)
	if err != nil && err != mongo.ErrNoDocuments {
		errChan <- err
	}
	errChan <- nil
	responsePayload.Lock()
	defer responsePayload.Unlock()
	responsePayload.responsePayload["test_suite_follow_up"] = conditons
}

func getTestSuiteSupport(projectId string, errChan chan<- error, responsePayload *struct {
	sync.RWMutex
	responsePayload map[string]interface{}
}, wg *sync.WaitGroup) {

	defer wg.Done()

	filter := bson.M{"aggregate_id": projectId}
	var conditons bson.M
	cxt := context.Background()
	db := config.Datastore.ReadDatabase.Database(DB)
	collection := db.Collection(dbCollectionCreatorProjectTestSuiteSupport)
	err := collection.FindOne(cxt, filter).Decode(&conditons)
	if err != nil && err != mongo.ErrNoDocuments {
		errChan <- err
	}
	errChan <- nil
	responsePayload.Lock()
	defer responsePayload.Unlock()
	responsePayload.responsePayload["test_suite_support"] = conditons
}
