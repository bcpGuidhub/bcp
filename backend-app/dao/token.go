package dao

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

// CreateToken will insert a token.
func (dao *UserDAO) CreateToken(token *models.Token) (err error) {
	err = config.Datastore.AppDatabase.Create(token).Error
	if err != nil {
		err = config.Datastore.AppDatabase.Model(&token).Update("content", token.Content).Error
	}
	return
}
func (dao *UserDAO) GetToken(content string) (*models.Token, error) {
	var token models.Token
	err := config.Datastore.AppDatabase.Preload("User").Where("content = ?", content).
		First(&token).
		Error
	return &token, err
}
