# Real Estate Marketplace - Docker Deployment

This project can be run using Docker for easy deployment and isolation.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (2.0+)

## Quick Start with Docker

### 1. Start All Services

```bash
chmod +x docker-start.sh
./docker-start.sh
```

This will:
- Build Docker images for backend and frontend
- Start PostgreSQL database with initialization script
- Start backend API on port 3000
- Start frontend on port 5173

### 2. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432 (postgres/postgres)

### 3. Stop All Services

```bash
chmod +x docker-stop.sh
./docker-stop.sh
```

## Docker Commands

### View Container Status
```bash
docker-compose ps
```

### View Logs
```bash
# All containers
docker-compose logs -f

# Specific container
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild Containers
```bash
docker-compose up -d --build
```

### Access Database
```bash
docker exec -it real-estate-db psql -U postgres -d postgres
```

### Execute Commands in Containers
```bash
# Backend shell
docker exec -it real-estate-backend sh

# Frontend shell
docker exec -it real-estate-frontend sh
```

## Environment Variables

Backend environment variables are configured in `docker-compose.yml`:
- `DB_HOST=postgres`
- `DB_PORT=5432`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=postgres`
- `DB_DATABASE=postgres`

Frontend environment variables:
- `VITE_API_URL=http://localhost:3000`

## Volumes

- **postgres_data**: Persistent database storage
- Application code is mounted as volumes for development

## Network

All containers run on the `real-estate-network` bridge network, allowing them to communicate using container names.

## Troubleshooting

### Containers won't start
```bash
# Check logs
docker-compose logs

# Rebuild images
docker-compose build --no-cache
docker-compose up -d
```

### Database connection issues
```bash
# Check if database is ready
docker exec real-estate-db pg_isready -U postgres

# Restart database
docker-compose restart postgres
```

### Port conflicts
If ports are already in use, modify them in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Backend
  - "5174:5173"  # Frontend
  - "5433:5432"  # Database
```

## Production Deployment

For production, consider:
1. Using environment-specific `.env` files
2. Setting up proper secrets management
3. Configuring reverse proxy (nginx)
4. Enabling HTTPS
5. Setting resource limits
6. Implementing health checks

Example production command:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```
