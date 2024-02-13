package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectRevenueDao interface {
	EditProjectRevenue(pp *models.ProjectRevenue) (*models.ProjectRevenue, error)
	CreateProjectRevenue(pp *models.ProjectRevenue) error
	DeleteRevenue(p *models.ProjectRevenue) error
	FindProjectRevenue(p *models.ProjectRevenue) error
	ResetVat(projectId string) error
}

type ProjectRevenueService struct {
	dao projectRevenueDao
}

func NewProjectRevenueService(dao projectRevenueDao) *ProjectRevenueService {
	return &ProjectRevenueService{dao: dao}
}
func (svc *ProjectRevenueService) FindProjectRevenue(p *models.ProjectRevenue) error {
	return svc.dao.FindProjectRevenue(p)
}
func (svc *ProjectRevenueService) CreateProjectRevenue(p *models.ProjectRevenue, years []*models.ProjectRevenuesYear) (messages.CreateRevenue, error) {
	if err := svc.dao.CreateProjectRevenue(p); err != nil {
		return messages.CreateRevenue{}, err
	}
	if p.RevenuePartition == "Personnalisée" {
		dao := dao.NewProjectRevenuesYearDAO()
		s := NewProjectRevenuesYearService(dao)
		for _, year := range years {
			year.ProjectRevenueId = p.ID
			if _, err := s.CreateProjectRevenuesYear(year); err != nil {
				return messages.CreateRevenue{}, err
			}
		}
	}
	return messages.CreateRevenue{
		Revenue:      p,
		RevenueYears: years,
	}, nil
}
func (svc *ProjectRevenueService) ResetVat(projectId string) (err error) {
	return svc.dao.ResetVat(projectId)
}
func (svc *ProjectRevenueService) EditProjectRevenue(p *models.ProjectRevenue, years []*models.ProjectRevenuesYear) (messages.EditRevenue, error) {
	pI := models.ProjectRevenue{
		ID: p.ID,
	}
	err := svc.FindProjectRevenue(&pI)
	if err != nil {
		return messages.EditRevenue{}, err
	}
	// if the RevenuePartition was changed
	// create a new projectRevenue
	// delete the preexisting projectRevenue
	if pI.RevenuePartition != p.RevenuePartition {
		pInew := models.ProjectRevenue{
			ProjectId:                    pI.ProjectId,
			RevenueLabel:                 p.RevenueLabel,
			RevenuePartition:             p.RevenuePartition,
			AnnualAmountTaxExcludedYear1: p.AnnualAmountTaxExcludedYear1,
			AnnualAmountTaxExcludedYear2: p.AnnualAmountTaxExcludedYear2,
			AnnualAmountTaxExcludedYear3: p.AnnualAmountTaxExcludedYear3,
			InventoryLinkedRevenue:       p.InventoryLinkedRevenue,
			PercentageMargin:             p.PercentageMargin,
			ValuationOfStartingStock:     p.ValuationOfStartingStock,
			MeanValuationOfStock:         p.MeanValuationOfStock,
			VatRateRevenue:               p.VatRateRevenue,
			CustomerPaymentDeadline:      p.CustomerPaymentDeadline,
			SupplierPaymentDeadline:      p.SupplierPaymentDeadline,
			VatRateOnPurchases:           p.VatRateOnPurchases,
		}
		_, err := svc.CreateProjectRevenue(&pInew, years)
		if err != nil {
			return messages.EditRevenue{}, err
		}
		if err = svc.DeleteRevenue(&pI); err != nil {
			return messages.EditRevenue{}, err
		}
		return messages.EditRevenue{
			Revenue:      &pInew,
			RevenueYears: years,
		}, nil
	}
	_, err = svc.dao.EditProjectRevenue(p)
	if err != nil {
		return messages.EditRevenue{}, err
	}
	if p.RevenuePartition == "Personnalisée" {
		dao := dao.NewProjectRevenuesYearDAO()
		s := NewProjectRevenuesYearService(dao)
		for _, year := range years {
			if _, err := s.EditProjectRevenuesYear(year); err != nil {
				return messages.EditRevenue{}, err
			}
		}
	}
	return messages.EditRevenue{
		Revenue:      p,
		RevenueYears: years,
	}, nil
}

func (svc *ProjectRevenueService) DeleteRevenue(p *models.ProjectRevenue) (err error) {
	err = svc.dao.DeleteRevenue(p)
	return
}
