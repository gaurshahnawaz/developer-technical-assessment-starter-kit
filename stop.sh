#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Real Estate Marketplace - Shutdown${NC}"
echo -e "${BLUE}========================================${NC}\n"

STOPPED=0

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Stop backend
echo -e "${YELLOW}Stopping Backend...${NC}"
if [ -f /tmp/backend.pid ]; then
    BACKEND_PID=$(cat /tmp/backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo -e "${GREEN}✓ Backend stopped (PID: $BACKEND_PID)${NC}"
        rm /tmp/backend.pid
        STOPPED=$((STOPPED + 1))
    else
        echo -e "${YELLOW}Backend process not found${NC}"
        rm /tmp/backend.pid
    fi
else
    # Try to kill by port
    BACKEND_PID=$(lsof -ti:3000)
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID
        echo -e "${GREEN}✓ Backend stopped (PID: $BACKEND_PID)${NC}"
        STOPPED=$((STOPPED + 1))
    else
        echo -e "${YELLOW}Backend not running${NC}"
    fi
fi

# Stop frontend
echo -e "${YELLOW}Stopping Frontend...${NC}"
if [ -f /tmp/frontend.pid ]; then
    FRONTEND_PID=$(cat /tmp/frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo -e "${GREEN}✓ Frontend stopped (PID: $FRONTEND_PID)${NC}"
        rm /tmp/frontend.pid
        STOPPED=$((STOPPED + 1))
    else
        echo -e "${YELLOW}Frontend process not found${NC}"
        rm /tmp/frontend.pid
    fi
else
    # Try to kill by port
    FRONTEND_PID=$(lsof -ti:5173)
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID
        echo -e "${GREEN}✓ Frontend stopped (PID: $FRONTEND_PID)${NC}"
        STOPPED=$((STOPPED + 1))
    else
        echo -e "${YELLOW}Frontend not running${NC}"
    fi
fi

# Clean up log files
if [ -f /tmp/backend.log ]; then
    rm /tmp/backend.log
fi
if [ -f /tmp/frontend.log ]; then
    rm /tmp/frontend.log
fi

# Ask about stopping database (optional)
echo ""
read -p "Do you want to stop the PostgreSQL Docker container? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if docker ps --format '{{.Names}}' | grep -q 'db' 2>/dev/null; then
        echo -e "${YELLOW}Stopping PostgreSQL container...${NC}"
        cd "$SCRIPT_DIR/.devcontainer"
        docker-compose stop db
        echo -e "${GREEN}✓ PostgreSQL container stopped${NC}"
    else
        echo -e "${YELLOW}PostgreSQL container not running${NC}"
    fi
fi

echo ""
if [ $STOPPED -gt 0 ]; then
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Application Stopped Successfully!${NC}"
    echo -e "${GREEN}========================================${NC}\n"
else
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}  No running processes found${NC}"
    echo -e "${YELLOW}========================================${NC}\n"
fi
