# PlayerBet - Sports Betting Platform

A modern sports betting platform with flexible bet types: **Smart Play** and **Perfect Pick**.

## Features

### Bet Types
- **Smart Play**: Flexible betting with partial payouts
  - Up to 8 picks maximum
  - 1-2 losses = 60% or 25% payout (respectively)
  - 3+ losses = complete loss
  - Lower risk, decent rewards

- **Perfect Pick**: Traditional parlay betting  
  - Up to 12 picks maximum
  - ALL picks must win to cash out
  - One loss = entire bet loses
  - Higher risk, higher rewards

### Platform Features
- User registration and authentication
- Real-time balance tracking
- Comprehensive betting history
- Mobile-responsive design
- Modern, attractive UI

## Technology Stack

### Backend
- **Framework**: ASP.NET Core 8.0
- **Database**: PostgreSQL
- **ORM**: Entity Framework Core
- **Authentication**: JWT-based (simplified for demo)

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Create React App

## Project Structure

```
PlayerBet/
├── backend/
│   ├── PlayerBet.Api/
│   │   ├── Controllers/
│   │   ├── Data/
│   │   ├── DTOs/
│   │   ├── Middleware/
│   │   ├── Models/
│   │   ├── Services/
│   │   ├── Program.cs
│   │   └── PlayerBet.Api.csproj
│   ├── Dockerfile
│   └── docker-compose.yml
└── frontend/
    ├── public/
    ├── src/
    │   ├── pages/
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── tailwind.config.js
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- .NET 8.0 SDK
- PostgreSQL (or Docker)

### Option 1: Docker Setup (Recommended)

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```
   This starts:
   - PostgreSQL database on port 5432
   - Backend API on port 5000

3. **Start frontend**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```
   Frontend runs on port 3000

### Option 2: Local Development Setup

#### Backend Setup

1. **Install PostgreSQL** (if not using Docker)
   - Create database named `PlayerBetDb`
   - Update connection string in `appsettings.json`

2. **Navigate to backend directory**
   ```bash
   cd backend/PlayerBet.Api
   ```

3. **Restore packages**
   ```bash
   dotnet restore
   ```

4. **Run database migrations**
   ```bash
   dotnet ef database update
   ```

5. **Start the API**
   ```bash
   dotnet run
   ```
   API will be available at `http://localhost:5000`

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   Frontend will be available at `http://localhost:3000`

## Configuration

### Backend Configuration

Update `appsettings.json` for your environment:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=PlayerBetDb;Username=postgres;Password=your_password;Port=5432"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### Frontend Configuration

The frontend is configured to connect to the backend at `http://localhost:5000`. Update the `API_BASE_URL` in `src/App.js` if needed.

## Database Schema

### Users Table
- User account information
- Authentication credentials
- Balance tracking
- Profile data

### Bets Table
- Bet information and status
- Bet types (Smart Play vs Perfect Pick)
- Payout calculations

### BetPicks Table
- Individual picks within each bet
- Player statistics and lines
- Pick outcomes

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/{id}` - Get user profile

### Betting
- `POST /api/bets` - Place a new bet
- `GET /api/bets/user/{userId}` - Get user's betting history
- `GET /api/bets/{betId}` - Get specific bet details
- `POST /api/bets/calculate-payout` - Calculate potential payout

### Games
- `GET /api/games` - Get available games and odds

## Demo Credentials

For testing purposes, you can create a new account which will automatically receive a $1000 bonus balance.

## Bet Type Rules

### Smart Play Rules
- **Flexibility**: Partial payouts on partial wins
- **Payout Structure**:
  - All picks win: 100% of potential payout
  - 1 pick loses: 60% of potential payout
  - 2 picks lose: 25% of potential payout
  - 3+ picks lose: 0% payout (bet lost)
- **Maximum picks**: 8
- **Multipliers**: Lower base multipliers for safety

### Perfect Pick Rules
- **All-or-Nothing**: Must win all picks to receive payout
- **Payout Structure**:
  - All picks win: 100% of potential payout
  - Any pick loses: 0% payout (bet lost)
- **Maximum picks**: 12
- **Multipliers**: Higher multipliers for bigger risks

## Development

### Adding New Features

1. **Backend Changes**:
   - Add models to `Models/`
   - Create services in `Services/`
   - Add controllers in `Controllers/`
   - Run migrations: `dotnet ef migrations add MigrationName`

2. **Frontend Changes**:
   - Add components to `src/pages/` or `src/components/`
   - Update routing in `App.js`
   - Add new API calls as needed

### Database Migrations

To create a new migration:
```bash
dotnet ef migrations add MigrationName
dotnet ef database update
```

### Running Tests

Backend:
```bash
dotnet test
```

Frontend:
```bash
npm test
```

## Deployment

### Production Environment Variables

**Backend**:
```env
ConnectionStrings__DefaultConnection=your_production_db_string
ASPNETCORE_ENVIRONMENT=Production
```

**Frontend**:
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

### Docker Production Deployment

1. Update `docker-compose.yml` for production
2. Use environment files for sensitive data
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates
5. Configure database backups

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify PostgreSQL is running
   - Check connection string format
   - Ensure database exists

2. **CORS Errors**
   - Verify frontend URL in CORS policy
   - Check API endpoints are accessible

3. **Build Errors**
   - Clear npm/dotnet caches
   - Verify all dependencies are installed
   - Check for version compatibility

### Logs

- **Backend logs**: Check console output or configure logging providers
- **Frontend logs**: Check browser console for errors
- **Database logs**: Check PostgreSQL logs for connection issues

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## Support

For issues or questions:
1. Check existing issues in repository
2. Create new issue with detailed description
3. Include logs and error messages

---

## Architecture Decisions

### Bet Type Implementation
- **Smart Play**: Implements flexible payout logic with graduated loss tolerance
- **Perfect Pick**: Traditional parlay with higher risk/reward
- **Multiplier System**: Dynamic multipliers based on pick count and bet type

### Database Design
- **Normalized structure**: Separate tables for users, bets, and picks
- **Audit trails**: Created/updated timestamps on all entities
- **Constraints**: Unique constraints on email, username, phone

### Security Considerations
- **Password hashing**: SHA-256 with salt (upgrade to bcrypt for production)
- **Input validation**: Server-side validation on all endpoints
- **CORS policy**: Restricted to frontend domains

### Frontend Architecture
- **Component-based**: Modular React components
- **State management**: Local state with potential for Redux
- **Responsive design**: Mobile-first approach with Tailwind

This completes the full-stack sports betting platform with Smart Play and Perfect Pick bet types!