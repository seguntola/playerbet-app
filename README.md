# PlayerBet Frontend

Modern React web application for the PlayerBet sports betting platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and concurrent features
- **Tailwind CSS 3.3.2** - Utility-first CSS framework
- **Lucide React 0.263.1** - Beautiful SVG icons
- **Axios 1.4.0** - Promise-based HTTP client
- **React Router DOM 6.11.0** - Client-side routing

## 📁 Project Structure

```
src/
├── pages/              # Main application pages
│   ├── OnboardingFlow.js   # Multi-screen onboarding
│   ├── LoginPage.js        # User login interface
│   ├── SignUpPage.js       # User registration flow
│   └── Dashboard.js        # Main betting interface
├── components/         # Reusable UI components
├── contexts/          # React context providers
├── services/          # API service layer
├── utils/            # Utility functions
└── styles/           # CSS and styling files
```

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
- **Real-time Calculations**: Live payout calculations

### User Experience
- **Dark Theme**: Modern dark mode interface
- **Animations**: Smooth transitions and interactions
- **Real-time Updates**: Live betting slip updates
- **Form Validation**: Comprehensive client-side validation

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_WEBSOCKET_URL=ws://localhost:5001/hub
```

### API Configuration

The app connects to the backend API running on `http://localhost:5000/api` by default. Update the `API_BASE_URL` in `src/App.js` if your backend runs on a different port.

## 📱 Responsive Design

The application is built mobile-first and works seamlessly across:
- **Desktop**: Full-featured betting interface
- **Tablet**: Optimized layout for touch interaction
- **Mobile**: Complete mobile experience

## 🎨 Styling

### Tailwind CSS Configuration

Custom configuration in `tailwind.config.js` includes:

- **Custom Colors**: PlayerBet brand colors
- **Extended Animations**: Bounce, pulse effects
- **Custom Shadows**: Neon glow effects for buttons
- **Responsive Breakpoints**: Mobile-first design

### Design System

```javascript
// Brand Colors
playerbet-blue: '#2563eb'
playerbet-purple: '#7c3aed' 
playerbet-green: '#10b981'
playerbet-yellow: '#f59e0b'

// Component Classes
.neon-blue { box-shadow: 0 0 20px rgba(37, 99, 235, 0.5); }
.neon-purple { box-shadow: 0 0 20px rgba(124, 58, 237, 0.5); }
.neon-green { box-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }
```

## 🔌 API Integration

The frontend communicates with the .NET backend API:

### Authentication Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `POST /api/users/check-availability` - Validate email/username

### Betting Endpoints
- `GET /api/games` - Fetch available games and props
- `POST /api/bets` - Place new bet
- `GET /api/bets/user/{userId}` - Get user's betting history
- `POST /api/bets/calculate-payout` - Calculate potential winnings

## 🧪 Development

### Available Scripts

- `npm start` - Start development server (port 3000)
- `npm run build` - Create production build
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (not recommended)

### Development Tools

- **Hot Reload**: Automatic refresh on code changes
- **Error Overlay**: Development error display
- **Source Maps**: Debug with original source code
- **ESLint**: Code linting and formatting

### Debugging

The app includes a debug panel in development mode that shows:
- Navigation state changes
- API request/response logging
- User authentication status
- Error tracking

## 🏗️ Build & Deployment

### Production Build

```bash
npm run build
```

Creates optimized production build in the `build/` folder with:
- Minified JavaScript and CSS
- Optimized images and assets
- Service worker for caching
- Source maps for debugging

### Deployment Options

- **Static Hosting**: Netlify, Vercel, AWS S3
- **CDN**: Cloudflare, AWS CloudFront
- **Docker**: Multi-stage build with nginx

### Environment-Specific Builds

- **Development**: Full debugging, hot reload
- **Staging**: Production build with staging API
- **Production**: Optimized build with production API

## 🔐 Security

- **Input Validation**: All forms include client-side validation
- **XSS Protection**: React's built-in XSS protection
- **HTTPS Ready**: Production builds support HTTPS
- **Secure Authentication**: JWT tokens with proper storage

## 📊 Performance

### Optimization Features
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Optimized image loading
- **Lazy Loading**: Components loaded on demand
- **Caching**: Browser caching for static assets

### Bundle Analysis
```bash
npm run build
npx serve -s build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Submit a pull request

## 📝 License

This project is part of the PlayerBet platform and follows the main project's MIT license.

---

For more information about the complete PlayerBet platform, see the main project README.