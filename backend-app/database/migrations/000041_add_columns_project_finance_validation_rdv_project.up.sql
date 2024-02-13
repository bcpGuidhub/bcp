ALTER TABLE projects
ADD COLUMN project_finance_validation_rdv BOOLEAN DEFAULT false,
ADD COLUMN project_finance_validation_rdv_date TIMESTAMP;

