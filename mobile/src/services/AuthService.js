import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update this URL to match your backend API
const API_BASE_URL = 'http://localhost:5000/api';  // Production URL

class AuthService {
  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor to add auth token
    axios.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('playerbet_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor to handle auth errors
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.multiRemove(['playerbet_token', 'playerbet_user']);
          // Navigate to login screen
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password,
      });

      if (response.user && response.token) {
        return {
          success: true,
          user: response.user,
          token: response.token,
        };
      } else {
        return {
          success: false,
          message: response.message || 'Login failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.message || 'Network error. Please try again.',
      };
    }
  }

  async register(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, {
        ...userData,
        dateOfBirth: new Date(userData.dateOfBirth).toISOString(),
      });

      if (response.data.user) {
        return {
          success: true,
          user: response.data.user,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Registration failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  }

  async checkAvailability(data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/check-availability`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to check availability');
    }
  }

  async getUserProfile(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  }

  async getGames() {
    try {
      const response = await axios.get(`${API_BASE_URL}/games`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch games');
    }
  }

  async getUserBets(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/bets/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user bets');
    }
  }

  async createBet(betData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/bets`, betData);
      return {
        success: true,
        bet: response.data.bet,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create bet',
      };
    }
  }

  async calculatePayout(picks, type, amount) {
    try {
      const response = await axios.post(`${API_BASE_URL}/bets/calculate-payout`, {
        picks,
        type,
        amount,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to calculate payout');
    }
  }
}

export const authService = new AuthService();
