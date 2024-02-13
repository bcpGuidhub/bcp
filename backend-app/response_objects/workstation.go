package response

import (
	"time"

	"github.com/jinzhu/gorm"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
)

type BusinessPlanDto struct {
	Project               ProjectDto               `json:"project"`
	ProjectPreparation    ProjectPreparationDto    `json:"project_preparation"`
	ProjectMarketResearch ProjectMarketResearchDto `json:"project_market_research"`
	ProjectStakeholder    []StakeholderDto         `json:"project_stakeholders"`
	ProjectOwner          UserDto                  `json:"owner"`
}

type ProjectPreparationDto struct {
	ID                               string `json:"id"`
	NonCompeteClause                 string `json:"non_compete_clause"`
	DomainCompetence                 string `json:"domain_competence"`
	ProjectParticipants              string `json:"project_participants"`
	VerifiedInterestInIdea           string `json:"verified_interest_in_idea"`
	IsProjectInnovative              string `json:"is_project_innovative"`
	IsTrademarkProctectionRequired   string `json:"is_trademark_proctection_required"`
	ShortDescriptionIdea             string `json:"short_description_idea"`
	WebsiteRequired                  string `json:"website_required"`
	TechnicalDomainCompetence        string `json:"technical_domain_competence"`
	SalesDomainCompetence            string `json:"sales_domain_competence"`
	ManagementDomainCompetence       string `json:"management_domain_competence"`
	CurrentEmploymentStatus          string `json:"current_employment_status"`
	ContractType                     string `json:"contract_type"`
	TypeContractRupture              string `json:"type_contract_rupture"`
	ProfessionalReconversion         string `json:"professional_reconversion"`
	RequiresQuitingJob               string `json:"requires_quiting_job"`
	InCompetitionWithCurrentEmployer string `json:"in_competition_with_current_employer"`
	ExclusivityClause                string `json:"exclusivity_clause"`
}

type ProjectMarketResearchDto struct {
	ID                      string `json:"id"`
	MarketCharacteristics   string `json:"market_characteristics"`
	TargetMarket            string `json:"target_market"`
	PrincipleCompetition    string `json:"principal_competition"`
	ServiceDescription      string `json:"service_description"`
	ProductStrongWeakPoints string `json:"product_strong_weak_points"`
	CommercialProcess       string `json:"commercial_process"`
	TrademarkProtection     string `json:"trademark_protection"`
	BusinessPlacement       string `json:"business_placement"`
	SupplyChain             string `json:"supply_chain"`
	CommunicationStrategy   string `json:"communication_strategy"`
}

type ProjectLegalStatusDto struct {
	ID                                   string   `json:"id"`
	StakeHolders                         string   `json:"stake_holders"`
	LegalStatusIdea                      string   `json:"legal_status_idea"`
	RecommendedLegalStatusIdea           string   `json:"recommended_legal_status_idea"`
	ManagementStake                      string   `json:"management_stake"`
	TaxSystem                            string   `json:"tax_system"`
	PersonalWealthSecurityRequired       string   `json:"personal_wealth_security_required"`
	CompanyTaxPolicy                     string   `json:"company_tax_policy"`
	SocialSecurityScheme                 string   `json:"social_security_scheme"`
	SituationPoleEmploi                  string   `json:"situation_pole_emploi"`
	LocaleOfChoice                       string   `json:"locale_of_choice"`
	PropertyOwner                        string   `json:"property_owner"`
	PropertyAdministration               string   `json:"property_administration"`
	DomiciliationCompany                 string   `json:"domiciliation_company"`
	ProfessionalLocale                   string   `json:"professional_locale"`
	LocalisationFinancialAid             string   `json:"localisation_financial_aid"`
	LeaseLocale                          string   `json:"lease_locale"`
	VerifiedContractCommercialLeases     string   `json:"verified_contract_commercial_leases"`
	LocaleActivityCompatability          string   `json:"locale_activity_compatability"`
	LeaseContractDuration                string   `json:"lease_contract_duration"`
	LeaseRentalPriceFairness             string   `json:"lease_rental_price_fairness"`
	VerifiedLeasePriceRenegiations       string   `json:"verified_lease_price_renegiations"`
	VerifiedPayableTentantFees           string   `json:"verified_payable_tentant_fees"`
	VerifiedInventory                    string   `json:"verified_inventory"`
	CompanyVatRegime                     string   `json:"company_vat_regime"`
	CriteriaBasedLegalStatusIdea         string   `json:"criteria_based_legal_status_idea"`
	UserLegalCriteria                    []string `json:"user_legal_criteria"`
	Associates                           string   `json:"associates"`
	UserTaxCriteria                      []string `json:"user_tax_criteria"`
	UserTvaCriteria                      []string `json:"user_tva_criteria"`
	MicroEntrepriseAccreExemption        string   `json:"micro_entreprise_accre_exemption"`
	MicroEntrepriseDeclarePayCotisations string   `json:"micro_entreprise_declare_pay_cotisations"`
	MicroEntrepriseActivityCategory      string   `json:"micro_entreprise_activity_category"`
}

type UserDto struct {
	Email            string `json:"email"`
	ID               string `json:"id"`
	FirstName        string `json:"first_name"`
	LastName         string `json:"last_name"`
	Telephone        string `json:"telephone"`
	ProfileImage     string `json:"profile_image"`
	ReachableByPhone bool   `json:"reachable_by_phone"`
}

