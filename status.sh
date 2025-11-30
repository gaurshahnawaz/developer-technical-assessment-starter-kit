#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Real Estate Marketplace - Status${NC}"
echo -e "${BLUE}========================================${NC}\n"

RUNNING_COUNT=0

# Check Database
echo -e "${BLUE}PostgreSQL Database (Port 5432):${NC}"
if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓ Running and Ready${NC}"
    echo -e "  ${BLUE}Connection:${NC} psql -h localhost -U postgres -d postgres"
    RUNNING_COUNT=$((RUNNING_COUNT + 1))
    
    # Check if initialized
    TABLE_COUNT=$(psql -h localhost -U postgres -d postgres -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';" 2>/dev/null || echo "0")
    if [ "$TABLE_COUNT" -gt 0 ]; then
        echo -e "  ${GREEN}✓ Database Initialized${NC} ($TABLE_COUNT tables)"
    else
        echo -e "  ${YELLOW}⚠ Database Not Initialized${NC}"
    fi
else
    echo -e "  ${RED}✗ Not Running${NC}"
    # Check Docker container
    if docker ps --format '{{.Names}}' | grep -q 'db' 2>/dev/null; then
        echo -e "  ${YELLOW}⚠ Docker container running but not accessible${NC}"
    fi
fi

echo ""

# Check Backend
# Check Backend
echo -e "${BLUE}Backend (Port 3000):${NC}"
BACKEND_PID=$(lsof -ti:3000)
if [ ! -z "$BACKEND_PID" ]; then
    echo -e "  ${GREEN}✓ Running${NC} (PID: $BACKEND_PID)"
    echo -e "  ${BLUE}URL:${NC} http://localhost:3000"
    if [ -f /tmp/backend.log ]; then
        echo -e "  ${BLUE}Logs:${NC} /tmp/backend.log"
    fi
    RUNNING_COUNT=$((RUNNING_COUNT + 1))
else
    echo -e "  ${RED}✗ Not Running${NC}"
fi

echo ""

# Check Frontend
echo -e "${BLUE}Frontend (Port 5173):${NC}"
FRONTEND_PID=$(lsof -ti:5173)
if [ ! -z "$FRONTEND_PID" ]; then
    echo -e "  ${GREEN}✓ Running${NC} (PID: $FRONTEND_PID)"
    echo -e "  ${BLUE}URL:${NC} http://localhost:5173"
    if [ -f /tmp/frontend.log ]; then
        echo -e "  ${BLUE}Logs:${NC} /tmp/frontend.log"
    fi
    RUNNING_COUNT=$((RUNNING_COUNT + 1))
else
    echo -e "  ${RED}✗ Not Running${NC}"
fi

echo ""

# Docker Status
echo -e "${BLUE}Docker Containers:${NC}"
if docker ps > /dev/null 2>&1; then
    DB_CONTAINER=$(docker ps --filter "name=db" --format "{{.Names}}" 2>/dev/null)
    if [ ! -z "$DB_CONTAINER" ]; then
        echo -e "  ${GREEN}✓ Database container: $DB_CONTAINER${NC}"
    else
        echo -e "  ${YELLOW}⚠ No database container running${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠ Docker not accessible${NC}"
fi

echo ""

# Overall status
TOTAL_SERVICES=3
if [ $RUNNING_COUNT -eq $TOTAL_SERVICES ]; then
# Overall status
TOTAL_SERVICES=3
if [ $RUNNING_COUNT -eq $TOTAL_SERVICES ]; then
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  All Services Running ($RUNNING_COUNT/$TOTAL_SERVICES)${NC}"
    echo -e "${GREEN}========================================${NC}"
elif [ $RUNNING_COUNT -gt 0 ]; then
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}  Partial Services Running ($RUNNING_COUNT/$TOTAL_SERVICES)${NC}"
    echo -e "${YELLOW}========================================${NC}"
else
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}  No Services Running (0/$TOTAL_SERVICES)${NC}"
    echo -e "${RED}========================================${NC}"
fi
echo ""
