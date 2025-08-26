import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, API_CONFIG } from '../utils/Constants';

class AuthService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Enhanced fetch wrapper with better error handling
  async apiRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      timeout: this.timeout,
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          await this.clearAuthData();
          throw new Error('Session expired. Please login again.');
        }
        
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        success: true,
        data,
        status: response.status,
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection.');
      }
      
      if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  // Login with enhanced validation and error handling
  async login(email, password) {
    try {
      // Basic validation
      if (!email || !password) {
        return {
          success: false,
          message: 'Email and password are required',
        };
      }

      const response = await this.apiRequest('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.data.user && response.data.token) {
        // Store auth data
        await this.storeAuthData(response.data.user, response.data.token);
        
        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
          message: response.data.message || 'Login successful',
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Invalid login credentials',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed. Please try again.',
      };
    }
  }

  // Register with comprehensive validation
  async register(userData) {
    try {
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'dateOfBirth'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        return {
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`,
        };
      }

      // Format and validate data
      const formattedData = {
        ...userData,
        email: userData.email.toLowerCase().trim(),
        dateOfBirth: new Date(userData.dateOfBirth).toISOString(),
        // Ensure phone number has proper format
        phoneNumber: userData.phoneNumber?.replace(/\D/g, ''),
      };

      const response = await this.apiRequest('/users/register', {
        method: 'POST',
        body: JSON.stringify(formattedData),
      });

      if (response.data.user) {
        // Auto-login after successful registration
        if (response.data.token) {
          await this.storeAuthData(response.data.user, response.data.token);
        }
        
        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
          message: response.data.message || 'Registration successful',
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Registration failed',
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.',
      };
    }
  }

  // Check username/email availability
  async checkAvailability(type, value) {
    try {
      if (!type || !value) {
        throw new Error('Type and value are required');
      }

      const response = await this.apiRequest('/users/check-availability', {
        method: 'POST',
        body: JSON.stringify({ [type]: value }),
      });

      return {
        success: true,
        available: response.data.available,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Availability check error:', error);
      return {
        success: false,
        message: error.message || 'Failed to check availability',
      };
    }
  }

  // Get user profile with caching
  async getUserProfile(userId, forceRefresh = false) {
    try {
      const cacheKey = `user_profile_${userId}`;
      
      // Check cache first unless force refresh
      if (!forceRefresh) {
        const cachedProfile = await AsyncStorage.getItem(cacheKey);
        if (cachedProfile) {
          const { data, timestamp } = JSON.parse(cachedProfile);
          // Cache valid for 5 minutes
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            return { success: true, user: data };
          }
        }
      }

      const response = await this.apiRequest(`/users/${userId}`);
      
      // Cache the result
      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        data: response.data.user,
        timestamp: Date.now(),
      }));

      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch user profile',
      };
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const response = await this.apiRequest(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      // Update cached profile
      const cacheKey = `user_profile_${userId}`;
      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        data: response.data.user,
        timestamp: Date.now(),
      }));

      // Update stored user data if it's the current user
      const currentUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        if (userData.id === userId) {
          await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify({
            ...userData,
            ...response.data.user,
          }));
        }
      }

      return {
        success: true,
        user: response.data.user,
        message: response.data.message || 'Profile updated successfully',
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update profile',
      };
    }
  }

  // Get games with filtering and pagination
  async getGames(filters = {}, page = 1, limit = 20) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const response = await this.apiRequest(`/games?${queryParams}`);
      
      return {
        success: true,
        games: response.data.games,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalCount: response.data.totalCount,
      };
    } catch (error) {
      console.error('Get games error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch games',
        games: [],
      };
    }
  }

  // Get user bets with pagination
  async getUserBets(userId, page = 1, limit = 10, status = null) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
      });

      const response = await this.apiRequest(`/bets/user/${userId}?${queryParams}`);
      
      return {
        success: true,
        bets: response.data.bets,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalCount: response.data.totalCount,
      };
    } catch (error) {
      console.error('Get user bets error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch bets',
        bets: [],
      };
    }
  }

  // Create bet with validation
  async createBet(betData) {
    try {
      // Validate bet data
      if (!betData.picks || !Array.isArray(betData.picks) || betData.picks.length === 0) {
        return {
          success: false,
          message: 'At least one pick is required',
        };
      }

      if (!betData.amount || betData.amount <= 0) {
        return {
          success: false,
          message: 'Valid bet amount is required',
        };
      }

      if (!betData.type || !['BeastMode', 'SafetyPlay'].includes(betData.type)) {
        return {
          success: false,
          message: 'Valid bet type is required',
        };
      }

      const response = await this.apiRequest('/bets', {
        method: 'POST',
        body: JSON.stringify(betData),
      });

      return {
        success: true,
        bet: response.data.bet,
        message: response.data.message || 'Bet placed successfully',
      };
    } catch (error) {
      console.error('Create bet error:', error);
      return {
        success: false,
        message: error.message || 'Failed to place bet',
      };
    }
  }

  // Calculate payout
  async calculatePayout(picks, type, amount) {
    try {
      const response = await this.apiRequest('/bets/calculate-payout', {
        method: 'POST',
        body: JSON.stringify({ picks, type, amount }),
      });

      return {
        success: true,
        payout: response.data.payout,
        multiplier: response.data.multiplier,
      };
    } catch (error) {
      console.error('Calculate payout error:', error);
      return {
        success: false,
        message: error.message || 'Failed to calculate payout',
      };
    }
  }

  // Password reset
  async requestPasswordReset(email) {
    try {
      const response = await this.apiRequest('/users/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      return {
        success: true,
        message: response.data.message || 'Password reset email sent',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send password reset email',
      };
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await this.apiRequest('/users/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      return {
        success: true,
        message: response.data.message || 'Password changed successfully',
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: error.message || 'Failed to change password',
      };
    }
  }

  // Store auth data securely
  async storeAuthData(user, token) {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER_DATA, JSON.stringify(user)],
        [STORAGE_KEYS.USER_TOKEN, token],
      ]);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  // Get stored auth data
  async getAuthData() {
    try {
      const [userData, token] = await AsyncStorage.multiGet([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.USER_TOKEN,
      ]);

      if (userData[1] && token[1]) {
        return {
          user: JSON.parse(userData[1]),
          token: token[1],
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting auth data:', error);
      return null;
    }
  }

  // Clear auth data
  async clearAuthData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.USER_TOKEN,
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      return !!token;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
  }

  // Logout
  async logout() {
    try {
      // Call logout endpoint if available
      try {
        await this.apiRequest('/users/logout', { method: 'POST' });
      } catch (error) {
        // Continue with local logout even if API call fails
        console.log('Logout API call failed, proceeding with local logout');
      }

      // Clear all local data
      await this.clearAuthData();
      
      // Clear any cached data
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('user_profile_') || key.startsWith('cache_'));
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: error.message || 'Failed to logout',
      };
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await this.apiRequest('/users/refresh-token', {
        method: 'POST',
      });

      if (response.data.token) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, response.data.token);
        return {
          success: true,
          token: response.data.token,
        };
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      await this.clearAuthData();
      return {
        success: false,
        message: 'Session expired. Please login again.',
      };
    }
  }

  // Get app configuration
  async getAppConfig() {
    try {
      const response = await this.apiRequest('/config');
      return {
        success: true,
        config: response.data,
      };
    } catch (error) {
      console.error('Get app config error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch app configuration',
      };
    }
  }
}

export const authService = new AuthService();
export default authService;