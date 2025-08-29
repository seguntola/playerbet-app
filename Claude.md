# Claude.md - PlayerBet Repository Guide

## Project Overview

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
- **Key Packages**:
  - `Npgsql.EntityFrameworkCore.PostgreSQL` (8.0.0)
  - `Microsoft.AspNetCore.Authentication.JwtBearer` (8.0.0)
  - `Swashbuckle.AspNetCore` (6.4.0)

### Frontend (React)
- **Framework**: React 18 with Create React App
- **Styling**: Tailwind CSS 3.3.2
- **Icons**: Lucide React 0.263.1
- **HTTP Client**: Axios 1.4.0
- **Routing**: React Router DOM 6.11.0

### Mobile (React Native)
- **Framework**: React Native with Expo 53.0.22
- **Navigation**: React Navigation 6.x (Stack & Bottom Tabs)
- **Storage**: AsyncStorage for local data persistence
- **UI**: Custom components with LinearGradient
- **Icons**: Expo Vector Icons

## Project Structure

```
playerbet/
├── backend/
│   ├── PlayerBet.Api/
│   │   ├── Controllers/           # API endpoints
│   │   │   ├── BetsController.cs
│   │   │   ├── GamesController.cs
│   │   │   └── UsersController.cs
│   │   ├── Models/               # Data models
│   │   │   ├── User.cs
│   │   │   ├── Bet.cs
│   │   │   ├── BetPick.cs
│   │   │   └── DTOs/            # Data Transfer Objects
│   │   ├── Data/                # Database context
│   │   ├── Services/            # Business logic
│   │   ├── Middleware/          # Error handling
│   │   └── Migrations/          # EF migrations
│   ├── docker-compose.yml
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/              # Main application pages
│   │   │   ├── OnboardingFlow.js
│   │   │   ├── LoginPage.js
│   │   │   ├── SignUpPage.js
│   │   │   └── Dashboard.js
│   │   ├── components/         # Reusable components
│   │   ├── contexts/          # React contexts
│   │   ├── services/          # API services
│   │   └── utils/             # Utility functions
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
├── mobile/
│   ├── src/
│   │   ├── screens/           # Mobile screens
│   │   │   ├── OnboardingScreen.js
│   │   │   ├── LoginScreen.js
│   │   │   ├── SignUpScreen.js
│   │   │   ├── DashboardScreen.js
│   │   │   └── ProfileScreen.js
│   │   ├── context/           # User context
│   │   ├── services/          # API services
│   │   └── utils/             # Constants and utilities
│   ├── App.js
│   ├── package.json
│   └── app.json
└── docker-compose.yml
```

## Core Features

### Betting System
1. **Bet Types**:
   - **Beast Mode**: All picks must win, higher multipliers (3x to 150x)
   - **Safety Play**: Partial payouts allowed, lower multipliers (2.5x to 90x)

2. **Player Props**: 
   - Football: Goals, Assists, Shots on Target
   - Basketball: Points, Rebounds, Assists
   - Tennis, Golf, Cricket (coming soon)

3. **Multiplier System**:
   ```javascript
   // Beast Mode multipliers
   const beastMultipliers = {
     2: 3, 3: 6, 4: 10, 5: 20, 6: 35, 7: 50, 8: 75, 9: 100, 10: 150
   };
   
   // Safety Play multipliers  
   const safetyMultipliers = {
     2: 2.5, 3: 4, 4: 7, 5: 12, 6: 20, 7: 30, 8: 45, 9: 65, 10: 90
   };
   ```

### User Management
- Registration with comprehensive validation (21+ age requirement)
- JWT-based authentication
- User profiles with betting statistics
- Starting balance of $1000 for demo accounts

### Database Schema
- **Users**: Authentication, profile data, balance tracking
- **Bets**: Bet information, types, payouts, status
- **BetPicks**: Individual picks within bets, outcomes
- Foreign key relationships with cascade delete

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration with validation
- `POST /api/users/login` - User authentication
- `POST /api/users/check-availability` - Check email/username availability
- `GET /api/users/{id}` - Get user profile

