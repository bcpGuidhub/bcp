CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE TABLE IF NOT EXISTS project_address (
	project_id uuid NOT NULL,
  postal_code VARCHAR (5) ,
  city TEXT ,
  address TEXT ,
  geographical_area  geometry,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_id),
  FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
);

