package services

import (
	"fmt"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type userProfileImageDAO interface {
	GetByField(value, field string) (*models.UserProfileImage, error)
	CreateUserProfileImage(bP *models.UserProfileImage) error
	ModifyUserProfileImage(bP *models.UserProfileImage, field string, value interface{}) error
}

type UserProfileImageService struct {
	dao userProfileImageDAO
}

const (
	ObjectStorage = "https://storage.googleapis.com"
	ObjectName    = "profile_image"
)

func NewUserProfileImageService(dao userProfileImageDAO) *UserProfileImageService {
	return &UserProfileImageService{dao: dao}
}

func (s *UserProfileImageService) GetByField(value, field string) (*models.UserProfileImage, error) {
	return s.dao.GetByField(value, field)
}
func (svc *UserProfileImageService) CreateProfileImage(user *models.UserProfileImage, filename string) error {
	user.PublicUrl = fmt.Sprintf("%s/%s/%s", ObjectStorage, user.Bucket, filename)
	return svc.dao.CreateUserProfileImage(user)
}
func (svc *UserProfileImageService) ModifyUserProfileImage(user *models.UserProfileImage, filename string) error {
	url := fmt.Sprintf("%s/%s/%s", ObjectStorage, user.Bucket, filename)
	return svc.dao.ModifyUserProfileImage(user, "public_url", url)
}
