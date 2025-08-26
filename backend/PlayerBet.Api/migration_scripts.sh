#!/bin/bash
# setup-migrations.sh - Unix/Linux/macOS Script

echo "🗄️  PlayerBet - Database Migration Setup"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if dotnet CLI is available
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED}❌ .NET CLI is not installed or not in PATH${NC}"
    echo "   Please install .NET 8.0 SDK from: https://dotnet.microsoft.com/download"
    exit 1
fi

echo -e "${GREEN}✅ .NET CLI found${NC}"

# Check if we're in the right directory or navigate to it
if [ -d "backend/PlayerBet.Api" ]; then
    echo -e "${BLUE}📂 Navigating to backend/PlayerBet.Api${NC}"
    cd backend/PlayerBet.Api
elif [ -d "PlayerBet.Api" ]; then
    echo -e "${BLUE}📂 Navigating to PlayerBet.Api${NC}"
    cd PlayerBet.Api
elif [ -f "PlayerBet.Api.csproj" ]; then
    echo -e "${BLUE}📂 Already in PlayerBet.Api directory${NC}"
else
    echo -e "${RED}❌ Could not find PlayerBet.Api project directory${NC}"
    echo "   Please run this script from the root directory or backend directory"
    exit 1
fi

# Check if project file exists
if [ ! -f "PlayerBet.Api.csproj" ]; then
    echo -e "${RED}❌ PlayerBet.Api.csproj not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found PlayerBet.Api project${NC}"

# Install EF Core tools if not already installed
echo -e "${BLUE}🔧 Ensuring EF Core tools are installed...${NC}"
dotnet tool install --global dotnet-ef --version 8.0.0 2>/dev/null || dotnet tool update --global dotnet-ef --version 8.0.0

# Restore NuGet packages
echo -e "${BLUE}📦 Restoring NuGet packages...${NC}"
dotnet restore

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to restore packages${NC}"
    exit 1
fi

# Check if Migrations folder already exists
if [ -d "Migrations" ]; then
    echo -e "${YELLOW}⚠️  Migrations folder already exists${NC}"
    read -p "Do you want to remove existing migrations and start fresh? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🗑️  Removing existing migrations...${NC}"
        rm -rf Migrations/
        echo -e "${GREEN}✅ Existing migrations removed${NC}"
    else
        echo -e "${YELLOW}⏭️  Keeping existing migrations${NC}"
        exit 0
    fi
fi

# Add initial migration
echo -e "${BLUE}🏗️  Creating initial migration...${NC}"
dotnet ef migrations add InitialCreate

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to create migration${NC}"
    echo "   Common issues:"
    echo "   - Database connection string not configured"
    echo "   - Missing EF Core packages"
    echo "   - DbContext not properly configured"
    exit 1
fi

echo -e "${GREEN}✅ Initial migration created successfully!${NC}"

# Ask if user wants to update the database
echo ""
read -p "Do you want to apply the migration to the database now? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo -e "${YELLOW}⏸️  Migration created but not applied${NC}"
    echo "   To apply later, run: dotnet ef database update"
    exit 0
fi

# Update database
echo -e "${BLUE}🗄️  Updating database...${NC}"
dotnet ef database update

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database updated successfully!${NC}"
    echo ""
    echo -e "${GREEN}🎉 Migration setup complete!${NC}"
    echo "   Migration files created in: $(pwd)/Migrations/"
    echo "   Database is ready for use"
else
    echo -e "${RED}❌ Failed to update database${NC}"
    echo "   The migration files were created, but database update failed"
    echo "   Please check your database connection and try: dotnet ef database update"
fi

# setup-migrations.bat - Windows Batch Script
@echo off
setlocal enabledelayedexpansion

echo 🗄️  PlayerBet - Database Migration Setup
echo ========================================

:: Check if dotnet CLI is available
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ .NET CLI is not installed or not in PATH
    echo    Please install .NET 8.0 SDK from: https://dotnet.microsoft.com/download
    pause
    exit /b 1
)

echo ✅ .NET CLI found

:: Check if we're in the right directory or navigate to it
if exist "backend\PlayerBet.Api" (
    echo 📂 Navigating to backend\PlayerBet.Api
    cd backend\PlayerBet.Api
) else if exist "PlayerBet.Api" (
    echo 📂 Navigating to PlayerBet.Api
    cd PlayerBet.Api
) else if exist "PlayerBet.Api.csproj" (
    echo 📂 Already in PlayerBet.Api directory
) else (
    echo ❌ Could not find PlayerBet.Api project directory
    echo    Please run this script from the root directory or backend directory
    pause
    exit /b 1
)

:: Check if project file exists
if not exist "PlayerBet.Api.csproj" (
    echo ❌ PlayerBet.Api.csproj not found
    pause
    exit /b 1
)

echo ✅ Found PlayerBet.Api project

:: Install EF Core tools if not already installed
echo 🔧 Ensuring EF Core tools are installed...
dotnet tool install --global dotnet-ef --version 8.0.0 >nul 2>&1 || dotnet tool update --global dotnet-ef --version 8.0.0 >nul 2>&1

:: Restore NuGet packages
echo 📦 Restoring NuGet packages...
dotnet restore

if %errorlevel% neq 0 (
    echo ❌ Failed to restore packages
    pause
    exit /b 1
)

