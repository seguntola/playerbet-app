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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { authService } from '../services/AuthService';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { handleLogin } = useUser();

  const handleLoginSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        await handleLogin(result.user, result.token);
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Login Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Logging you in...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
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

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#374151', '#4b5563']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>A</Text>
            </LinearGradient>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Log In</Text>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitleText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.linkText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
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
              />
            </View>

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
          </View>

          {/* Login Button */}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
  container: { flex: 1, backgroundColor: '#000' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#9ca3af' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 32 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 20, marginBottom: 40 },
  backButton: { padding: 8, marginRight: 16 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  logoText: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  avatarContainer: { alignItems: 'center', marginBottom: 40 },
  avatar: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#4b5563' },
  avatarText: { fontSize: 48, fontWeight: 'bold', color: '#9ca3af' },
  titleContainer: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  subtitleContainer: { flexDirection: 'row' },
  subtitleText: { color: '#9ca3af', fontSize: 14 },
  linkText: { color: '#3b82f6', fontSize: 14, textDecorationLine: 'underline' },
  form: { marginBottom: 32 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, color: '#e5e7eb', marginBottom: 8 },
  input: { backgroundColor: '#374151', borderWidth: 1, borderColor: '#4b5563', borderRadius: 8, padding: 16, color: 'white', fontSize: 16 },
  passwordContainer: { position: 'relative' },
  passwordInput: { backgroundColor: '#374151', borderWidth: 1, borderColor: '#4b5563', borderRadius: 8, padding: 16, paddingRight: 50, color: 'white', fontSize: 16 },
  eyeButton: { position: 'absolute', right: 16, top: 16 },
  loginButton: { marginBottom: 20 },
  loginButtonGradient: { paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  loginButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
};

export default LoginScreen;