type ProjectDto struct {
	ID                          string `json:"id"`
	TypeProject                 string `json:"type_project"`
	SearchableAddress           string `json:"searchable_address"`
	ActivitySector              string `json:"activity_sector"`
	ProjectAdvancementStage     string `json:"project_advancement_stage"`
	ExpectedTurnover            string `json:"expected_turnover"`
	Hiring                      string `json:"hiring"`
	ProjectBudget               string `json:"project_budget"`
	PersonalContributionsBudget string `json:"personal_contributions_budget"`
	Status                      string `json:"status"`
	ProjectLaunchValidationRdv  bool   `json:"project_launch_validation_rdv"`
	ExpertStatus                string `json:"expert_status"`
	ProjectFinanceValidationRdv bool   `json:"project_finance_validation_rdv"`
	ProjectName                 string `json:"project_name"`
}

type InvestmentDto struct {
	ID                          string    `json:"id"`
	InvestmentType              string    `json:"investment_type"`
	InvestmentName              string    `json:"investment_name"`
	InvestmentAmountTaxIncluded string    `json:"investment_amount_tax_included"`
	YearOfPurchase              string    `json:"year_of_purchase"`
	MonthOfPurchase             string    `json:"month_of_purchase"`
	Duration                    string    `json:"duration"`
	VatRateOnInvestment         string    `json:"vat_rate_on_investment"`
	Contribution                string    `json:"contribution"`
	CreatedAt                   time.Time `json:"created_at"`
}

type StakeholderDto struct {
	ID           string                          `json:"id"`
	FirstName    string                          `json:"first_name"`
	LastName     string                          `json:"last_name"`
	Role         string                          `json:"role"`
	RoleDetails  string                          `json:"role_details"`
	Status       models.StakeholderAccountStatus `json:"status"`
	ProfileImage string                          `json:"profile_image"`
}

type LoanDto struct {
	ID                      string    `json:"id"`
	LoanName                string    `json:"bank_loan_name"`
	YearOfLoanDisbursement  string    `json:"year_of_loan_disbursement"`
	MonthOfLoanDisbursement string    `json:"month_of_loan_disbursement"`
	LoanRate                string    `json:"loan_rate"`
	LoanDuration            string    `json:"loan_duration"`
	AmountMonthlyPayments   string    `json:"amount_monthly_payments"`
	TypeOfExternalFund      string    `json:"type_of_external_fund"`
	AmountLoan              string    `json:"amount_loan"`
	CreatedAt               time.Time `json:"created_at"`
}

type AssociatesCapitalContributionDto struct {
	ID                                 string    `json:"id"`
	TypeOfOperation                    string    `json:"type_of_operation"`
	YearOfContributionRepayment        string    `json:"year_of_contribution_repayment"`
	MonthOfContributionRepayment       string    `json:"month_of_contribution_repayment"`
	AssociateCapitalContributionAmount string    `json:"associate_capital_contribution_amount"`
	CreatedAt                          time.Time `json:"created_at"`
}

type CapitalContributionDto struct {
	ID                        string    `json:"id"`
	CapitalContributionType   string    `json:"type_capital_contribution"`
	CapitalContributionAmount string    `json:"contribution_amount"`
	YearOfContribution        string    `json:"year_of_contribution"`
	MonthOfContribution       string    `json:"month_of_contribution"`
	CreatedAt                 time.Time `json:"created_at"`
}

type fundingDetailsDto struct {
	Loans                          []LoanDto                          `json:"loans"`
	AssociatesCapitalContributions []AssociatesCapitalContributionDto `json:"associates_capital_contributions"`
	CapitalContributions           []CapitalContributionDto           `json:"capital_Contributions"`
}

type ExpenseDto struct {
	ID                   string    `json:"id"`
	ExpenseLabel         string    `json:"expense_label"`
	AnnualAmountTaxInc1  string    `json:"annual_amount_tax_inc_1"`
	AnnualAmountTaxInc2  string    `json:"annual_amount_tax_inc_2"`
	AnnualAmountTaxInc3  string    `json:"annual_amount_tax_inc_3"`
	ExpenditurePartition string    `form:"expenditure_partition" json:"expenditure_partition"`
	VatRateExpenditure   string    `json:"vat_rate_expenditure"`
	OneTimePaymentYear   string    `json:"one_time_payment_year"`
	OneTimePaymentMonth  string    `json:"one_time_payment_month"`
	ExpenseCategory      string    `json:"expense_category"`
	CreatedAt            time.Time `json:"created_at"`
}

type RevenueDto struct {
	ID                           string           `json:"id"`
	RevenueLabel                 string           `json:"revenue_label"`
	RevenuePartition             string           `json:"revenue_partition"`
	AnnualAmountTaxExcludedYear1 string           `json:"annual_amount_tax_excluded_year_1"`
	AnnualAmountTaxExcludedYear2 string           `json:"annual_amount_tax_excluded_year_2"`
	AnnualAmountTaxExcludedYear3 string           `json:"annual_amount_tax_excluded_year_3"`
	InventoryLinkedRevenue       string           `json:"inventory_linked_revenue"`
	PercentageMargin             string           `json:"percentage_margin"`
	ValuationOfStartingStock     string           `json:"valuation_of_starting_stock"`
	MeanValuationOfStock         string           `json:"mean_valuation_of_stock"`
	VatRateRevenue               string           `json:"vat_rate_revenue"`
	CustomerPaymentDeadline      string           `json:"customer_payment_deadline"`
	SupplierPaymentDeadline      string           `json:"supplier_payment_deadline"`
	VatRateOnPurchases           string           `json:"vat_rate_on_purchases"`
	RevenueYears                 []RevenueYearDto `json:"revenue_years"`
	CreatedAt                    time.Time        `json:"created_at"`
}

