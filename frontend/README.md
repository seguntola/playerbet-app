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
- **XSS Protection**: React's built-in XSS protection
- **Secure Authentication**: JWT tokens with proper storage

For more information about the complete PlayerBet platform, see the main project README.