### Betting
- `POST /api/bets` - Place new bet with validation
- `GET /api/bets/user/{userId}` - Get user's betting history
- `GET /api/bets/{betId}` - Get specific bet details
- `POST /api/bets/calculate-payout` - Calculate potential payout

### Games
- `GET /api/games` - Get available games and player props (mock data)

## Development Setup

### Prerequisites
- Node.js 18+
- .NET 8.0 SDK
- PostgreSQL 14+
- Docker (optional)
- Expo CLI (for mobile development)

### Environment Configuration

**Backend** (`backend/PlayerBet.Api/appsettings.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=PlayerBetDb;Username=postgres;Password=password123;Port=5432"
  }
}
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=https://localhost:7000/api
```

**Mobile** (`mobile/src/utils/Constants.js`):
```javascript
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://10.0.0.247:5001/api'  // Development
    : 'https://your-production-api.com/api'  // Production
};
```

### Running the Application

1. **Database Setup**:
   ```bash
   cd backend
   docker-compose up postgres -d
   ```

2. **Backend**:
   ```bash
   cd backend/PlayerBet.Api
   dotnet restore
   dotnet ef database update
   dotnet run
   ```

3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Mobile**:
   ```bash
   cd mobile
   npm install
   npm start
   ```

## Key Implementation Details

### Backend Architecture
- **Error Handling**: Custom middleware for centralized error handling
- **CORS Policy**: Configured for React app origins
- **Database Migrations**: Auto-migration on development startup
- **Validation**: Comprehensive input validation with custom error messages

### Frontend Features
- **Onboarding Flow**: Multi-screen introduction with animations
- **Betting Interface**: Real-time betting slip with live calculations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Local state with potential for Redux integration

### Mobile Features
- **Cross-Platform**: Single codebase for iOS and Android
- **Native Navigation**: React Navigation with stack and tab navigators
- **Persistent Storage**: AsyncStorage for user session management
- **Native UI Elements**: Custom components with LinearGradient

## Security Considerations
- **Password Hashing**: SHA-256 with salt (note: upgrade to bcrypt recommended for production)
- **Input Validation**: Server-side validation on all endpoints
- **JWT Tokens**: Simplified implementation for demo (enhance for production)
- **Age Verification**: 21+ requirement with date validation

## Deployment

### Docker Deployment
```bash
# Full stack
docker-compose up -d

# Database only
docker-compose up postgres -d
```

### Production Considerations
- Update password hashing to bcrypt
- Implement proper JWT refresh token mechanism
- Add rate limiting and request throttling
- Configure proper HTTPS certificates
- Set up database backup strategy
- Implement logging and monitoring

## Mock Data
The application includes mock data for development:
- Sample football and basketball games
- Player props with realistic statistics
- Historical form data for players
- Demo betting scenarios

## Future Enhancements
- [ ] Real sports API integration
- [ ] Live betting with WebSocket connections
- [ ] Social features and leaderboards
- [ ] Payment gateway integration
- [ ] Advanced analytics dashboard
- [ ] Push notifications for mobile
- [ ] Biometric authentication
- [ ] Multi-language support

## Known Issues/Limitations
1. **Demo Authentication**: Simplified JWT implementation
2. **Mock Data**: Sports data is hardcoded for demo
3. **Production Security**: Password hashing needs enhancement
4. **Error Handling**: Could be more granular in some areas
5. **Testing**: Unit tests not implemented yet

## Development Tips
- Use the debug panel in the web app for troubleshooting
- Check browser console for detailed error logging
- Mobile app includes comprehensive error handling
- Database migrations are automatic in development
- CORS is configured for multiple development ports

This repository demonstrates modern full-stack development practices with a focus on user experience, responsive design, and cross-platform compatibility.