type RevenueYearDto struct {
	ID            string `json:"id"`
	Year          string `json:"year"`
	Month1Amount  string `json:"month_1_amount"`
	Month2Amount  string `json:"month_2_amount"`
	Month3Amount  string `json:"month_3_amount"`
	Month4Amount  string `json:"month_4_amount"`
	Month5Amount  string `json:"month_5_amount"`
	Month6Amount  string `json:"month_6_amount"`
	Month7Amount  string `json:"month_7_amount"`
	Month8Amount  string `json:"month_8_amount"`
	Month9Amount  string `json:"month_9_amount"`
	Month10Amount string `json:"month_10_amount"`
	Month11Amount string `json:"month_11_amount"`
	Month12Amount string `json:"month_12_amount"`
}

type RevenueSourceDto struct {
	ID                   string    `json:"id"`
	Name                 string    `json:"name"`
	SourceType           string    `json:"source_type"`
	AmountExcludingTaxes string    `json:"amount_excluding_taxes"`
	Year                 string    `json:"year"`
	Month                string    `json:"month"`
	VatRate              string    `json:"vat_rate"`
	CreatedAt            time.Time `json:"created_at"`
}

type revenueDetailsDto struct {
	Revenue       []RevenueDto       `json:"revenues"`
	RevenueSource []RevenueSourceDto `json:"revenue_sources"`
}

type DirectorDto struct {
	ID                        string                        `json:"id"`
	FirstName                 string                        `json:"first_name"`
	LastName                  string                        `json:"last_name"`
	PercentageEquityCapital   string                        `json:"percentage_equity_capital"`
	DirectorAcre              string                        `json:"director_acre"`
	CompensationPartition     string                        `json:"compensation_partition"`
	NetCompensationYear1      string                        `json:"net_compensation_year_1"`
	NetCompensationYear2      string                        `json:"net_compensation_year_2"`
	NetCompensationYear3      string                        `json:"net_compensation_year_3"`
	CotisationsSocialesYear1  string                        `json:"cotisations_sociales_year_1"`
	CotisationsSocialesYear2  string                        `json:"cotisations_sociales_year_2"`
	CotisationsSocialesYear3  string                        `json:"cotisations_sociales_year_3"`
	ProcessingCotisations     string                        `json:"processing_cotisations"`
	DirectorRenumerationYears []DirectorRenumerationYearDto `json:"director_renumeration_years"`
	DirectorCotisationYears   []DirectorCotisationYearDto   `json:"director_cotisation_years"`
	CreatedAt                 time.Time                     `json:"created_at"`
}

type DirectorCotisationYearDto struct {
	ID                string `json:"id"`
	Year              string `json:"year"`
	Month1Cotisation  string `json:"month_1_cotisation"`
	Month2Cotisation  string `json:"month_2_cotisation"`
	Month3Cotisation  string `json:"month_3_cotisation"`
	Month4Cotisation  string `json:"month_4_cotisation"`
	Month5Cotisation  string `json:"month_5_cotisation"`
	Month6Cotisation  string `json:"month_6_cotisation"`
	Month7Cotisation  string `json:"month_7_cotisation"`
	Month8Cotisation  string `json:"month_8_cotisation"`
	Month9Cotisation  string `json:"month_9_cotisation"`
	Month10Cotisation string `json:"month_10_cotisation"`
	Month11Cotisation string `json:"month_11_cotisation"`
	Month12Cotisation string `json:"month_12_cotisation"`
}

type DirectorRenumerationYearDto struct {
	ID            string `json:"id"`
	Year          string `json:"year"`
	Month1Amount  string `json:"month_1_amount"`
	Month2Amount  string `json:"month_2_amount"`
	Month3Amount  string `json:"month_3_amount"`
	Month4Amount  string `json:"month_4_amount"`
	Month5Amount  string `json:"month_5_amount"`
	Month6Amount  string `json:"month_6_amount"`
	Month7Amount  string `json:"month_7_amount"`
	Month8Amount  string `json:"month_8_amount"`
	Month9Amount  string `json:"month_9_amount"`
	Month10Amount string `json:"month_10_amount"`
	Month11Amount string `json:"month_11_amount"`
	Month12Amount string `json:"month_12_amount"`
}

type EmployeeDto struct {
	ID                       string    `json:"id"`
	Post                     string    `json:"post"`
	SalaryBruteYear1         string    `json:"salary_brute_year_1"`
	SalaryBruteYear2         string    `json:"salary_brute_year_2"`
	SalaryBruteYear3         string    `json:"salary_brute_year_3"`
	ContractType             string    `json:"contract_type"`
	ContractDuration         string    `json:"contract_duration"`
	GrossMonthlyRemuneration string    `json:"gross_monthly_remuneration"`
	YearOfHire               string    `json:"year_of_hire"`
	DateOfHire               string    `json:"date_of_hire"`
	NetMonthlyRemuneration   string    `json:"net_monthly_remuneration"`
	EmployerContributions    string    `json:"employer_contributions"`
	CreatedAt                time.Time `json:"created_at"`
}

type employeeDetailsDto struct {
	Directors []DirectorDto `json:"directors"`
	Employees []EmployeeDto `json:"employees"`
}

type projectFinanceDto struct {
	Revenues    revenueDetailsDto  `json:"revenues"`
	Expenses    []ExpenseDto       `json:"expenses"`
	Employees   employeeDetailsDto `json:"employees"`
	Finances    fundingDetailsDto  `json:"finances"`
	Investments []InvestmentDto    `json:"investments"`
}

