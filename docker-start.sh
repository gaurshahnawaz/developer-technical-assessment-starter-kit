#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Real Estate Marketplace - Docker${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed!${NC}"
    echo -e "${YELLOW}Please install Docker from https://docs.docker.com/get-docker/${NC}"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed!${NC}"
    echo -e "${YELLOW}Please install Docker Compose from https://docs.docker.com/compose/install/${NC}"
    exit 1
fi

# Determine docker compose command
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

cd "$SCRIPT_DIR"

echo -e "${BLUE}Starting application with Docker Compose...${NC}\n"

# Build and start containers
$DOCKER_COMPOSE up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Application Started Successfully!${NC}"
    echo -e "${GREEN}========================================${NC}\n"
    echo -e "${BLUE}Database:${NC}     PostgreSQL on localhost:5432"
    echo -e "${BLUE}Backend API:${NC}  http://localhost:3000"
    echo -e "${BLUE}Frontend:${NC}     http://localhost:5173"
    echo -e "\n${YELLOW}Docker Commands:${NC}"
    echo -e "  View logs:     $DOCKER_COMPOSE logs -f"
    echo -e "  Stop:          $DOCKER_COMPOSE down"
    echo -e "  Restart:       $DOCKER_COMPOSE restart"
    echo -e "  View status:   $DOCKER_COMPOSE ps"
    echo -e "\n${YELLOW}Database Access:${NC}"
    echo -e "  docker exec -it real-estate-db psql -U postgres -d postgres"
    echo -e "\n${YELLOW}Container Logs:${NC}"
    echo -e "  Backend:  $DOCKER_COMPOSE logs -f backend"
    echo -e "  Frontend: $DOCKER_COMPOSE logs -f frontend"
    echo -e "  Database: $DOCKER_COMPOSE logs -f postgres\n"
else
    echo -e "${RED}Failed to start containers!${NC}"
    echo -e "${YELLOW}Check logs with: $DOCKER_COMPOSE logs${NC}"
    exit 1
fi
