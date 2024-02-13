package interactors

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/dao"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/models"
	response "gitlab.com/le-coin-des-entrepreneurs/backend-app/response_objects"
	"gitlab.com/le-coin-des-entrepreneurs/backend-app/services"
)

type projectRevenueDeletePayload struct {
	Id string `form:"id" json:"id" binding:"required"`
}
type projectRevenueEditPayload struct {
	Id                           string                            `form:"id" json:"id" binding:"required"`
	RevenueLabel                 string                            `form:"revenue_label" json:"revenue_label"`
	RevenuePartition             string                            `form:"revenue_partition" json:"revenue_partition"`
	AnnualAmountTaxExcludedYear1 string                            `form:"annual_amount_tax_excluded_year_1" json:"annual_amount_tax_excluded_year_1"`
	AnnualAmountTaxExcludedYear2 string                            `form:"annual_amount_tax_excluded_year_2" json:"annual_amount_tax_excluded_year_2"`
	AnnualAmountTaxExcludedYear3 string                            `form:"annual_amount_tax_excluded_year_3" json:"annual_amount_tax_excluded_year_3"`
	InventoryLinkedRevenue       string                            `form:"inventory_linked_revenue" json:"inventory_linked_revenue"`
	PercentageMargin             string                            `form:"percentage_margin" json:"percentage_margin"`
	ValuationOfStartingStock     string                            `form:"valuation_of_starting_stock" json:"valuation_of_starting_stock"`
	MeanValuationOfStock         string                            `form:"mean_valuation_of_stock" json:"mean_valuation_of_stock"`
	VatRateRevenue               string                            `form:"vat_rate_revenue" json:"vat_rate_revenue"`
	CustomerPaymentDeadline      string                            `form:"customer_payment_deadline" json:"customer_payment_deadline"`
	SupplierPaymentDeadline      string                            `form:"supplier_payment_deadline" json:"supplier_payment_deadline"`
	VatRateOnPurchases           string                            `form:"vat_rate_on_purchases" json:"vat_rate_on_purchases"`
	RevenueYears                 []projectRevenuesYearsEditPayload `form:"revenue_years" json:"revenue_years"`
}
type projectRevenuesYearsEditPayload struct {
	Id            string `form:"id" json:"id"`
	Year          string `form:"year" json:"year"`
	Month1Amount  string `form:"month_1_amount" json:"month_1_amount"`
	Month2Amount  string `form:"month_2_amount" json:"month_2_amount"`
	Month3Amount  string `form:"month_3_amount" json:"month_3_amount"`
	Month4Amount  string `form:"month_4_amount" json:"month_4_amount"`
	Month5Amount  string `form:"month_5_amount" json:"month_5_amount"`
	Month6Amount  string `form:"month_6_amount" json:"month_6_amount"`
	Month7Amount  string `form:"month_7_amount" json:"month_7_amount"`
	Month8Amount  string `form:"month_8_amount" json:"month_8_amount"`
	Month9Amount  string `form:"month_9_amount" json:"month_9_amount"`
	Month10Amount string `form:"month_10_amount" json:"month_10_amount"`
	Month11Amount string `form:"month_11_amount" json:"month_11_amount"`
	Month12Amount string `form:"month_12_amount" json:"month_12_amount"`
}
type projectRevenuesYearsCreationPayload struct {
	Year          string `form:"year" json:"year"`
	Month1Amount  string `form:"month_1_amount" json:"month_1_amount"`
	Month2Amount  string `form:"month_2_amount" json:"month_2_amount"`
	Month3Amount  string `form:"month_3_amount" json:"month_3_amount"`
	Month4Amount  string `form:"month_4_amount" json:"month_4_amount"`
	Month5Amount  string `form:"month_5_amount" json:"month_5_amount"`
	Month6Amount  string `form:"month_6_amount" json:"month_6_amount"`
	Month7Amount  string `form:"month_7_amount" json:"month_7_amount"`
	Month8Amount  string `form:"month_8_amount" json:"month_8_amount"`
	Month9Amount  string `form:"month_9_amount" json:"month_9_amount"`
	Month10Amount string `form:"month_10_amount" json:"month_10_amount"`
	Month11Amount string `form:"month_11_amount" json:"month_11_amount"`
	Month12Amount string `form:"month_12_amount" json:"month_12_amount"`
}
type projectRevenueCreationPayload struct {
	RevenueLabel                 string                                `form:"revenue_label" json:"revenue_label" binding:"required"`
	RevenuePartition             string                                `form:"revenue_partition" json:"revenue_partition" binding:"required"`
	AnnualAmountTaxExcludedYear1 string                                `form:"annual_amount_tax_excluded_year_1" json:"annual_amount_tax_excluded_year_1" binding:"required"`
	AnnualAmountTaxExcludedYear2 string                                `form:"annual_amount_tax_excluded_year_2" json:"annual_amount_tax_excluded_year_2" binding:"required"`
	AnnualAmountTaxExcludedYear3 string                                `form:"annual_amount_tax_excluded_year_3" json:"annual_amount_tax_excluded_year_3" binding:"required"`
	InventoryLinkedRevenue       string                                `form:"inventory_linked_revenue" json:"inventory_linked_revenue" binding:"required"`
	PercentageMargin             string                                `form:"percentage_margin" json:"percentage_margin"`
	ValuationOfStartingStock     string                                `form:"valuation_of_starting_stock" json:"valuation_of_starting_stock"`
	MeanValuationOfStock         string                                `form:"mean_valuation_of_stock" json:"mean_valuation_of_stock"`
	VatRateRevenue               string                                `form:"vat_rate_revenue" json:"vat_rate_revenue" binding:"required"`
	CustomerPaymentDeadline      string                                `form:"customer_payment_deadline" json:"customer_payment_deadline" binding:"required"`
	SupplierPaymentDeadline      string                                `form:"supplier_payment_deadline" json:"supplier_payment_deadline"`
	VatRateOnPurchases           string                                `form:"vat_rate_on_purchases" json:"vat_rate_on_purchases"`
	RevenueYears                 []projectRevenuesYearsCreationPayload `form:"revenue_years" json:"revenue_years"`
}