type ProjectVerificationDto struct {
	ID        string                            `json:"id"`
	Label     string                            `json:"label"`
	Visible   bool                              `json:"visible"`
	UpdatedAt string                            `json:"updated_at"`
	Questions []ProjectVerificationQuestionsDto `json:"questions"`
}

type ProjectVerificationQuestionsDto struct {
	ID       string `json:"id"`
	Label    string `json:"label"`
	Response string `json:"response"`
}

type ProjectVerificationAggregatedWorkFlowDto struct {
	Employees     employeeDetailsDto       `json:"employees"`
	Finances      fundingDetailsDto        `json:"finances"`
	Verifications []ProjectVerificationDto `json:"verifications"`
}

type ProjectGuideDto struct {
	ID             string                    `json:"id"`
	Label          string                    `json:"label"`
	Status         string                    `json:"status"`
	UpdatedAt      string                    `json:"updated_at"`
	GuideLandmarks []ProjectGuideLandmarkDto `json:"landmarks"`
}

type ProjectGuideLandmarkAchievementDto struct {
	ID     string `json:"id"`
	Label  string `json:"label"`
	Status string `json:"status"`
}

type ProjectGuideLandmarkDto struct {
	ID           string                               `json:"id"`
	Label        string                               `json:"label"`
	Status       string                               `json:"status"`
	Achievements []ProjectGuideLandmarkAchievementDto `json:"achievements"`
}

type ProjectFinanceCapacityDto struct {
	Declarations []string `json:"declarations"`
}

type MicroFormation struct {
	ID       string `json:"id"`
	Title    string `json:"title"`
	Category string `json:"category"`
	Views    int    `json:"views"`
	Likes    int    `json:"likes"`
}

func GetBusinessPlan(projectId string) *BusinessPlanDto {
	return &BusinessPlanDto{
		Project:               Project(projectId),
		ProjectPreparation:    ProjectPreparation(projectId),
		ProjectMarketResearch: ProjectMarketResearch(projectId),
		ProjectStakeholder:    fetchProjectStakeholders(projectId),
		ProjectOwner:          fetchProjectOwner(projectId),
	}
}

func fetchProjectOwner(projectId string) UserDto {
	daoProject := dao.NewProjectDAO()
	project, err := daoProject.GetProjectById(projectId)
	if err != nil {
		return UserDto{}
	}

	daoOwnerProject := dao.NewUserDAO()
	owner, err := daoOwnerProject.GetById(project.UserId)
	if err != nil {
		return UserDto{}
	}
	return User(owner)
}

func ProjectPreparation(projectId string) ProjectPreparationDto {
	dao := dao.NewProjectPreparationDAO()
	pp, err := dao.GetById(projectId)
	if err != nil {
		return ProjectPreparationDto{}
	}
	return ProjectPreparationDto{
		pp.ID,
		pp.NonCompeteClause,
		pp.DomainCompetence,
		pp.ProjectParticipants,
		pp.VerifiedInterestInIdea,
		pp.IsProjectInnovative,
		pp.IsTrademarkProctectionRequired,
		pp.ShortDescriptionIdea,
		pp.WebsiteRequired,
		pp.TechnicalDomainCompetence,
		pp.SalesDomainCompetence,
		pp.ManagementDomainCompetence,
		pp.CurrentEmploymentStatus,
		pp.ContractType,
		pp.TypeContractRupture,
		pp.ProfessionalReconversion,
		pp.RequiresQuitingJob,
		pp.InCompetitionWithCurrentEmployer,
		pp.ExclusivityClause,
	}
}

func ProjectMarketResearch(projectId string) ProjectMarketResearchDto {
	dao := dao.NewProjectMarketResearchDAO()
	pm, err := dao.GetById(projectId)
	if err != nil {
		return ProjectMarketResearchDto{}
	}
	return ProjectMarketResearchDto{
		pm.ID,
		pm.MarketCharacteristics,
		pm.TargetMarket,
		pm.PrincipleCompetition,
		pm.ServiceDescription,
		pm.ProductStrongWeakPoints,
		pm.CommercialProcess,
		pm.TrademarkProtection,
		pm.BusinessPlacement,
		pm.SupplyChain,
		pm.CommunicationStrategy,
	}
}

func ProjectLegalStatus(projectId string) ProjectLegalStatusDto {
	dao := dao.NewProjectLegalStatusDAO()
	pl, err := dao.GetById(projectId)
	if err != nil {
		return ProjectLegalStatusDto{}
	}
	return ProjectLegalStatusDto{
		pl.ID,
		pl.StakeHolders,
		pl.LegalStatusIdea,
		pl.RecommendedLegalStatusIdea,
		pl.ManagementStake,
		pl.TaxSystem,
		pl.PersonalWealthSecurityRequired,
		pl.CompanyTaxPolicy,
		pl.SocialSecurityScheme,
		pl.SituationPoleEmploi,
		pl.LocaleOfChoice,
		pl.PropertyOwner,
		pl.PropertyAdministration,
		pl.DomiciliationCompany,
		pl.ProfessionalLocale,
		pl.LocalisationFinancialAid,
		pl.LeaseLocale,
		pl.VerifiedContractCommercialLeases,
		pl.LocaleActivityCompatability,
		pl.LeaseContractDuration,
		pl.LeaseRentalPriceFairness,
		pl.VerifiedLeasePriceRenegiations,
		pl.VerifiedPayableTentantFees,
		pl.VerifiedInventory,
		pl.CompanyVatRegime,
		pl.CriteriaBasedLegalStatusIdea,
		pl.UserLegalCriteria,
		pl.Associates,
		pl.UserTaxCriteria,
		pl.UserTvaCriteria,
		pl.MicroEntrepriseAccreExemption,
		pl.MicroEntrepriseDeclarePayCotisations,
		pl.MicroEntrepriseActivityCategory,
	}
}

