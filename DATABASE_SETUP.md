# Database Configuration Guide

This project now supports separate databases for production and testing environments.

## Database Setup

### Production Database
- **Container**: `app_database_prod`
- **Database**: `ngtodo`
- **Port**: `5440`
- **User**: `todo`
- **Password**: `todoPWD`

### Test Database
- **Container**: `app_database_test`  
- **Database**: `laura`
- **Port**: `5441`
- **User**: `todo`
- **Password**: `todoPWD`

## Running the Application

### Development Mode
```bash
# Start production database and backend/frontend
docker compose up -d

# Start development services with live reloading
docker compose --profile dev up -d
```

### Testing Mode
```bash
# Start test database only
docker compose --profile test up db-test -d

# Or use the dedicated test compose file
docker compose -f docker-compose.test.yml up -d

# Run tests
cd back
npm run test
npm run test:integration
```

### Production Deployment
```bash
# Production deployment with pre-built images
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Environment Files

### `.env` (Production)
```
DB_HOST=db
DB_NAME=ngtodo
DB_USER=todo
DB_PWD=todoPWD
DB_PORT=5432
NODE_ENV=production
PORT=3000
```

### `.env.test` (Testing)
```
DB_HOST=localhost
DB_NAME=laura
DB_USER=todo
DB_PWD=todoPWD
DB_PORT=5441
NODE_ENV=test
PORT=3001
```

## CI/CD Workflow

The backend workflow now:
1. Spins up a test PostgreSQL database on port 5441
2. Uses proper environment variables for test configuration
3. Runs migrations against the test database
4. Executes unit and integration tests

The deploy workflow:
1. Builds and pushes Docker images
2. Deploys using production configuration with pre-built images
3. Uses the production database configuration
