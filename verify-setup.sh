#!/bin/bash

# Real Estate Platform - Setup Verification Script
# This script verifies that all required files and configurations are in place

echo "========================================="
echo "Real Estate Platform - Setup Verification"
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Function to check file existence
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1 - MISSING"
        ((FAILED++))
    fi
}

# Function to check directory existence
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1/ - MISSING"
        ((FAILED++))
    fi
}

echo "1. Checking Project Structure..."
echo "================================"
check_dir "Projects/backend"
check_dir "Projects/frontend"
check_dir "Projects/database"
check_dir "Projects/sample data/images"
echo ""

echo "2. Checking Backend Files..."
echo "============================="
check_file "Projects/backend/package.json"
check_file "Projects/backend/tsconfig.json"
check_file "Projects/backend/nest-cli.json"
check_file "Projects/backend/.env"
check_file "Projects/backend/.env.example"
check_file "Projects/backend/src/main.ts"
check_file "Projects/backend/src/app.module.ts"
check_file "Projects/backend/src/app.controller.ts"
check_file "Projects/backend/src/app.service.ts"
echo ""

echo "3. Checking Backend Modules..."
echo "=============================="
check_dir "Projects/backend/src/properties"
check_file "Projects/backend/src/properties/properties.module.ts"
check_file "Projects/backend/src/properties/properties.controller.ts"
check_file "Projects/backend/src/properties/properties.service.ts"
check_file "Projects/backend/src/properties/entities/property.entity.ts"
echo ""
check_dir "Projects/backend/src/lands"
check_file "Projects/backend/src/lands/lands.module.ts"
check_file "Projects/backend/src/lands/lands.controller.ts"
check_file "Projects/backend/src/lands/lands.service.ts"
echo ""
check_dir "Projects/backend/src/projects"
check_file "Projects/backend/src/projects/projects.module.ts"
check_file "Projects/backend/src/projects/projects.controller.ts"
check_file "Projects/backend/src/projects/projects.service.ts"
echo ""

echo "4. Checking Frontend Files..."
echo "=============================="
check_file "Projects/frontend/package.json"
check_file "Projects/frontend/tsconfig.json"
check_file "Projects/frontend/vite.config.ts"
check_file "Projects/frontend/.env"
check_file "Projects/frontend/.env.example"
check_file "Projects/frontend/index.html"
check_file "Projects/frontend/src/main.tsx"
check_file "Projects/frontend/src/App.tsx"
check_file "Projects/frontend/src/App.css"
echo ""

echo "5. Checking Frontend Components..."
echo "==================================="
check_dir "Projects/frontend/src/components"
check_file "Projects/frontend/src/components/PropertyCard.tsx"
check_file "Projects/frontend/src/components/LandCard.tsx"
check_file "Projects/frontend/src/components/ProjectCard.tsx"
echo ""

echo "6. Checking Frontend Pages..."
echo "=============================="
check_dir "Projects/frontend/src/pages"
check_file "Projects/frontend/src/pages/HomePage.tsx"
check_file "Projects/frontend/src/pages/PropertyDetailPage.tsx"
check_file "Projects/frontend/src/pages/LandDetailPage.tsx"
check_file "Projects/frontend/src/pages/ProjectDetailPage.tsx"
echo ""

echo "7. Checking Frontend Services..."
echo "================================="
check_file "Projects/frontend/src/services/api.ts"
check_file "Projects/frontend/src/types/index.ts"
echo ""

echo "8. Checking Database Files..."
echo "=============================="
check_file "Projects/database/script.sql"
echo ""

echo "9. Checking Sample Data..."
echo "==========================="
check_dir "Projects/sample data/images/properties"
check_dir "Projects/sample data/images/lands"
check_dir "Projects/sample data/images/projects"
echo ""

echo "10. Checking Documentation..."
echo "=============================="
check_file "README.md"
check_file "QUICKSTART.md"
check_file "PROJECT_SUMMARY.md"
check_file "Projects/backend/README.md"
check_file "Projects/frontend/README.md"
echo ""

echo "========================================="
echo "Verification Summary"
echo "========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Project structure is complete.${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. Initialize database: psql -h db -U postgres -d postgres -f Projects/database/script.sql"
    echo "2. Start backend: cd Projects/backend && npm install && npm run start:dev"
    echo "3. Start frontend: cd Projects/frontend && npm install && npm run dev"
    exit 0
else
    echo -e "${RED}✗ Some files are missing. Please review the structure.${NC}"
    exit 1
fi
