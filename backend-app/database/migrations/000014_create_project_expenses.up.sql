CREATE TABLE IF NOT EXISTS project_expenses(
  project_expenses_id uuid DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,
  expense_label TEXT,
  annual_amount_tax_inc_1 TEXT,
	annual_amount_tax_inc_2 TEXT,
  annual_amount_tax_inc_3 TEXT,
	expenditure_partition TEXT,
	vat_rate_expenditure TEXT,
	one_time_payment_year TEXT,
	one_time_payment_month TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_expenses_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