func Project(projectId string) ProjectDto {
	dao := dao.NewProjectDAO()
	p, err := dao.GetProjectById(projectId)
	if err != nil {
		return ProjectDto{}
	}
	hiring := "Non"
	if p.Hiring {
		hiring = "Oui"
	}
	return ProjectDto{
		ID:                          p.ID,
		TypeProject:                 p.TypeProject,
		SearchableAddress:           p.SearchableAddress,
		ActivitySector:              p.ActivitySector,
		ProjectAdvancementStage:     p.ProjectAdvancementStage,
		ExpectedTurnover:            p.ExpectedTurnover,
		Hiring:                      hiring,
		ProjectBudget:               p.ProjectBudget,
		PersonalContributionsBudget: p.PersonalContributionsBudget,
		Status:                      p.Status,
		ProjectLaunchValidationRdv:  p.ProjectLaunchValidationRdv,
		ExpertStatus:                p.ExpertStatus,
		ProjectFinanceValidationRdv: p.ProjectFinanceValidationRdv,
		ProjectName:                 p.Name,
	}
}

func User(user *models.User) UserDto {
	daoPic := dao.NewUserProfileImageDAO()
	pic, err := daoPic.GetByField(user.ID, "user_id")
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return UserDto{}
	}
	return UserDto{
		user.Email,
		user.ID,
		user.FirstName,
		user.LastName,
		user.Telephone,
		pic.PublicUrl,
		user.ReachableByPhone,
	}
}

func Stakeholder(stakeholder *models.ProjectStakeholder) StakeholderDto {
	daoPic := dao.NewStakeholderProfileImageDAO()
	pic, err := daoPic.GetByField(stakeholder.ID, "user_id")
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		return StakeholderDto{}
	}
	return StakeholderDto{
		ID:           stakeholder.ID,
		FirstName:    stakeholder.FirstName,
		LastName:     stakeholder.LastName,
		Role:         stakeholder.Role,
		RoleDetails:  stakeholder.RoleDetails,
		ProfileImage: pic.PublicUrl,
		Status:       stakeholder.Status,
	}
}

func fetchProjectInvestments(id string) []InvestmentDto {
	var investmentsW []InvestmentDto
	dao := dao.NewProjectInvestmentDAO()
	investments := dao.FetchInvestments(id)
	for _, i := range investments {
		s := InvestmentDto{
			ID:                          i.ID,
			InvestmentType:              i.InvestmentType,
			InvestmentName:              i.InvestmentName,
			InvestmentAmountTaxIncluded: i.InvestmentAmountTaxIncluded,
			YearOfPurchase:              i.YearOfPurchase,
			MonthOfPurchase:             i.MonthOfPurchase,
			Duration:                    i.Duration,
			VatRateOnInvestment:         i.VatRateOnInvestment,
			Contribution:                i.Contribution,
			CreatedAt:                   i.CreatedAt,
		}
		investmentsW = append(investmentsW, s)
	}
	return investmentsW
}

func fetchProjectStakeholders(id string) []StakeholderDto {
	var tW []StakeholderDto
	dao := dao.NewProjectStakeholderDAO()
	stakeholders := dao.FetchStakeholders(id)
	for _, i := range stakeholders {
		stakeholderDto := Stakeholder(&i)
		tW = append(tW, stakeholderDto)
	}
	return tW
}

func fetchProjectLoans(id string) []LoanDto {
	var loansW []LoanDto
	dao := dao.NewProjectLoanDAO()
	loans := dao.FetchLoans(id)
	for _, i := range loans {
		s := LoanDto{
			ID:                      i.ID,
			LoanName:                i.LoanName,
			YearOfLoanDisbursement:  i.YearOfLoanDisbursement,
			MonthOfLoanDisbursement: i.MonthOfLoanDisbursement,
			LoanRate:                i.LoanRate,
			LoanDuration:            i.LoanDuration,
			AmountMonthlyPayments:   i.AmountMonthlyPayments,
			TypeOfExternalFund:      i.TypeOfExternalFund,
			AmountLoan:              i.AmountLoan,
			CreatedAt:               i.CreatedAt,
		}
		loansW = append(loansW, s)
	}
	return loansW
}

func fetchProjectAssociatesCapitalContributions(id string) []AssociatesCapitalContributionDto {
	var accW []AssociatesCapitalContributionDto
	dao := dao.NewProjectAssociatesCapitalContributionDAO()
	accs := dao.FetchAssociatesCapitalContributions(id)
	for _, i := range accs {
		s := AssociatesCapitalContributionDto{
			ID:                                 i.ID,
			TypeOfOperation:                    i.TypeOfOperation,
			YearOfContributionRepayment:        i.YearOfContributionRepayment,
			MonthOfContributionRepayment:       i.MonthOfContributionRepayment,
			AssociateCapitalContributionAmount: i.AssociateCapitalContributionAmount,
			CreatedAt:                          i.CreatedAt,
		}
		accW = append(accW, s)
	}
	return accW
}

