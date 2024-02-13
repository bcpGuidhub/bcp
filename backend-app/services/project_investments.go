package services

import (
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/messages"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type projectInvestmentDao interface {
	EditProjectInvestment(pp *models.ProjectInvestment) (*models.ProjectInvestment, error)
	CreateProjectInvestment(pp *models.ProjectInvestment) error
	DeleteInvestment(p *models.ProjectInvestment) error
	FindProjectInvestment(p *models.ProjectInvestment) error
	ResetVat(projectId string) error
}

type ProjectInvestmentService struct {
	dao projectInvestmentDao
}

func NewProjectInvestmentService(dao projectInvestmentDao) *ProjectInvestmentService {
	return &ProjectInvestmentService{dao: dao}
}
func (svc *ProjectInvestmentService) FindProjectInvestment(p *models.ProjectInvestment) error {
	return svc.dao.FindProjectInvestment(p)
}
func (svc *ProjectInvestmentService) ResetVat(projectId string) (err error) {
	return svc.dao.ResetVat(projectId)
}
func (svc *ProjectInvestmentService) CreateProjectInvestment(p *models.ProjectInvestment) (messages.CreateInvestment, error) {
	if err := svc.dao.CreateProjectInvestment(p); err != nil {
		return messages.CreateInvestment{}, err
	}
	if p.Contribution == "Oui" {
		pI := models.ProjectCapitalContribution{
			ID:                        p.ID,
			ProjectId:                 p.ProjectId,
			CapitalContributionType:   "Apport en nature",
			CapitalContributionAmount: p.InvestmentAmountTaxIncluded,
			YearOfContribution:        p.YearOfPurchase,
			MonthOfContribution:       p.MonthOfPurchase,
		}
		dao := dao.NewProjectCapitalContributionDAO()
		s := NewProjectCapitalContributionService(dao)
		if _, err := s.CreateProjectCapitalContribution(&pI); err != nil {
			return messages.CreateInvestment{}, err
		}
	}
	return messages.CreateInvestment{
		Investment: p,
	}, nil
}

func (svc *ProjectInvestmentService) EditProjectInvestment(p *models.ProjectInvestment) error {
	pI := models.ProjectInvestment{
		ID: p.ID,
	}
	err := svc.FindProjectInvestment(&pI)
	if err != nil {
		return err
	}
	// if the contribution was changed
	// create a new projectInvestment
	// delete the preexisting projectInvestment
	if pI.Contribution != p.Contribution {
		pInew := models.ProjectInvestment{
			ProjectId:                   pI.ProjectId,
			InvestmentType:              p.InvestmentType,
			InvestmentName:              p.InvestmentName,
			InvestmentAmountTaxIncluded: p.InvestmentAmountTaxIncluded,
			YearOfPurchase:              p.YearOfPurchase,
			MonthOfPurchase:             p.MonthOfPurchase,
			Duration:                    p.Duration,
			VatRateOnInvestment:         p.VatRateOnInvestment,
			Contribution:                p.Contribution,
		}
		_, err := svc.CreateProjectInvestment(&pInew)
		if err != nil {
			return err
		}
		if err = svc.DeleteInvestment(&pI); err != nil {
			return err
		}
		return nil
	}
	_, err = svc.dao.EditProjectInvestment(p)
	if err != nil {
		return err
	}
	return nil
}

func (svc *ProjectInvestmentService) DeleteInvestment(p *models.ProjectInvestment) (err error) {
	err = svc.FindProjectInvestment(p)
	if err != nil {
		return
	}
	if p.Contribution == "Oui" {
		pcc := models.ProjectCapitalContribution{ID: p.ID}
		dao := dao.NewProjectCapitalContributionDAO()
		s := NewProjectCapitalContributionService(dao)
		if err = s.DeleteCapitalContribution(&pcc); err != nil {
			return
		}
	}
	err = svc.dao.DeleteInvestment(p)
	return
}
