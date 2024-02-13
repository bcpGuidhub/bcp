CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users(
   user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
   email VARCHAR (300) UNIQUE NOT NULL,
   first_name VARCHAR (50) NOT NULL,
   last_name VARCHAR (50) NOT NULL,
   telephone VARCHAR (10) UNIQUE NOT NULL,
   created_at TIMESTAMP DEFAULT NOW(),
   updated_at TIMESTAMP,
   deleted_at TIMESTAMP,
   password TEXT,
   otp TEXT,
   phone_validation_otp TEXT,
   reachable_by_phone BOOLEAN,
   rgdp_consent BOOLEAN NOT NULL DEFAULT FALSE,
   log_in_count INTEGER DEFAULT 0
);
