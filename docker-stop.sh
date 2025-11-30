#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Stopping Docker Containers${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Determine docker compose command
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

cd "$SCRIPT_DIR"

# Stop containers
$DOCKER_COMPOSE down

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ All containers stopped${NC}\n"
    
    # Ask about removing volumes
    read -p "Do you want to remove database volumes (will delete all data)? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        $DOCKER_COMPOSE down -v
        echo -e "${YELLOW}✓ Volumes removed${NC}"
    fi
else
    echo -e "${RED}Failed to stop containers!${NC}"
    exit 1
fi
