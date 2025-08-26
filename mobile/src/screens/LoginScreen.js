import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { handleLogin } = useUser();

  const handleLoginSubmit = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      setShowError(true);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call with animation
    setTimeout(async () => {
      // Mock successful login for demo purposes
      // In real app, this would be an actual API call
      try {
        const userData = {
          id: Math.floor(Math.random() * 1000),
          firstName: 'Demo',
          lastName: 'User',
          email: email,
          username: email.split('@')[0],
          balance: 1000,
          name: 'Demo User'
        };
        
        const token = 'mock_token_' + Date.now();
        
        await handleLogin(userData, token);
        setIsLoading(false);
        navigation.navigate('Dashboard');
      } catch (error) {
        setIsLoading(false);
        setErrorMessage("Sorry we couldn't find your details. Please double-check or Reset Password");
        setShowError(true);
      }
    }, 2000);
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Forgot password functionality coming soon!');
  };

  const handleRegister = () => {
    navigation.navigate('SignUp');
  };

  const closeError = () => {
    setShowError(false);
  };

  const retryLogin = () => {
    setShowError(false);
    setEmail('');
    setPassword('');
  };

  // Loading Screen (matches web)
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          {/* Animated Logo */}
          <View style={styles.loadingLogoContainer}>
            <View style={styles.loadingLogo}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.loadingArrow1}
              />
              <LinearGradient
                colors={['#059669', '#047857']}
                style={styles.loadingArrow2}
              />
            </View>
          </View>

          <Text style={styles.loadingText}>Logging you in...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header with Logo (matches web) */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#3b82f6" />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#2563eb', '#3b82f6']}
                style={styles.logoIcon}
              >
                <Ionicons name="trophy" size={20} color="white" />
              </LinearGradient>
              <Text style={styles.logoText}>PlayerBet</Text>
            </View>
          </View>

          {/* Avatar Section (matches web) */}
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#374151', '#4b5563']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>A</Text>
            </LinearGradient>
          </View>

          {/* Title and Register Link (matches web) */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Log In</Text>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitleText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.linkText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form (matches web) */}
          <View style={styles.form}>
            {/* Email Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password (matches web) */}
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>
                  Forgot password? Reset
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button (matches web) */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLoginSubmit}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#2563eb', '#1d4ed8']}
              style={styles.loginButtonGradient}
            >
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Demo Credentials (matches web) */}
          <View style={styles.demoCredentials}>
            <Text style={styles.demoLabel}>Demo credentials:</Text>
            <Text style={styles.demoText}>
              Email: demo@playerbet.com{'\n'}
              Password: password123
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Error Modal (matches web) */}
      <Modal
        visible={showError}
        transparent
        animationType="fade"
        onRequestClose={closeError}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModal}>
            <Text style={styles.errorTitle}>
              Incorrect log in details
            </Text>
            <Text style={styles.errorMessage}>
              {errorMessage}
            </Text>
            <View style={styles.errorActions}>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={retryLogin}
              >
                <Text style={styles.retryButtonText}>Re-try</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={closeError}
              >
                <Text style={styles.continueButtonText}>LOGIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
  },

  // Loading Screen
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingLogoContainer: {
    marginBottom: 32,
  },
  loadingLogo: {
    width: 120,
    height: 60,
    position: 'relative',
  },
  loadingArrow1: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderBottomWidth: 50,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#10b981',
    borderRadius: 8,
    transform: [{ rotate: '-30deg' }],
    left: 15,
    top: 5,
  },
  loadingArrow2: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#059669',
    borderRadius: 6,
    transform: [{ rotate: '30deg' }],
    right: 15,
    top: 10,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#e5e7eb',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 40,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  // Avatar
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#4b5563',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#9ca3af',
  },

  // Title
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitleContainer: {
    flexDirection: 'row',
  },
  subtitleText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  // Form
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#e5e7eb',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 8,
    padding: 16,
    color: 'white',
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 8,
    padding: 16,
    paddingRight: 50,
    color: 'white',
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: '#3b82f6',
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  // Login Button
  loginButton: {
    marginBottom: 20,
  },
  loginButtonGradient: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Demo Credentials
  demoCredentials: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  demoLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  demoText: {
    fontSize: 12,
    color: '#e5e7eb',
    lineHeight: 16,
  },

  // Error Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorModal: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  errorActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  retryButton: {
    flex: 1,
    backgroundColor: '#374151',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
};

export default LoginScreen;