#!/bin/bash

# PlayerBet Repository Setup Script
# This script creates/updates all files in the PlayerBet repository

set -e  # Exit on any error

echo "🚀 Setting up PlayerBet Repository..."
echo "======================================"

# Function to create directory if it doesn't exist
create_dir() {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
        echo "📁 Created directory: $1"
    fi
}

# Function to create file with content
create_file() {
    local file_path="$1"
    local content="$2"
    
    # Create directory if it doesn't exist
    create_dir "$(dirname "$file_path")"
    
    # Write content to file (overwrite if exists)
    echo "$content" > "$file_path"
    echo "✅ Created/Updated: $file_path"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "⚠️  Not in a git repository. Initializing..."
    git init
    echo "✅ Git repository initialized"
fi

echo ""
echo "📝 Creating project structure and files..."
echo ""

# Root level files
create_file "README.md" '# PlayerBet - Modern Sports Betting Platform

PlayerBet is a comprehensive full-stack sports betting platform featuring web, mobile, and backend applications. The platform specializes in player prop betting with unique bet types including "Beast Mode" (high risk/reward) and "Safety Play" (forgiving payouts).

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │    Web App      │    │   Backend API   │
│  (React Native)│    │    (React)      │    │   (.NET 8)      │
│                 │    │                 │    │                 │
│ • iOS/Android   │    │ • Modern React  │    │ • RESTful API   │
│ • Expo Framework│────┼─• Tailwind CSS │────┤ • Entity Framework│
│ • Native Performance│  │ • Responsive   │    │ • JWT Auth      │
│                 │    │                 │    │ • PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Backend (.NET 8)
- **Framework**: ASP.NET Core 8.0 Web API
- **Database**: PostgreSQL with Entity Framework Core 8.0
- **Authentication**: JWT-based with simplified demo implementation
- **Architecture**: Controller → Service → Repository pattern

### Frontend (React)
- **Framework**: React 18 with Create React App
- **Styling**: Tailwind CSS 3.3.2
- **Icons**: Lucide React 0.263.1
- **HTTP Client**: Axios 1.4.0

### Mobile (React Native)
- **Framework**: React Native with Expo 53.0.22
- **Navigation**: React Navigation 6.x
- **Storage**: AsyncStorage for local data persistence

## Quick Start

### Prerequisites
- Node.js 18+
- .NET 8.0 SDK
- PostgreSQL 14+
- Docker (optional)
- Expo CLI (for mobile)

### Development Setup

1. **Clone and setup:**
   ```bash
   git clone <your-repo-url>
   cd playerbet
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Backend:**
   ```bash
   cd backend/PlayerBet.Api
   dotnet restore
   dotnet ef database update
   dotnet run
   ```

3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Mobile:**
   ```bash
   cd mobile
   npm install
   npm start
   ```

## Core Features

### Betting System
- **Beast Mode**: All picks must win, higher multipliers (3x to 150x)
- **Safety Play**: Partial payouts allowed, lower multipliers (2.5x to 90x)
- **Player Props**: Football, Basketball, Tennis, Golf, Cricket

### User Management
- Registration with comprehensive validation (21+ age requirement)
- JWT-based authentication
- Starting balance of $1000 for demo accounts

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/users/{id}` - Get user profile

### Betting
- `POST /api/bets` - Place new bet
- `GET /api/bets/user/{userId}` - Get user betting history
- `POST /api/bets/calculate-payout` - Calculate potential payout

### Games
- `GET /api/games` - Get available games and player props

## Project Structure

```
playerbet/
├── backend/PlayerBet.Api/     # .NET 8 Web API
├── frontend/                  # React web application
├── mobile/                    # React Native mobile app
├── docker-compose.yml         # Docker configuration
└── setup.sh                   # Setup script
```

## Development Commands

### Backend
```bash
# Database
dotnet ef migrations add MigrationName
dotnet ef database update

# Development
dotnet restore
dotnet build
dotnet run
```

### Frontend
```bash
npm install
npm start           # Development server
npm run build       # Production build
```

### Mobile
```bash
npm install
npm start           # Expo development server
expo build:android  # Android build
expo build:ios      # iOS build
```

## Docker Deployment

```bash
# Full stack
docker-compose up -d

# Database only
docker-compose up postgres -d
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m '\''Add amazing feature'\''`
4. Push to branch: `git push origin feature/amazing-feature`
5. Submit a pull request

## Security Considerations

- Input validation on all endpoints
- JWT tokens for authentication
- Age verification (21+ requirement)
- Rate limiting recommended for production

## Known Issues/Limitations

1. **Demo Authentication**: Simplified JWT implementation
2. **Mock Data**: Sports data is hardcoded for demo
3. **Production Security**: Password hashing needs enhancement for production

## License

This project is licensed under the MIT License.

---

For detailed setup instructions, see individual README files in each directory.'

create_file "docker-compose.yml" 'version: '\''3.8'\''

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: PlayerBetDb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  playerbet-api:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5001:80"
    depends_on:
      - postgres
    environment:
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=PlayerBetDb;Username=postgres;Password=password123;Port=5432

volumes:
  postgres_data:'

create_file "setup.sh" '#!/bin/bash

echo "🎯 PlayerBet Setup Script"
echo "========================="

# Check prerequisites
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET 8.0 SDK not found. Please install .NET 8.0 SDK first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Setup database
echo "🔧 Starting PostgreSQL database..."
docker-compose up -d postgres
sleep 10

# Setup backend
echo "🔧 Setting up backend..."
cd backend/PlayerBet.Api
dotnet restore
dotnet ef database update
dotnet run &
BACKEND_PID=$!
cd ../../

# Setup frontend
echo "🔧 Setting up frontend..."
cd frontend
npm install
npm start &
FRONTEND_PID=$!
cd ../

echo ""
echo "🚀 PlayerBet is starting up!"
echo "Backend API: http://localhost:5001"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop all services"

# Cleanup on exit
cleanup() {
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    docker-compose down
    echo "✅ All services stopped"
    exit 0
}

trap cleanup INT
wait'

# Backend files
create_file "backend/Dockerfile" 'FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["PlayerBet.Api/PlayerBet.Api.csproj", "PlayerBet.Api/"]
RUN dotnet restore "PlayerBet.Api/PlayerBet.Api.csproj"
COPY . .
WORKDIR "/src/PlayerBet.Api"
RUN dotnet build "PlayerBet.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PlayerBet.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PlayerBet.Api.dll"]'