:: Check if Migrations folder already exists
if exist "Migrations" (
    echo ⚠️  Migrations folder already exists
    set /p choice="Do you want to remove existing migrations and start fresh? (y/N): "
    if /i "!choice!"=="y" (
        echo 🗑️  Removing existing migrations...
        rmdir /s /q Migrations
        echo ✅ Existing migrations removed
    ) else (
        echo ⏭️  Keeping existing migrations
        pause
        exit /b 0
    )
)

:: Add initial migration
echo 🏗️  Creating initial migration...
dotnet ef migrations add InitialCreate

if %errorlevel% neq 0 (
    echo ❌ Failed to create migration
    echo    Common issues:
    echo    - Database connection string not configured
    echo    - Missing EF Core packages
    echo    - DbContext not properly configured
    pause
    exit /b 1
)

echo ✅ Initial migration created successfully!

:: Ask if user wants to update the database
echo.
set /p choice="Do you want to apply the migration to the database now? (Y/n): "
if /i "!choice!"=="n" (
    echo ⏸️  Migration created but not applied
    echo    To apply later, run: dotnet ef database update
    pause
    exit /b 0
)

:: Update database
echo 🗄️  Updating database...
dotnet ef database update

if %errorlevel% equ 0 (
    echo ✅ Database updated successfully!
    echo.
    echo 🎉 Migration setup complete!
    echo    Migration files created in: %cd%\Migrations\
    echo    Database is ready for use
) else (
    echo ❌ Failed to update database
    echo    The migration files were created, but database update failed
    echo    Please check your database connection and try: dotnet ef database update
)

pause

# setup-migrations.ps1 - PowerShell Script (Cross-platform)
Write-Host "🗄️  PlayerBet - Database Migration Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Check if dotnet CLI is available
try {
    $dotnetVersion = dotnet --version
    Write-Host "✅ .NET CLI found (version: $dotnetVersion)" -ForegroundColor Green
}
catch {
    Write-Host "❌ .NET CLI is not installed or not in PATH" -ForegroundColor Red
    Write-Host "   Please install .NET 8.0 SDK from: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if we're in the right directory or navigate to it
if (Test-Path "backend/PlayerBet.Api") {
    Write-Host "📂 Navigating to backend/PlayerBet.Api" -ForegroundColor Blue
    Set-Location "backend/PlayerBet.Api"
}
elseif (Test-Path "PlayerBet.Api") {
    Write-Host "📂 Navigating to PlayerBet.Api" -ForegroundColor Blue
    Set-Location "PlayerBet.Api"
}
elseif (Test-Path "PlayerBet.Api.csproj") {
    Write-Host "📂 Already in PlayerBet.Api directory" -ForegroundColor Blue
}
else {
    Write-Host "❌ Could not find PlayerBet.Api project directory" -ForegroundColor Red
    Write-Host "   Please run this script from the root directory or backend directory" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if project file exists
if (-not (Test-Path "PlayerBet.Api.csproj")) {
    Write-Host "❌ PlayerBet.Api.csproj not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Found PlayerBet.Api project" -ForegroundColor Green

# Install EF Core tools if not already installed
Write-Host "🔧 Ensuring EF Core tools are installed..." -ForegroundColor Blue
try {
    dotnet tool install --global dotnet-ef --version 8.0.0 2>$null
}
catch {
    dotnet tool update --global dotnet-ef --version 8.0.0 2>$null
}

# Restore NuGet packages
Write-Host "📦 Restoring NuGet packages..." -ForegroundColor Blue
$restoreResult = dotnet restore

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to restore packages" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Migrations folder already exists
if (Test-Path "Migrations") {
    Write-Host "⚠️  Migrations folder already exists" -ForegroundColor Yellow
    $choice = Read-Host "Do you want to remove existing migrations and start fresh? (y/N)"
    if ($choice -eq "y" -or $choice -eq "Y") {
        Write-Host "🗑️  Removing existing migrations..." -ForegroundColor Blue
        Remove-Item -Recurse -Force "Migrations"
        Write-Host "✅ Existing migrations removed" -ForegroundColor Green
    }
    else {
        Write-Host "⏭️  Keeping existing migrations" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 0
    }
}

# Add initial migration
Write-Host "🏗️  Creating initial migration..." -ForegroundColor Blue
dotnet ef migrations add InitialCreate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create migration" -ForegroundColor Red
    Write-Host "   Common issues:" -ForegroundColor Yellow
    Write-Host "   - Database connection string not configured" -ForegroundColor Yellow
    Write-Host "   - Missing EF Core packages" -ForegroundColor Yellow
    Write-Host "   - DbContext not properly configured" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Initial migration created successfully!" -ForegroundColor Green

# Ask if user wants to update the database
Write-Host ""
$choice = Read-Host "Do you want to apply the migration to the database now? (Y/n)"
if ($choice -eq "n" -or $choice -eq "N") {
    Write-Host "⏸️  Migration created but not applied" -ForegroundColor Yellow
    Write-Host "   To apply later, run: dotnet ef database update" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 0
}

# Update database
Write-Host "🗄️  Updating database..." -ForegroundColor Blue
dotnet ef database update

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Migration setup complete!" -ForegroundColor Green
    Write-Host "   Migration files created in: $(Get-Location)/Migrations/" -ForegroundColor Blue
    Write-Host "   Database is ready for use" -ForegroundColor Blue
}
else {
    Write-Host "❌ Failed to update database" -ForegroundColor Red
    Write-Host "   The migration files were created, but database update failed" -ForegroundColor Yellow
    Write-Host "   Please check your database connection and try: dotnet ef database update" -ForegroundColor Yellow
}

Read-Host "Press Enter to exit"