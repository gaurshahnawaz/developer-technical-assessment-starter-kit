@echo off
REM Docker Post-Installation Script for Real Estate Marketplace
REM Run this AFTER restarting your computer following Docker installation

echo.
echo ========================================
echo Docker Setup for Real Estate Marketplace
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker not found. Please restart your computer first.
    echo Docker Desktop installation requires a system restart to complete.
    echo.
    pause
    exit /b 1
)

echo [OK] Docker is installed
echo.

REM Check if Docker daemon is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo WARNING: Docker daemon not running
    echo Please start Docker Desktop from Start Menu or System Tray
    echo.
    pause
    exit /b 1
)

echo [OK] Docker daemon is running
echo.

REM Set Node.js path
set PATH=C:\Users\Dell\AppData\Local\nodejs;%PATH%

REM Navigate to project
cd /d "c:\Users\Dell\Desktop\ohb\developer-technical-assessment-starter-kit"

echo [STEP 1] Starting PostgreSQL with Docker...
echo.

docker-compose up -d

if errorlevel 1 (
    echo ERROR: Failed to start PostgreSQL
    echo Check docker-compose.yml configuration
    pause
    exit /b 1
)

echo [OK] PostgreSQL started
echo Waiting for database to be ready...

REM Wait for PostgreSQL to be ready
timeout /t 5 /nobreak

echo.
echo [STEP 2] Verifying PostgreSQL connection...
docker exec real_estate_db psql -U real_estate -d real_estate_marketplace -c "SELECT 1" >nul 2>&1

if errorlevel 1 (
    echo ERROR: Could not connect to PostgreSQL
    echo Check logs: docker logs real_estate_db
    pause
    exit /b 1
)

echo [OK] PostgreSQL is ready
echo.

echo [STEP 3] Updating backend configuration...
echo Creating .env file for PostgreSQL...

(
    echo DB_TYPE=postgres
    echo DB_HOST=localhost
    echo DB_PORT=5432
    echo DB_USERNAME=real_estate
    echo DB_PASSWORD=password123
    echo DB_NAME=real_estate_marketplace
    echo NODE_ENV=development
    echo JWT_SECRET=your-secret-key-here
    echo PORT=3000
) > "Projects\backend\.env"

echo [OK] Backend configuration updated
echo.

echo [STEP 4] Building backend...
cd "Projects\backend"
call npm run build

if errorlevel 1 (
    echo ERROR: Backend build failed
    pause
    exit /b 1
)

echo [OK] Backend built successfully
echo.

echo [STEP 5] Starting backend server...
echo Backend will start in production mode
echo.
echo Note: Keep this window open for backend to run
echo Open another terminal for frontend if needed
echo.

call npm run start:prod

pause
