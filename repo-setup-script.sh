#!/bin/bash

echo "🏗️  Setting up PlayerBet repository structure..."

# Create frontend directory structure
echo "📱 Creating frontend structure..."
mkdir -p frontend/src/{pages,components,contexts,services,utils,styles}
mkdir -p frontend/public

# Create backend directory structure
echo "🔧 Creating backend structure..."
mkdir -p backend/PlayerBet.Api/{Controllers,Models/DTOs,Data,Services,Middleware}
mkdir -p backend/PlayerBet.Tests/{Controllers,Services}

# Create essential frontend files
echo "📄 Creating essential frontend files..."

# package.json
cat > frontend/package.json << 'EOF'
{
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
}
EOF

# index.html
cat > frontend/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="PlayerBet - Modern Sports Betting Platform"
    />
    <title>PlayerBet</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# index.js
cat > frontend/src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# index.css
cat > frontend/src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
EOF

# tailwind.config.js
cat > frontend/tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# .env
cat > frontend/.env << 'EOF'
REACT_APP_API_URL=https://localhost:7000/api
REACT_APP_WEBSOCKET_URL=ws://localhost:7000/hub
EOF

# Create placeholder App.js
cat > frontend/src/App.js << 'EOF'
import React from 'react';

function App() {
  return (
    <div className="App">
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">PlayerBet</h1>
          <p className="text-gray-400">Frontend setup complete! Add your components here.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
EOF

# Create backend project file
echo "🔧 Creating backend project file..."
cat > backend/PlayerBet.Api/PlayerBet.Api.csproj << 'EOF'
<Project Sdk="Microsoft.NET.Sdk.Web">

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
    <PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="7.0.0" />
  </ItemGroup>

</Project>
EOF

# Create basic Program.cs
cat > backend/PlayerBet.Api/Program.cs << 'EOF'
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
EOF

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: playerbet
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "7000:80"
    depends_on:
      - postgres
    environment:
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=playerbet;Username=postgres;Password=password123

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/

# Production builds
build/
dist/

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# .NET
bin/
obj/
*.user
*.suo
*.cache
*.docstates
*.userprefs
[Dd]ebug/
[Rr]elease/
x64/
x86/
[Aa][Rr][Mm]/
[Aa][Rr][Mm]64/
bld/
[Bb]in/
[Oo]bj/
[Ll]og/

# Visual Studio
.vs/
*.vsix
*.vscode/

# Database
*.db
*.sqlite
*.sqlite3

# OS
.DS_Store
Thumbs.db
EOF

# Create README.md
cat > README.md << 'EOF'
# PlayerBet - Sports Betting Platform

A modern sports betting web application built with React frontend and .NET backend with PostgreSQL database.

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- .NET 8.0 SDK
- PostgreSQL 14+
- Docker (optional)

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend/PlayerBet.Api
dotnet restore
dotnet run
```

### Docker Setup
```bash
docker-compose up -d
```

## Project Structure

```
playerbet-app/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── utils/
│   └── public/
├── backend/
│   ├── PlayerBet.Api/
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── Data/
│   │   ├── Services/
│   │   └── Middleware/
│   └── PlayerBet.Tests/
└── docker-compose.yml
```

## Features

- Modern React frontend with Tailwind CSS
- .NET 8 Web API backend
- PostgreSQL database
- Docker containerization
- JWT authentication
- Real-time sports betting

## Technology Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React
- **Backend**: .NET 8, Entity Framework Core
- **Database**: PostgreSQL
- **DevOps**: Docker, Docker Compose
EOF

echo "✅ Repository structure created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run 'cd frontend && npm install' to install frontend dependencies"
echo "2. Run 'cd backend/PlayerBet.Api && dotnet restore' to restore backend packages"
echo "3. Add your App.js and OnboardingFlow.js components"
echo "4. Commit and push to your repository"
echo ""
echo "🚀 Happy coding!"