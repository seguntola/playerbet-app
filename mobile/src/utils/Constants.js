import { Platform } from 'react-native';

const getApiUrl = () => {
  if (__DEV__) {
    // Development environment
    if (Platform.OS === 'android') {
      // Android emulator
      return 'http://10.0.2.2:5001/api';
    } else {
      // iOS simulator - replace with your computer's IP address
      // To find your IP: run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
      return 'http://10.0.0.247:5001/api'; // Replace 192.168.1.100 with your actual IP
    }
  } else {
    // Production environment
    return 'https://your-production-api.com/api';
  }
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: getApiUrl(),  // Production URL
  TIMEOUT: 10000,
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'PlayerBet',
  VERSION: '1.0.0',
  BUILD_NUMBER: 1,
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'playerbet_token',
  USER_DATA: 'playerbet_user',
  FIRST_LAUNCH: 'isFirstLaunch',
  BIOMETRIC_ENABLED: 'biometric_enabled',
};

// Bet Types
export const BET_TYPES = {
  BEAST_MODE: 'BeastMode',
  SAFETY_PLAY: 'SafetyPlay',
};

// Bet Status
export const BET_STATUS = {
  PENDING: 'Pending',
  WON: 'Won',
  LOST: 'Lost',
  PARTIALLY_WON: 'Partially_Won',
  CANCELLED: 'Cancelled',
};

// Multipliers for Beast Mode
export const BEAST_MULTIPLIERS = {
  2: 3,
  3: 6,
  4: 10,
  5: 20,
  6: 35,
  7: 50,
  8: 75,
  9: 100,
  10: 150,
};

// Multipliers for Safety Play
export const SAFETY_MULTIPLIERS = {
  2: 2.5,
  3: 4,
  4: 7,
  5: 12,
  6: 20,
  7: 30,
  8: 45,
  9: 65,
  10: 90,
};

// Colors
export const COLORS = {
  PRIMARY: '#2563eb',
  PRIMARY_DARK: '#1d4ed8',
  SECONDARY: '#7c3aed',
  SECONDARY_DARK: '#6d28d9',
  SUCCESS: '#10b981',
  SUCCESS_DARK: '#059669',
  WARNING: '#f59e0b',
  WARNING_DARK: '#d97706',
  ERROR: '#ef4444',
  ERROR_DARK: '#dc2626',
  BLACK: '#000000',
  WHITE: '#ffffff',
  GRAY_400: '#9ca3af',
  GRAY_500: '#6b7280',
  GRAY_600: '#4b5563',
  GRAY_700: '#374151',
  GRAY_800: '#1f2937',
  GRAY_900: '#111827',
};

export default {
  API_CONFIG,
  APP_CONFIG,
  STORAGE_KEYS,
  BET_TYPES,
  BET_STATUS,
  BEAST_MULTIPLIERS,
  SAFETY_MULTIPLIERS,
  COLORS,
};