create_file "backend/docker-compose.yml" 'version: '\''3.8'\''

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: PlayerBetDb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  playerbet-api:
    build: 
      context: .
      dockerfile: Dockerfile
    ports:
      - "5001:80"
    depends_on:
      - postgres
    environment:
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=PlayerBetDb;Username=postgres;Password=password123;Port=5432

volumes:
  postgres_data:'

create_file "backend/PlayerBet.Api/PlayerBet.Api.csproj" '<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.0" />
    <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.4.0" />
    <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
    <PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="7.0.3" /> 
</ItemGroup>
</Project>'

create_file "backend/PlayerBet.Api/Program.cs" 'using Microsoft.EntityFrameworkCore;
using PlayerBet.Api.Data;
using PlayerBet.Api.Services;
using PlayerBet.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001", "http://10.0.0.247:5001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add Entity Framework
builder.Services.AddDbContext<PlayerBetDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseNpgsql(connectionString);
});

// Register services
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<IBettingService, BettingService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Add error handling middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

//app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

// Auto-migrate database on startup (for development)
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<PlayerBetDbContext>();
    try
    {
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

app.Run("http://0.0.0.0:5001");'

create_file "backend/PlayerBet.Api/appsettings.json" '{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=PlayerBetDb;Username=seguntola;Password=password123;Port=5432"
  }
}'

create_file "backend/PlayerBet.Api/appsettings.development.json" '{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=PlayerBetDb;Username=seguntola;Password=password123;Port=5432"
  }
}'

# Frontend files
create_file "frontend/README.md" '# PlayerBet Frontend

Modern React web application for the PlayerBet sports betting platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and concurrent features
- **Tailwind CSS 3.3.2** - Utility-first CSS framework
- **Lucide React 0.263.1** - Beautiful SVG icons
- **Axios 1.4.0** - Promise-based HTTP client
- **React Router DOM 6.11.0** - Client-side routing

## 🎯 Key Features

### User Interface
- **Onboarding Flow**: Interactive multi-screen introduction
- **Authentication**: Login and registration with validation
- **Betting Dashboard**: Real-time betting interface
- **Responsive Design**: Mobile-first approach

### Betting System
- **Beast Mode**: High-risk, high-reward betting (up to 150x multiplier)
- **Safety Play**: Forgiving payouts with partial wins
- **Player Props**: Football, Basketball, Tennis, Golf, Cricket

