CREATE ROLE app_user WITH LOGIN PASSWORD 'app_password';

CREATE DATABASE app_db_test
    WITH OWNER = app_user
    ENCODING = 'UTF8'
    TEMPLATE = template0;
