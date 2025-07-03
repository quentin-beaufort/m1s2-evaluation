-- Test database initialization script
-- This script is designed to work for both production and test databases

-- The database and user are created automatically by Docker environment variables
-- POSTGRES_DB and POSTGRES_USER, so we don't need to create them manually

-- For production: POSTGRES_DB=ngtodo, POSTGRES_USER=todo
-- For test: POSTGRES_DB=laura, POSTGRES_USER=todo

-- Just ensure the user has proper permissions
-- This will work regardless of which database we're in