## 🔧 Configuration

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_WEBSOCKET_URL=ws://localhost:5001/hub
```

## 📱 Responsive Design

The application works seamlessly across:
- **Desktop**: Full-featured betting interface
- **Tablet**: Optimized layout for touch interaction
- **Mobile**: Complete mobile experience

## 🏗️ Build & Deployment

### Production Build

```bash
npm run build
```

Creates optimized production build in the `build/` folder.

## 🔐 Security

- **Input Validation**: All forms include client-side validation
- **XSS Protection**: React'\''s built-in XSS protection
- **Secure Authentication**: JWT tokens with proper storage

For more information about the complete PlayerBet platform, see the main project README.'

create_file "frontend/package.json" '{
  "name": "playerbet-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.4.0",
    "lucide-react": "^0.263.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.11.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.2"
  },
  "proxy": "https://localhost:7000"
}'

create_file "frontend/.env" 'REACT_APP_API_URL=https://localhost:7000/api
REACT_APP_WEBSOCKET_URL=ws://localhost:7000/hub'

# Mobile files
create_file "mobile/README.md" '# PlayerBet Mobile App

React Native mobile application for PlayerBet sports betting platform.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on device:
   - iOS: Press `i` or scan QR code with Camera app
   - Android: Press `a` or scan QR code with Expo Go app

## Configuration

Update the API URL in `src/services/AuthService.js` to point to your backend:

```javascript
const API_BASE_URL = '\''http://your-backend-url/api'\'';
```

## Features

- ✅ Cross-platform (iOS & Android)
- ✅ User authentication
- ✅ Sports betting interface
- ✅ User profile and stats
- ✅ Modern UI with dark theme

## Development

- Built with React Native and Expo
- Uses React Navigation for routing
- AsyncStorage for local data persistence
- Axios for API communication

## Building

- Android: `expo build:android`
- iOS: `expo build:ios`

For more details, see the main project README.'

create_file "mobile/package.json" '{
  "name": "playerbet-mobile",
  "version": "1.0.0",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:android": "expo build:android",
    "build:ios": "expo build:ios"
  },
  "dependencies": {
    "@expo/vector-icons": "^14.1.0",
    "@react-native-async-storage/async-storage": "2.1.2",
    "@react-native-community/datetimepicker": "^8.2.0",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "axios": "^1.4.0",
    "expo": "53.0.22",
    "expo-font": "~13.3.2",
    "expo-linear-gradient": "~14.1.5",
    "expo-status-bar": "~2.2.3",
    "react": "19.0.0",
    "react-native": "0.79.5",
    "react-native-gesture-handler": "~2.24.0",
    "react-native-reanimated": "~3.17.4",
    "react-native-safe-area-context": "5.4.0",
    "react-native-screens": "~4.11.1",
    "react-native-vector-icons": "^10.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}'

create_file "mobile/app.json" '{
  "expo": {
    "name": "PlayerBet",
    "slug": "playerbet-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.playerbet.mobile"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      },
      "package": "com.playerbet.mobile"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "0188393e-f941-49c7-bec7-170c167d2bb1"
      }
    },
    "owner": "seguntola",
    "plugins": [
      "expo-font"
    ]
  }
}'

# Git ignore files
create_file "backend/.gitignore" '## Ignore Visual Studio temporary files, build results, and
## files generated by popular Visual Studio add-ons.

# User-specific files
*.rsuser
*.suo
*.user
*.userosscache
*.sln.docstates

# Build results
[Dd]ebug/
[Dd]ebugPublic/
[Rr]elease/
[Rr]eleases/
x64/
x86/
[Aa][Rr][Mm]/
[Aa][Rr][Mm]64/
bld/
[Bb]in/
[Oo]bj/
[Ll]og/

# Visual Studio 2015/2017 cache/options directory
.vs/

# Visual Studio Code
.vscode/

# MSTest test Results
[Tt]est[Rr]esult*/
[Bb]uild[Ll]og.*

# .NET Core
project.lock.json
project.fragment.lock.json
artifacts/

# StyleCop
StyleCopReport.xml

# Files built by Visual Studio
*_i.c
*_p.c
*_h.h
*.ilk
*.meta
*.obj
*.iobj
*.pch
*.pdb
*.ipdb
*.pgc
*.pgd
*.rsp
*.sbr
*.tlb
*.tli
*.tlh
*.tmp
*.tmp_proj
*_wpftmp.csproj
*.log
*.vspscc
*.vssscc
.builds
*.pidb
*.svclog
*.scc

# Visual C++ cache files
ipch/
*.aps
*.ncb
*.opendb
*.opensdf
*.sdf
*.cachefile
*.VC.db
*.VC.VC.opendb

# Visual Studio profiler
*.psess
*.vsp
*.vspx
*.sap

# Visual Studio Trace Files
*.e2e

# TFS 2012 Local Workspace
$tf/

# ReSharper is a .NET coding add-in
_ReSharper*/
*.[Rr]e[Ss]harper
*.DotSettings.user

# JetBrains Rider
.idea/
*.sln.iml

# CodeRush personal settings
.cr/personal

# Python Tools for Visual Studio (PTVS)
__pycache__/
*.pyc

# MSBuild Binary and Structured Log
*.binlog

# NVidia Nsight GPU debugger configuration file
*.nvuser

# MFractors (Xamarin productivity tool) working folder
.mfractor/

# Local History for Visual Studio
.localhistory/

# BeatPulse healthcheck temp database
healthchecksdb

# Backup folder for Package Reference Convert tool in Visual Studio 2017
MigrationBackup/

# Environment variables
.env
.env.local
.env.development
.env.production

# Database
*.db
*.sqlite'

create_file "frontend/.gitignore" '# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/'

create_file "mobile/.gitignore" '# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Expo
.expo/
dist/
web-build/

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# Debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Temporary files
*.tmp
*.temp

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?'

# Make setup script executable
chmod +x setup.sh

echo ""
echo "✅ Repository structure created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Review and customize configuration files"
echo "2. Update database connection strings if needed"
echo "3. Run: chmod +x setup.sh"
echo "4. Run: ./setup.sh to start the application"
echo ""
echo "🚀 To get started immediately:"
echo "   ./setup.sh"
echo ""
echo "📚 Key files to review:"
echo "   - backend/PlayerBet.Api/appsettings.json (database config)"
echo "   - frontend/.env (API endpoint)"
echo "   - mobile/src/utils/Constants.js (API endpoint)"
echo ""
echo "🎯 Happy coding with PlayerBet!"