# Docker Compose Setup

This Docker Compose configuration provides a complete development and production environment for your application.

## Services

- **db**: PostgreSQL 15 database (port 5440 → 5432)
- **backend**: Node.js/Express API server (port 3000)
- **frontend**: Angular application served with Nginx (port 4200)
- **backend-dev**: Development version of the backend with hot reload (port 3001)
- **frontend-dev**: Development version of the frontend with hot reload (port 4201)

## Quick Start

### Production Mode

1. Build and start all services:
```bash
docker-compose up --build
```

2. Access the application:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000
   - Database: localhost:5440 (external port) → 5432 (container port)

### Development Mode

1. Start development services with profiles:
```bash
docker-compose --profile dev up --build
```

2. Access the development application:
   - Frontend Dev: http://localhost:4201
   - Backend Dev: http://localhost:3001
   - Database: localhost:5440 (external port) → 5432 (container port)

## Environment Variables

Copy the `.env.example` file to `.env` in the `back` directory and adjust the values as needed:

```bash
cp back/.env.example back/.env
```

## Useful Commands

### Start services in background
```bash
docker-compose up -d
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Stop services
```bash
docker-compose down
```

### Stop services and remove volumes (⚠️ This will delete database data)
```bash
docker-compose down -v
```

### Rebuild specific service
```bash
docker-compose build backend
docker-compose up -d backend
```

### Execute commands in running containers
```bash
# Access backend container
docker-compose exec backend sh

# Access database
docker-compose exec db psql -U app_user -d app_db
```

### Database Management

The PostgreSQL database data is persisted in a Docker volume. To reset the database:

1. Stop the services: `docker-compose down`
2. Remove the volume: `docker volume rm m1s2-evaluation_postgres_data`
3. Start again: `docker-compose up`

## Network

All services communicate through the `app_network` bridge network. Services can communicate using their service names:
- Backend connects to database using hostname: `db`
- Frontend API calls are proxied to backend using hostname: `backend`

## Health Checks

- Database: Checks PostgreSQL readiness
- Backend: Has a health check endpoint at `/health`

## Database Configuration ✅

The PostgreSQL database has been configured with custom settings:

### Database Details
- **Database Name**: `ngtodo`
- **Username**: `todo`
- **Password**: `todoPWD`
- **External Port**: `5440` (mapped to internal port 5432)
- **Encoding**: UTF8
- **Template**: template0 (default)
- **Owner**: `todo`

### Database Schema
The database includes a `membres` table with the following structure:
- `id` (SERIAL PRIMARY KEY)
- `firstName` (VARCHAR(255) NOT NULL)
- `lastName` (VARCHAR(255) NOT NULL)
- `email` (VARCHAR(255) UNIQUE NOT NULL)

### Remote Database Access
You can connect to the database remotely using:
- **Host**: localhost
- **Port**: 5440
- **Database**: ngtodo
- **Username**: todo
- **Password**: todoPWD

Example connection from Docker container:
```bash
docker exec -it app_database psql -U todo -d ngtodo
```

## Verification Status ✅

All components have been tested and verified:
- ✅ Database connection established
- ✅ Database `ngtodo` created with UTF8 encoding
- ✅ User `todo` created with proper privileges
- ✅ Table `membres` created with correct schema
- ✅ External port 5440 accessible from host
- ✅ Backend health endpoint responding (http://localhost:3000/health)
- ✅ Frontend serving Angular application (http://localhost:4200)
- ✅ All containers healthy and running

## Production Considerations

1. Update Node.js base image to address security vulnerabilities
2. Set strong passwords for database (currently using custom password)
3. Configure proper environment variables
4. Use secrets management for sensitive data
5. Set up SSL/TLS certificates
6. Configure proper logging and monitoring
