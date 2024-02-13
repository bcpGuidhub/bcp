package config

import (
	"testing"

	"github.com/go-playground/assert/v2"
	_ "github.com/golang-migrate/migrate/v4/database"
	"github.com/stretchr/testify/suite"
)

type ConfigSuite struct {
	suite.Suite
	/*
		The suite is defined as a struct, with the config and db as its
		attributes. Any variables that are to be shared between tests in a
		suite should be stored as attributes of the suite instance
	*/
	defaultParameters map[string]interface{}
	config            Config
	env               string
}

// Make sure that VariableThatShouldStartAtFive is set to five
// before each test
func (suite *ConfigSuite) SetupTest() {

	d := map[string]interface{}{
		"host": "localhost",
		"port": 8080,
	}

	cf := Config{
		File:   "test_config",
		Format: "yaml",
		Path:   "./test_config_files",
	}

	env := "dev"
	suite.config = cf
	suite.defaultParameters = d
	suite.env = env
}

func (suite *ConfigSuite) TestNewWithConfigFile() {
	cfg, err := New(suite.config, suite.defaultParameters)
	if err != nil {
		suite.T().Errorf("failed to create config instance : %s ", err.Error())
	}
	assert.Equal(suite.T(), cfg.GetString("env.dev.host"), suite.defaultParameters["host"])
	assert.NotEqual(suite.T(), cfg.GetInt("env.dev.port"), suite.defaultParameters["port"])
}

func (suite *ConfigSuite) TestGetSecret() {
	cfg, _ := New(suite.config, suite.defaultParameters)
	assert.Equal(suite.T(), cfg.GetSecret(), "ada5afe9d4786a0a9b0bb7f53e2a6ffaac170cc7c6cea5daf32adf8a8585e98a")
}

func TestConfigTestSuite(t *testing.T) {
	suite.Run(t, new(ConfigSuite))
}
