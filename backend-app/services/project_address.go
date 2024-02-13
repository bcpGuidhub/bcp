package services

import (
	"errors"

	"gitlab.com/le-coin-des-entrepreneurs/backend-app/config"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/helpers"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	"googlemaps.github.io/maps"
)

var (
	AppConfig      *config.APPConfig
	InvalidAddress = errors.New("invalid address")
)

type projectAddressDao interface {
	GetById(id string) (*models.ProjectAddress, error)
	EditProjectAddress(pp *models.ProjectAddress) (*models.ProjectAddress, error)
}

type ProjectAddressService struct {
	dao projectAddressDao
}

func NewProjectAddressService(dao projectAddressDao) *ProjectAddressService {
	return &ProjectAddressService{dao: dao}
}

func (svc *ProjectAddressService) GetById(id string) (*models.ProjectAddress, error) {
	return svc.dao.GetById(id)
}
func (svc *ProjectAddressService) EditProjectAddress(pl *models.ProjectAddress) (messages.EditProjectAddress, error) {
	addr, err := helpers.ValidAddress(pl.City, pl.PostalCode, pl.Address)
	if err != nil {
		return messages.EditProjectAddress{}, InvalidAddress
	}
	r := &maps.GeocodingRequest{
		Address: addr,
	}
	point, err := AppConfig.GeoCode(r)
	if err != nil {
		return messages.EditProjectAddress{}, InvalidAddress
	}
	pl.GeographicalArea = models.Point{Lng: point[0], Lat: point[1]}
	pLp, err := svc.dao.EditProjectAddress(pl)
	if err != nil {
		return messages.EditProjectAddress{}, err
	}
	return messages.EditProjectAddress{
		ProjectAddress: pLp,
	}, err
}
