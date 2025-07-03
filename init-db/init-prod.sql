-- Production database initialization script  
-- This script runs when the PostgreSQL container starts for the first time

-- The database 'ngtodo' and user 'todo' are created automatically by Docker
-- using the POSTGRES_DB and POSTGRES_USER environment variables

-- This script is shared between production and test databases
-- Both will run this script, but the databases are created separately by Docker

-- Set up any additional configuration here if needed
-- For now, we'll let the application handle table creation through migrations
