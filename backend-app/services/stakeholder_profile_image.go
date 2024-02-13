package services

import (
	"fmt"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type stakeholderProfileImageDAO interface {
	GetByField(value, field string) (*models.StakeholderProfileImage, error)
	CreateStakeholderProfileImage(bP *models.StakeholderProfileImage) error
	ModifyStakeholderProfileImage(bP *models.StakeholderProfileImage, field string, value interface{}) error
}

type StakeholderProfileImageService struct {
	dao stakeholderProfileImageDAO
}

func NewStakeholderProfileImageService(dao stakeholderProfileImageDAO) *StakeholderProfileImageService {
	return &StakeholderProfileImageService{dao: dao}
}

func (s *StakeholderProfileImageService) GetByField(value, field string) (*models.StakeholderProfileImage, error) {
	return s.dao.GetByField(value, field)
}
func (svc *StakeholderProfileImageService) CreateProfileImage(user *models.StakeholderProfileImage, filename string) error {
	user.PublicUrl = fmt.Sprintf("%s/%s/%s", ObjectStorage, user.Bucket, filename)
	return svc.dao.CreateStakeholderProfileImage(user)
}
func (svc *StakeholderProfileImageService) ModifyStakeholderProfileImage(user *models.StakeholderProfileImage, filename string) error {
	url := fmt.Sprintf("%s/%s/%s", ObjectStorage, user.Bucket, filename)
	return svc.dao.ModifyStakeholderProfileImage(user, "public_url", url)
}