func fetchProjectCapitalContributions(id string) []CapitalContributionDto {
	var ccW []CapitalContributionDto
	dao := dao.NewProjectCapitalContributionDAO()
	ccs := dao.FetchCapitalContributions(id)
	for _, i := range ccs {
		s := CapitalContributionDto{
			ID:                        i.ID,
			CapitalContributionType:   i.CapitalContributionType,
			CapitalContributionAmount: i.CapitalContributionAmount,
			YearOfContribution:        i.YearOfContribution,
			MonthOfContribution:       i.MonthOfContribution,
			CreatedAt:                 i.CreatedAt,
		}
		ccW = append(ccW, s)
	}
	return ccW
}

func OnFetchFundingDetails(id string) fundingDetailsDto {
	return fundingDetailsDto{
		CapitalContributions:           fetchProjectCapitalContributions(id),
		AssociatesCapitalContributions: fetchProjectAssociatesCapitalContributions(id),
		Loans:                          fetchProjectLoans(id),
	}

}

func fetchProjectExpenses(id string) []ExpenseDto {
	var eW []ExpenseDto
	dao := dao.NewProjectExpenseDAO()
	es := dao.FetchExpenses(id)
	for _, i := range es {
		s := ExpenseDto{
			ID:                   i.ID,
			ExpenseLabel:         i.ExpenseLabel,
			AnnualAmountTaxInc1:  i.AnnualAmountTaxInc1,
			AnnualAmountTaxInc2:  i.AnnualAmountTaxInc2,
			AnnualAmountTaxInc3:  i.AnnualAmountTaxInc3,
			ExpenditurePartition: i.ExpenditurePartition,
			VatRateExpenditure:   i.VatRateExpenditure,
			OneTimePaymentYear:   i.OneTimePaymentYear,
			OneTimePaymentMonth:  i.OneTimePaymentMonth,
			ExpenseCategory:      i.ExpenseCategory,
			CreatedAt:            i.CreatedAt,
		}
		eW = append(eW, s)
	}
	return eW
}

func OnFetchRevenueDetails(id string) revenueDetailsDto {
	return revenueDetailsDto{
		Revenue:       fetchProjectRevenues(id),
		RevenueSource: fetchProjectRevenueSources(id),
	}

}

func fetchProjectRevenueSources(id string) []RevenueSourceDto {
	var eW []RevenueSourceDto
	dao := dao.NewProjectRevenueSourceDAO()
	es := dao.FetchRevenueSources(id)
	for _, i := range es {
		s := RevenueSourceDto{
			ID:                   i.ID,
			Name:                 i.Name,
			SourceType:           i.SourceType,
			AmountExcludingTaxes: i.AmountExcludingTaxes,
			Year:                 i.Year,
			Month:                i.Month,
			VatRate:              i.VatRate,
			CreatedAt:            i.CreatedAt,
		}
		eW = append(eW, s)
	}
	return eW
}

func fetchProjectRevenues(id string) []RevenueDto {
	var rW []RevenueDto
	daoRevenues := dao.NewProjectRevenueDAO()
	daoRevenueYears := dao.NewProjectRevenuesYearDAO()
	revenues := daoRevenues.FetchRevenues(id)
	for _, revenue := range revenues {
		years := daoRevenueYears.FetchRevenuesYears(revenue.ID)
		ry := []RevenueYearDto{}
		for _, year := range years {
			r := RevenueYearDto{
				ID:            year.ID,
				Year:          year.Year,
				Month1Amount:  year.Month1Amount,
				Month2Amount:  year.Month2Amount,
				Month3Amount:  year.Month3Amount,
				Month4Amount:  year.Month4Amount,
				Month5Amount:  year.Month5Amount,
				Month6Amount:  year.Month6Amount,
				Month7Amount:  year.Month7Amount,
				Month8Amount:  year.Month8Amount,
				Month9Amount:  year.Month9Amount,
				Month10Amount: year.Month10Amount,
				Month11Amount: year.Month11Amount,
				Month12Amount: year.Month12Amount,
			}
			ry = append(ry, r)
		}
		s := RevenueDto{
			ID:                           revenue.ID,
			RevenueLabel:                 revenue.RevenueLabel,
			RevenuePartition:             revenue.RevenuePartition,
			AnnualAmountTaxExcludedYear1: revenue.AnnualAmountTaxExcludedYear1,
			AnnualAmountTaxExcludedYear2: revenue.AnnualAmountTaxExcludedYear2,
			AnnualAmountTaxExcludedYear3: revenue.AnnualAmountTaxExcludedYear3,
			InventoryLinkedRevenue:       revenue.InventoryLinkedRevenue,
			PercentageMargin:             revenue.PercentageMargin,
			ValuationOfStartingStock:     revenue.ValuationOfStartingStock,
			MeanValuationOfStock:         revenue.MeanValuationOfStock,
			VatRateRevenue:               revenue.VatRateRevenue,
			CustomerPaymentDeadline:      revenue.CustomerPaymentDeadline,
			SupplierPaymentDeadline:      revenue.SupplierPaymentDeadline,
			VatRateOnPurchases:           revenue.VatRateOnPurchases,
			RevenueYears:                 ry,
			CreatedAt:                    revenue.CreatedAt,
		}
		rW = append(rW, s)
	}
	return rW
}

func OnFetchEmployeeDetails(id string) employeeDetailsDto {
	return employeeDetailsDto{
		Directors: fetchProjectDirectors(id),
		Employees: fetchProjectEmployees(id),
	}

}

