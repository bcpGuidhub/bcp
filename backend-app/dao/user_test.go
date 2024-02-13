package dao

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/database"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/helpers"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type UserDaoSuite struct {
	suite.Suite
}

// Make sure that VariableThatShouldStartAtFive is set to five
// before each test
func (suite *UserDaoSuite) SetupTest() {
	config.Datastore.AppDatabase, _ = database.ConnectPostgres()
}

func (suite *UserDaoSuite) TestUserDAO_GetByEmail() {
	if err := database.SeedDB(config.Datastore.AppDatabase.DB()); err != nil {
		suite.T().Errorf("Failed to seed db %s", err.Error())
	}

	userDao := NewUserDAO()
	user, err := userDao.GetByEmail("john.doe@gmail.com")
	expected := map[string]string{"first_name": "John", "last_name": "Doe", "email": "john.doe@gmail.com"}

	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), expected["first_name"], user.FirstName)
	assert.Equal(suite.T(), expected["last_name"], user.LastName)
	assert.Equal(suite.T(), expected["email"], user.Email)
}

//Non existing user .
func (suite *UserDaoSuite) TestUserDAO_GetByEmail_NonUser() {
	if err := database.SeedDB(config.Datastore.AppDatabase.DB()); err != nil {
		suite.T().Errorf("Failed to seed db %s", err.Error())
	}

	userDao := NewUserDAO()
	_, err := userDao.GetByEmail("john.00@gmail.com")

	assert.NotNil(suite.T(), err)
}
func (suite *UserDaoSuite) TestUserDAO_CreateUser() {
	if err := database.SeedDB(config.Datastore.AppDatabase.DB()); err != nil {
		suite.T().Errorf("Failed to seed db %s", err.Error())
	}
	user := models.User{FirstName: "muba", LastName: "base", Email: "base.muba@gmail.com"}
	userDao := NewUserDAO()
	user.Status = "pending_otp_validation"
	err := userDao.CreateUser(&user)
	expected := map[string]string{"first_name": "muba", "last_name": "base", "email": "base.muba@gmail.com", "status": "pending_otp_validation"}
	assert.Nil(suite.T(), err)
	assert.False(suite.T(), config.Datastore.AppDatabase.NewRecord(user))
	assert.Equal(suite.T(), expected["first_name"], user.FirstName)
	assert.Equal(suite.T(), expected["last_name"], user.LastName)
	assert.Equal(suite.T(), expected["email"], user.Email)
	assert.Equal(suite.T(), expected["status"], user.Status)
}

func (suite *UserDaoSuite) TestUserDAO_UpdateUser() {
	if err := database.SeedDB(config.Datastore.AppDatabase.DB()); err != nil {
		suite.T().Errorf("Failed to seed db %s", err.Error())
	}
	user := models.User{FirstName: "muba", LastName: "base", Email: "base.muba@gmail.com", Status: "pending_otp_validation"}
	userDao := NewUserDAO()
	userDao.CreateUser(&user)
	secret := "dummySECRETdummy"
	user.OTP = helpers.GetTOTPToken(secret)

	userDao.UpdateUser(&user, "otp", user.OTP)
	expected := map[string]string{"first_name": "muba", "last_name": "base", "email": "base.muba@gmail.com", "status": "pending_otp_validation", "otp": user.OTP}
	u, err := userDao.GetByEmail(user.Email)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), expected["first_name"], u.FirstName)
	assert.Equal(suite.T(), expected["last_name"], u.LastName)
	assert.Equal(suite.T(), expected["email"], u.Email)
	assert.Equal(suite.T(), expected["status"], u.Status)
	assert.Equal(suite.T(), expected["otp"], u.OTP)
}

func (suite *UserDaoSuite) TearDownSuite() {
	// Close the connection after all tests in the suite finish
	config.Datastore.AppDatabase.Close()
	// suite.sdb.Close()
}

func TestUserDAOSuite(t *testing.T) {
	suite.Run(t, new(UserDaoSuite))
}
