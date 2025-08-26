# PlayerBet - Full Stack Sports Betting Platform

A complete sports betting application with web frontend, mobile app, and .NET backend.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │    Web App      │    │   Backend API   │
│  (React Native)│    │    (React)      │    │   (.NET Core)   │
│                 │    │                 │    │                 │
│ • iOS App       │    │ • Web Browser   │    │ • Controllers   │
│ • Android App   │────┼─• Responsive UI │────┤ • Services      │
│ • Expo Runtime  │    │ • PWA Ready     │    │ • Database      │
│                 │    │                 │    │ • Authentication│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │    Database     │
                    └─────────────────┘
```

## 🚀 Getting Started

### Backend (.NET API)
```bash
cd backend
dotnet run --project PlayerBet.Api
```

### Frontend (React Web App)
```bash
cd frontend
npm install
npm start
```

### Mobile (React Native)
```bash
cd mobile
npm install
npm start
```

## 📱 Mobile App Features

- ✅ **Cross-platform** - iOS and Android
- ✅ **Native performance** - Built with React Native/Expo
- ✅ **Shared backend** - Same API as web app
- ✅ **Complete betting interface** - Player props, betting slip, multiple bet modes
- ✅ **User authentication** - Login, registration, session management
- ✅ **User profiles** - Betting history, statistics, account management
- ✅ **Modern UI/UX** - Dark theme, animations, responsive design

## 🛠️ Tech Stack

### Frontend
- **Web**: React 18, JavaScript, CSS
- **Mobile**: React Native, Expo

### Backend
- **.NET Core 8** - RESTful API
- **PostgreSQL** - Database
- **Entity Framework Core** - ORM
- **JWT Authentication**

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📂 Project Structure

```
playerbet/
├── 📁 backend/           # .NET Core API
│   ├── PlayerBet.Api/
│   ├── docker-compose.yml
│   └── Dockerfile
├── 📁 frontend/          # React Web App
│   ├── src/
│   ├── public/
│   └── package.json
├── 📁 mobile/           # React Native Mobile App
│   ├── src/
│   │   ├── screens/     # App screens
│   │   ├── services/    # API layer
│   │   ├── context/     # State management
│   │   └── utils/       # Helpers
│   ├── App.js
│   └── package.json
└── README.md
```

## 🔧 Development Setup

### Prerequisites
- Node.js 16+
- .NET 8 SDK
- PostgreSQL
- Expo CLI (for mobile)

### Environment Variables
Create `.env` files in each directory:

**Backend**:
```env
ConnectionString=Host=localhost;Database=PlayerBetDb;Username=your_user;Password=your_password
JWT_SECRET=your_jwt_secret_key
```

**Mobile** (optional):
```env
API_BASE_URL=http://localhost:5000/api
```

## 🚦 Running the Full Stack

1. **Start Database**:
   ```bash
   cd backend
   docker-compose up postgres
   ```

2. **Start Backend**:
   ```bash
   cd backend
   dotnet run --project PlayerBet.Api
   ```

3. **Start Web Frontend**:
   ```bash
   cd frontend
   npm start
   ```

4. **Start Mobile App**:
   ```bash
   cd mobile
   npm start
   ```

## 📱 Mobile Development

### Running on Device/Emulator
- **iOS**: Requires macOS with Xcode
- **Android**: Requires Android Studio or physical device
- **Development**: Use Expo Go app for quick testing

### Building for Production
```bash
cd mobile
expo build:android  # Android APK/AAB
expo build:ios      # iOS IPA
```

## 🔐 Authentication Flow

1. User registers/logs in via web or mobile
2. Backend issues JWT token
3. Token stored locally (localStorage/AsyncStorage)
4. Token sent with API requests
5. Backend validates token for protected routes

## 🎯 Key Features

### Betting System
- **Beast Mode**: High risk, high reward betting
- **Safety Play**: More forgiving with partial payouts
- **Player Props**: Bet on individual player statistics
- **Live Updates**: Real-time game and odds updates

### User Management
- User registration and authentication
- Profile management
- Betting history and statistics
- Balance tracking

## 🚀 Deployment

### Backend
- Deploy to cloud platforms (Azure, AWS, Google Cloud)
- Use Docker containers for consistent deployment
- Configure PostgreSQL database connection

### Frontend Web
- Build: `npm run build`
- Deploy to static hosting (Netlify, Vercel, AWS S3)

### Mobile App
- **iOS**: Submit to App Store via App Store Connect
- **Android**: Publish to Google Play Store
- **OTA Updates**: Use Expo's over-the-air update system

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/{id}` - Get user profile

### Betting
- `POST /api/bets` - Create new bet
- `GET /api/bets/user/{userId}` - Get user's bets
- `POST /api/bets/calculate-payout` - Calculate potential payout

### Games
- `GET /api/games` - Get available games and player props

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb)
- **Secondary**: Purple (#7c3aed)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)
- **Background**: Black (#000000)
- **Surface**: Dark Gray (#1f2937)

### Typography
- **Headings**: Bold, high contrast
- **Body**: Medium weight, good readability
- **Labels**: Small, muted colors

## 📊 Future Enhancements

- [ ] Push notifications for bet results
- [ ] Social features (friend betting, leaderboards)
- [ ] Advanced analytics and insights
- [ ] Live streaming integration
- [ ] Cryptocurrency payments
- [ ] Multi-language support
- [ ] Biometric authentication (mobile)

## 📞 Support

For questions and support:
- Create an issue in this repository
- Check the documentation in each project folder
- Review the API documentation

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using React, React Native, and .NET Core