func fetchProjectDirectors(id string) []DirectorDto {
	var rW []DirectorDto
	daoDirector := dao.NewProjectDirectorDAO()
	daoDirectorRenumerationYears := dao.NewProjectDirectorRenumerationYearDAO()
	daoDirectorCotisationYears := dao.NewProjectDirectorCotisationYearDAO()
	directors := daoDirector.FetchDirectors(id)
	for _, director := range directors {
		renumerationYears := daoDirectorRenumerationYears.FetchDirectorRenumerationYear(director.ID)
		cotisationYears := daoDirectorCotisationYears.FetchDirectorCotisationYears(director.ID)
		ry := []DirectorRenumerationYearDto{}
		for _, year := range renumerationYears {
			r := DirectorRenumerationYearDto{
				ID:            year.ID,
				Year:          year.Year,
				Month1Amount:  year.Month1Amount,
				Month2Amount:  year.Month2Amount,
				Month3Amount:  year.Month3Amount,
				Month4Amount:  year.Month4Amount,
				Month5Amount:  year.Month5Amount,
				Month6Amount:  year.Month6Amount,
				Month7Amount:  year.Month7Amount,
				Month8Amount:  year.Month8Amount,
				Month9Amount:  year.Month9Amount,
				Month10Amount: year.Month10Amount,
				Month11Amount: year.Month11Amount,
				Month12Amount: year.Month12Amount,
			}
			ry = append(ry, r)
		}
		cYears := []DirectorCotisationYearDto{}
		for _, v := range cotisationYears {
			cotisationY := DirectorCotisationYearDto{
				ID:                v.ID,
				Year:              v.Year,
				Month1Cotisation:  v.Month1Cotisation,
				Month2Cotisation:  v.Month2Cotisation,
				Month3Cotisation:  v.Month3Cotisation,
				Month4Cotisation:  v.Month4Cotisation,
				Month5Cotisation:  v.Month5Cotisation,
				Month6Cotisation:  v.Month6Cotisation,
				Month7Cotisation:  v.Month7Cotisation,
				Month8Cotisation:  v.Month8Cotisation,
				Month9Cotisation:  v.Month9Cotisation,
				Month10Cotisation: v.Month10Cotisation,
				Month11Cotisation: v.Month11Cotisation,
				Month12Cotisation: v.Month12Cotisation,
			}
			cYears = append(cYears, cotisationY)
		}
		s := DirectorDto{
			ID:                        director.ID,
			FirstName:                 director.FirstName,
			LastName:                  director.LastName,
			PercentageEquityCapital:   director.PercentageEquityCapital,
			DirectorAcre:              director.DirectorAcre,
			CompensationPartition:     director.CompensationPartition,
			NetCompensationYear1:      director.NetCompensationYear1,
			NetCompensationYear2:      director.NetCompensationYear2,
			NetCompensationYear3:      director.NetCompensationYear3,
			CotisationsSocialesYear1:  director.CotisationsSocialesYear1,
			CotisationsSocialesYear2:  director.CotisationsSocialesYear2,
			CotisationsSocialesYear3:  director.CotisationsSocialesYear3,
			ProcessingCotisations:     director.ProcessingCotisations,
			DirectorRenumerationYears: ry,
			DirectorCotisationYears:   cYears,
			CreatedAt:                 director.CreatedAt,
		}
		rW = append(rW, s)
	}
	return rW
}

func fetchProjectDirector(director *models.ProjectDirector) DirectorDto {
	daoDirectorRenumerationYears := dao.NewProjectDirectorRenumerationYearDAO()
	daoDirectorCotisationYears := dao.NewProjectDirectorCotisationYearDAO()
	renumerationYears := daoDirectorRenumerationYears.FetchDirectorRenumerationYear(director.ID)
	cotisationYears := daoDirectorCotisationYears.FetchDirectorCotisationYears(director.ID)
	ry := []DirectorRenumerationYearDto{}
	for _, year := range renumerationYears {
		r := DirectorRenumerationYearDto{
			ID:            year.ID,
			Year:          year.Year,
			Month1Amount:  year.Month1Amount,
			Month2Amount:  year.Month2Amount,
			Month3Amount:  year.Month3Amount,
			Month4Amount:  year.Month4Amount,
			Month5Amount:  year.Month5Amount,
			Month6Amount:  year.Month6Amount,
			Month7Amount:  year.Month7Amount,
			Month8Amount:  year.Month8Amount,
			Month9Amount:  year.Month9Amount,
			Month10Amount: year.Month10Amount,
			Month11Amount: year.Month11Amount,
			Month12Amount: year.Month12Amount,
		}
		ry = append(ry, r)
	}
	cYears := []DirectorCotisationYearDto{}
	for _, v := range cotisationYears {
		cotisationY := DirectorCotisationYearDto{
			ID:                v.ID,
			Year:              v.Year,
			Month1Cotisation:  v.Month1Cotisation,
			Month2Cotisation:  v.Month2Cotisation,
			Month3Cotisation:  v.Month3Cotisation,
			Month4Cotisation:  v.Month4Cotisation,
			Month5Cotisation:  v.Month5Cotisation,
			Month6Cotisation:  v.Month6Cotisation,
			Month7Cotisation:  v.Month7Cotisation,
			Month8Cotisation:  v.Month8Cotisation,
			Month9Cotisation:  v.Month9Cotisation,
			Month10Cotisation: v.Month10Cotisation,
			Month11Cotisation: v.Month11Cotisation,
			Month12Cotisation: v.Month12Cotisation,
		}
		cYears = append(cYears, cotisationY)
	}
	return DirectorDto{
		ID:                        director.ID,
		FirstName:                 director.FirstName,
		LastName:                  director.LastName,
		PercentageEquityCapital:   director.PercentageEquityCapital,
		DirectorAcre:              director.DirectorAcre,
		CompensationPartition:     director.CompensationPartition,
		NetCompensationYear1:      director.NetCompensationYear1,
		NetCompensationYear2:      director.NetCompensationYear2,
		NetCompensationYear3:      director.NetCompensationYear3,
		CotisationsSocialesYear1:  director.CotisationsSocialesYear1,
		CotisationsSocialesYear2:  director.CotisationsSocialesYear2,
		CotisationsSocialesYear3:  director.CotisationsSocialesYear3,
		ProcessingCotisations:     director.ProcessingCotisations,
		DirectorRenumerationYears: ry,
		DirectorCotisationYears:   cYears,
		CreatedAt:                 director.CreatedAt,
	}
}

