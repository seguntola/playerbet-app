# PlayerBet - Modern Sports Betting Platform

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
3. Commit changes: `git commit -m 'Add amazing feature'`
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

For detailed setup instructions, see individual README files in each directory.
