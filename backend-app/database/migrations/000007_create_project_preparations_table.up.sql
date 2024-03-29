CREATE TABLE IF NOT EXISTS project_preparations(
  project_id uuid NOT NULL,
  non_compete_clause TEXT,
  domain_competence TEXT,
  project_participants TEXT,
  verified_interest_in_idea TEXT,
  is_project_innovative TEXT,
  is_trademark_proctection_required TEXT,
	requires_quiting_job TEXT,
	in_competition_with_current_employer TEXT,
	exclusivity_clause TEXT,
  short_description_idea TEXT,
  website_required TEXT,
  technical_domain_competence TEXT,
  sales_domain_competence TEXT,
  management_domain_competence TEXT,
  current_employment_status TEXT,
  contract_type TEXT,
  type_contract_rupture TEXT,
  professional_reconversion TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_id),
  CONSTRAINT fk_project_id FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
);