func fetchProjectEmployees(id string) []EmployeeDto {
	var eW []EmployeeDto
	dao := dao.NewProjectEmployeeDAO()
	es := dao.FetchEmployees(id)
	for _, i := range es {
		s := EmployeeDto{
			ID:                       i.ID,
			Post:                     i.Post,
			SalaryBruteYear1:         i.SalaryBruteYear1,
			SalaryBruteYear2:         i.SalaryBruteYear2,
			SalaryBruteYear3:         i.SalaryBruteYear3,
			ContractType:             i.ContractType,
			ContractDuration:         i.ContractDuration,
			GrossMonthlyRemuneration: i.GrossMonthlyRemuneration,
			YearOfHire:               i.YearOfHire,
			DateOfHire:               i.DateOfHire,
			NetMonthlyRemuneration:   i.NetMonthlyRemuneration,
			EmployerContributions:    i.EmployerContributions,
			CreatedAt:                i.CreatedAt,
		}
		eW = append(eW, s)
	}
	return eW
}

func OnFetchFinancialDetails(projectId string) projectFinanceDto {

	return projectFinanceDto{
		Employees:   OnFetchEmployeeDetails(projectId),
		Expenses:    fetchProjectExpenses(projectId),
		Investments: fetchProjectInvestments(projectId),
		Finances:    OnFetchFundingDetails(projectId),
		Revenues:    OnFetchRevenueDetails(projectId),
	}
}

func fetchProjectVerifications(id string) []ProjectVerificationDto {
	var rW []ProjectVerificationDto
	daoVerification := dao.NewProjectVerificationDAO()
	daoVerificationQuestion := dao.NewProjectVerificationQuestionDAO()
	verifications := daoVerification.FetchProjectVerifications(id)
	for _, verification := range verifications {
		questions := daoVerificationQuestion.FetchProjectVerificationQuestions(verification.ID)
		ry := []ProjectVerificationQuestionsDto{}
		for _, question := range questions {
			r := ProjectVerificationQuestionsDto{
				ID:       question.ID,
				Label:    question.Label,
				Response: question.Response,
			}
			ry = append(ry, r)
		}
		s := ProjectVerificationDto{
			ID:        verification.ID,
			Label:     verification.Label,
			Visible:   verification.Visible,
			UpdatedAt: verification.UpdatedAt.String(),
			Questions: ry,
		}
		rW = append(rW, s)
	}
	return rW
}

func fetchProjectVerification(p *models.ProjectVerification) *ProjectVerificationDto {
	daoVerificationQuestion := dao.NewProjectVerificationQuestionDAO()
	questions := daoVerificationQuestion.FetchProjectVerificationQuestions(p.ID)
	ry := []ProjectVerificationQuestionsDto{}
	for _, question := range questions {
		r := ProjectVerificationQuestionsDto{
			ID:       question.ID,
			Label:    question.Label,
			Response: question.Response,
		}
		ry = append(ry, r)
	}
	rW := ProjectVerificationDto{
		ID:        p.ID,
		Label:     p.Label,
		Visible:   p.Visible,
		UpdatedAt: p.UpdatedAt.String(),
		Questions: ry,
	}
	return &rW
}

func fetchProjectVerificationAggregatedWorkFlowDto(projectId string) *ProjectVerificationAggregatedWorkFlowDto {
	return &ProjectVerificationAggregatedWorkFlowDto{
		Employees:     OnFetchEmployeeDetails(projectId),
		Finances:      OnFetchFundingDetails(projectId),
		Verifications: fetchProjectVerifications(projectId),
	}
}

func fetchProjectFinanceCapacity(id string) ProjectFinanceCapacityDto {
	dao := dao.NewProjectFinanceCapacityDAO()
	p, err := dao.GetById(id)
	if err != nil {
		return ProjectFinanceCapacityDto{}
	}
	return ProjectFinanceCapacityDto{
		Declarations: p.Declarations,
	}
}

func getMicroFormations(formationId string) MicroFormation {
	views := microFormationViews(formationId)
	likes := microFormationPopularity(formationId)
	return MicroFormation{
		ID:    formationId,
		Views: views,
		Likes: likes,
	}
}

func microFormationViews(formationId string) int {
	userDao := dao.NewMicroFormationViewCountDAO()
	stakeholderDao := dao.NewMicroFormationViewCountStakeholderDAO()
	views := userDao.FetchMicroFormationViewCounts(formationId) + stakeholderDao.FetchMicroFormationViewCounts(formationId)
	return views
}

func microFormationPopularity(formationId string) int {
	userDao := dao.NewMicroFormationViewPopularityDAO()
	stakeholderDao := dao.NewMicroFormationViewPopularityStakeholderDAO()
	likes := userDao.FetchMicroFormationViewPopularity(formationId) + stakeholderDao.FetchMicroFormationViewPopularity(formationId)
	return likes
}
