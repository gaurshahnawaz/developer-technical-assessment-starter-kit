#!/bin/bash

# Colors for output
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Real Estate Marketplace - Restart${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Stop the application
bash "$SCRIPT_DIR/stop.sh"

# Wait a moment
sleep 2

# Start the application
bash "$SCRIPT_DIR/start.sh"
