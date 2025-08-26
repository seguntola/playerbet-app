# PlayerBet Mobile App

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
const API_BASE_URL = 'http://your-backend-url/api';
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

For more details, see the main project README.
