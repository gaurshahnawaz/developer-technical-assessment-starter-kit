# Docker Post-Installation Setup Script
# Run this AFTER restarting your computer following Docker installation
# Usage: .\setup-docker.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Docker Setup for Real Estate Marketplace" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "[OK] Docker installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker not found. Please restart your computer first." -ForegroundColor Red
    Write-Host "Docker Desktop installation requires a system restart to complete." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Docker daemon is running
try {
    docker ps | Out-Null
    Write-Host "[OK] Docker daemon is running" -ForegroundColor Green
} catch {
    Write-Host "[WARNING] Docker daemon not running" -ForegroundColor Yellow
    Write-Host "Please start Docker Desktop from Start Menu or System Tray" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Set Node.js path
$env:Path = "C:\Users\Dell\AppData\Local\nodejs;$env:Path"

# Navigate to project
Set-Location "c:\Users\Dell\Desktop\ohb\developer-technical-assessment-starter-kit"

# Step 1: Start PostgreSQL
Write-Host "[STEP 1] Starting PostgreSQL with Docker..." -ForegroundColor Cyan
Write-Host ""

try {
    docker-compose up -d
    Write-Host "[OK] PostgreSQL started" -ForegroundColor Green
    Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
} catch {
    Write-Host "[ERROR] Failed to start PostgreSQL" -ForegroundColor Red
    Write-Host "Check docker-compose.yml configuration" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Step 2: Verify PostgreSQL connection
Write-Host "[STEP 2] Verifying PostgreSQL connection..." -ForegroundColor Cyan

try {
    docker exec real_estate_db psql -U real_estate -d real_estate_marketplace -c "SELECT 1" | Out-Null
    Write-Host "[OK] PostgreSQL is ready" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Could not connect to PostgreSQL" -ForegroundColor Red
    Write-Host "Check logs: docker logs real_estate_db" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Step 3: Update backend configuration
Write-Host "[STEP 3] Updating backend configuration..." -ForegroundColor Cyan

$envContent = @"
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=real_estate
DB_PASSWORD=password123
DB_NAME=real_estate_marketplace
NODE_ENV=development
JWT_SECRET=your-secret-key-here
PORT=3000
"@

Set-Content -Path "Projects\backend\.env" -Value $envContent
Write-Host "[OK] Backend configuration updated (.env file created)" -ForegroundColor Green

Write-Host ""

# Step 4: Build backend
Write-Host "[STEP 4] Building backend..." -ForegroundColor Cyan

Set-Location "Projects\backend"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Backend build failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Backend built successfully" -ForegroundColor Green

Write-Host ""

# Step 5: Start backend server
Write-Host "[STEP 5] Starting backend server..." -ForegroundColor Cyan
Write-Host "Backend will start in production mode" -ForegroundColor Yellow
Write-Host ""
Write-Host "Open another terminal for frontend:" -ForegroundColor Cyan
Write-Host "  cd Projects/frontend" -ForegroundColor Gray
Write-Host "  `$env:Path = 'C:\Users\Dell\AppData\Local\nodejs;`$env:Path'" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Then access the application at:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host "  Backend: http://localhost:3000" -ForegroundColor Gray
Write-Host "  API Docs: http://localhost:3000/api" -ForegroundColor Gray
Write-Host ""

npm run start:prod
