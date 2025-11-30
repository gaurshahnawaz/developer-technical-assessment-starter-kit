#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Real Estate Marketplace - Startup${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$SCRIPT_DIR/Projects/backend"
FRONTEND_DIR="$SCRIPT_DIR/Projects/frontend"
DATABASE_DIR="$SCRIPT_DIR/Projects/database"

# ========================================
# DATABASE SETUP
# ========================================
echo -e "${BLUE}Checking Database...${NC}"

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    # Check if we're in a dev container with Docker
    if docker ps > /dev/null 2>&1; then
        echo -e "${YELLOW}PostgreSQL not accessible, checking Docker container...${NC}"
        
        # Check if db container exists
        if docker ps --format '{{.Names}}' | grep -q 'db'; then
            echo -e "${GREEN}✓ Database container is running${NC}"
        else
            echo -e "${YELLOW}Starting PostgreSQL container...${NC}"
            cd "$SCRIPT_DIR/.devcontainer"
            docker-compose up -d db
            echo -e "${GREEN}✓ Database container started${NC}"
        fi
    else
        echo -e "${RED}Warning: PostgreSQL is not running!${NC}"
        echo -e "${YELLOW}Please ensure PostgreSQL is running on localhost:5432${NC}"
        echo -e "${YELLOW}Or use Docker: cd .devcontainer && docker-compose up -d db${NC}\n"
    fi
else
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
fi

# Wait for database to be ready
echo -e "${YELLOW}Waiting for database to be ready...${NC}"
for i in {1..30}; do
    if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Database is ready!${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

# Check if database is initialized
DB_INITIALIZED=$(psql -h localhost -U postgres -d postgres -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_name='properties';" 2>/dev/null || echo "0")

if [ "$DB_INITIALIZED" = "0" ]; then
    echo -e "${YELLOW}Database not initialized. Running initialization script...${NC}"
    if [ -f "$DATABASE_DIR/script.sql" ]; then
        psql -h localhost -U postgres -d postgres -f "$DATABASE_DIR/script.sql" > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Database initialized successfully${NC}"
        else
            echo -e "${YELLOW}Note: Database initialization had warnings (this may be normal)${NC}"
        fi
    else
        echo -e "${RED}Error: Database script not found at $DATABASE_DIR/script.sql${NC}"
    fi
else
    echo -e "${GREEN}✓ Database already initialized${NC}"
fi

echo ""

# ========================================
# BACKEND SETUP
# ========================================
echo -e "${BLUE}Setting up Backend...${NC}"

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}Error: Backend directory not found at $BACKEND_DIR${NC}"
    exit 1
fi

# Setup .env file for backend
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo -e "${YELLOW}Creating backend .env file from .env.example...${NC}"
    if [ -f "$BACKEND_DIR/.env.example" ]; then
        cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
        echo -e "${GREEN}✓ Backend .env created${NC}"
    fi
fi

# Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}Error: Frontend directory not found at $FRONTEND_DIR${NC}"
    exit 1
fi

# Check if backend is already running
if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${YELLOW}Backend is already running on port 3000${NC}"
else
    echo -e "${GREEN}Starting Backend (NestJS)...${NC}"
    cd "$BACKEND_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing backend dependencies...${NC}"
        npm install
    fi
    
    # Start backend in background
    npm run start:dev > /tmp/backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > /tmp/backend.pid
    echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
    echo -e "${BLUE}  Backend logs: /tmp/backend.log${NC}"
fi

# Wait for backend to be ready
echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:3000/properties > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is ready!${NC}\n"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

# Check if frontend is already running
if lsof -ti:5173 > /dev/null 2>&1; then
    echo -e "${YELLOW}Frontend is already running on port 5173${NC}"
else
    echo -e "${GREEN}Starting Frontend (React + Vite)...${NC}"
    cd "$FRONTEND_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing frontend dependencies...${NC}"
        npm install
    fi
    
    # Start frontend in background
    npm run dev > /tmp/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > /tmp/frontend.pid
    echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
    echo -e "${BLUE}  Frontend logs: /tmp/frontend.log${NC}"
fi

# Wait for frontend to be ready
echo -e "${YELLOW}Waiting for frontend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend is ready!${NC}\n"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Application Started Successfully!${NC}"
echo -e "${GREEN}========================================${NC}\n"
echo -e "${BLUE}Database:${NC}     PostgreSQL on localhost:5432"
echo -e "${BLUE}Backend API:${NC}  http://localhost:3000"
echo -e "${BLUE}Frontend:${NC}     http://localhost:5173"
echo -e "\n${YELLOW}Management Commands:${NC}"
echo -e "  Stop:    ./stop.sh"
echo -e "  Restart: ./restart.sh"
echo -e "  Status:  ./status.sh"
echo -e "\n${YELLOW}View Logs:${NC}"
echo -e "  Backend:  tail -f /tmp/backend.log"
echo -e "  Frontend: tail -f /tmp/frontend.log"
echo -e "\n${YELLOW}Database Access:${NC}"
echo -e "  psql -h localhost -U postgres -d postgres\n"