func CreateProjectRevenue(c *gin.Context) {
	projectId := c.Param("id")

	var p projectRevenueCreationPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pI := models.ProjectRevenue{
		ProjectId:                    projectId,
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
	dao := dao.NewProjectRevenueDAO()
	svc := services.NewProjectRevenueService(dao)
	years := []*models.ProjectRevenuesYear{}
	for _, v := range p.RevenueYears {
		ry := models.ProjectRevenuesYear{
			Year:          v.Year,
			Month1Amount:  v.Month1Amount,
			Month2Amount:  v.Month2Amount,
			Month3Amount:  v.Month3Amount,
			Month4Amount:  v.Month4Amount,
			Month5Amount:  v.Month5Amount,
			Month6Amount:  v.Month6Amount,
			Month7Amount:  v.Month7Amount,
			Month8Amount:  v.Month8Amount,
			Month9Amount:  v.Month9Amount,
			Month10Amount: v.Month10Amount,
			Month11Amount: v.Month11Amount,
			Month12Amount: v.Month12Amount,
		}
		years = append(years, &ry)
	}
	i, err := svc.CreateProjectRevenue(&pI, years)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, response.OnCreateRevenue(&i))
}

func FetchProjectRevenues(c *gin.Context) {
	projectId := c.Param("id")

	c.JSON(200, response.FetchProjectRevenues(projectId))
}

func EditProjectRevenue(c *gin.Context) {
	projectId := c.Param("id")

	var p projectRevenueEditPayload
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectRevenueDAO()
	svc := services.NewProjectRevenueService(dao)
	pI := models.ProjectRevenue{
		ID:                           p.Id,
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
	years := []*models.ProjectRevenuesYear{}
	for _, v := range p.RevenueYears {
		ry := models.ProjectRevenuesYear{
			ID:            v.Id,
			Year:          v.Year,
			Month1Amount:  v.Month1Amount,
			Month2Amount:  v.Month2Amount,
			Month3Amount:  v.Month3Amount,
			Month4Amount:  v.Month4Amount,
			Month5Amount:  v.Month5Amount,
			Month6Amount:  v.Month6Amount,
			Month7Amount:  v.Month7Amount,
			Month8Amount:  v.Month8Amount,
			Month9Amount:  v.Month9Amount,
			Month10Amount: v.Month10Amount,
			Month11Amount: v.Month11Amount,
			Month12Amount: v.Month12Amount,
		}
		years = append(years, &ry)
	}
	_, err := svc.EditProjectRevenue(&pI, years)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.FetchProjectRevenues(projectId))
}

func DeleteProjectRevenue(c *gin.Context) {
	projectId := c.Param("id")

	var i projectRevenueDeletePayload
	if err := c.ShouldBindJSON(&i); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dao := dao.NewProjectRevenueDAO()
	svc := services.NewProjectRevenueService(dao)
	p := models.ProjectRevenue{
		ID: i.Id,
	}
	if err := svc.DeleteRevenue(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, response.FetchProjectRevenues(projectId))
}
