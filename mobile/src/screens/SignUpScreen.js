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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUser } from '../context/UserContext';
import { API_CONFIG } from '../utils/Constants';

const SimpleInput = ({ label, type = 'default', value, onChange, placeholder, error }) => (
  <View style={{ marginBottom: 20 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      keyboardType={type}
      secureTextEntry={type === 'password'}
      autoCapitalize={type === 'email' ? 'none' : 'words'}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// Date validation function - much simpler now!
const validateDateOfBirth = (date) => {
  if (!date) return 'Date of birth is required';
  
  // Check if user is at least 21 years old
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  const dayDiff = today.getDate() - date.getDate();
  
  let actualAge = age;
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    actualAge--;
  }
  
  if (actualAge < 21) return 'You must be 21 or older to register';
  
  // Check if date is not in the future
  if (date > today) return 'Date of birth cannot be in the future';
  
  // Check if date is reasonable (not too far in the past)
  if (today.getFullYear() - date.getFullYear() > 120) {
    return 'Please enter a valid date of birth';
  }
  
  return null;
};

// Format date for display
const formatDate = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const SignUpScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const {handleSignup } = useUser();

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (!firstName.trim()) newErrors.firstName = 'First name is required';
        if (!lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        break;
      case 1:
        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        
        const dobError = validateDateOfBirth(dateOfBirth);
        if (dobError) newErrors.dateOfBirth = dobError;
        
        if (!address.trim()) newErrors.address = 'Address is required';
        if (!state.trim()) newErrors.state = 'State is required';
        break;
      case 4:
        if (!username.trim()) newErrors.username = 'Username is required';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 4) {
        startLoadingSequence();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({}); // Clear errors when going back
  };

  const startLoadingSequence = () => {
    setIsLoading(true);
    setLoadingStep(0);
    
    setTimeout(() => {
      setLoadingStep(1);
      setTimeout(() => {
        setLoadingStep(2);
        setTimeout(() => {
          setIsLoading(false);
          setCurrentStep(5);
        }, 2000);
      }, 2000);
    }, 2000);
  };

  const handleOtpInput = (digit) => {
    if (otpCode.length < 5) {
      setOtpCode(otpCode + digit);
    }
  };

  const clearOtp = () => {
    setOtpCode(otpCode.slice(0, -1));
  };

  const verifyOtp = () => {
    if (otpCode.length === 5) {
      nextStep();
    }
  };

  // Handle date picker change
  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      // Clear any existing date error
      if (errors.dateOfBirth) {
        setErrors(prev => ({ ...prev, dateOfBirth: null }));
      }
    }
  };

  const completeSignUp = async () => {
    try {      
      
      if (!dateOfBirth) {
        Alert.alert('Error', 'Please select your date of birth.');
        return;
      }

      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        referralCode: referralCode.trim() || undefined,
        email: email.trim().toLowerCase(),
        dateOfBirth: dateOfBirth.toISOString(), // Already a proper Date object
        address: address.trim(),
        state: state.trim(),
        country: country.trim(),
        username: username.trim(),
        password,
        name: `${firstName.trim()} ${lastName.trim()}`,
        id: Math.floor(Math.random() * 1000), // Mock ID
        balance: 1000
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log(`📊 Login API response status: ${response.status}`);

      const result = await response.json();
      console.log(`📋 Login API result:`, result);

      if (response.ok && result.user && result.user.id) {
        const userWithId = {
          id: result.user.id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          username: result.user.username,
          balance: result.user.balance,
          name: result.user.name || `${result.user.firstName} ${result.user.lastName}`
        };
        
        console.log(`✅ Login successful for user ID: ${userWithId.id}`);
        
        // Use the context's handleLogin which stores data in AsyncStorage
        await handleSignup(userWithId);
        
        setIsLoading(false);
        navigation.navigate('Dashboard');
      } else {
        setIsLoading(false);
        setErrorMessage(result.message || "Sorry we couldn't find your details. Please double-check or Reset Password");
        setShowError(true);
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('Network error. Please check your connection and try again.');
      setShowError(true);
    }
  };

  const Header = ({ title, showBack = true }) => (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity style={styles.backButton} onPress={prevStep}>
          <Ionicons name="arrow-back" size={24} color="#3b82f6" />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );

  // Loading Screen
  if (isLoading) {
    const messages = ['All set! Let\'s get right into it.', 'Getting you verified.', 'Complete!'];

    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 32 }}>🎉</Text>
          <Text style={styles.loadingText}>{messages[loadingStep]}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Step 0: Get Started
  if (currentStep === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Create an account" showBack={false} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#3b82f6', '#1d4ed8']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>A</Text>
              </LinearGradient>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Get Started</Text>
              <Text style={styles.subtitle}>Sign up to get the most out of PlayerBet</Text>
            </View>

            <SimpleInput
              label="First Name"
              value={firstName}
              onChange={setFirstName}
              placeholder="John"
              error={errors.firstName}
            />

            <SimpleInput
              label="Last Name"
              value={lastName}
              onChange={setLastName}
              placeholder="Doe"
              error={errors.lastName}
            />

            <SimpleInput
              label="Phone Number"
              type="phone-pad"
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder="+234"
              error={errors.phoneNumber}
            />

            <SimpleInput
              label="Referral Code (Optional)"
              value={referralCode}
              onChange={setReferralCode}
              placeholder="ABC123"
            />

            <Text style={styles.disclaimer}>
              By proceeding, you agree to our Terms & Conditions and Privacy Policy
            </Text>

            <TouchableOpacity style={styles.continueButton} onPress={nextStep}>
              <LinearGradient colors={['#2563eb', '#1d4ed8']} style={styles.gradientButton}>
                <Text style={styles.buttonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Step 1: Basic Information with Date Picker
  if (currentStep === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Create an account" />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Basic Information</Text>
              <Text style={styles.subtitle}>Let's get to know you, shall we?</Text>
            </View>

            <SimpleInput
              label="Email"
              type="email-address"
              value={email}
              onChange={setEmail}
              placeholder="john@gmail.com"
              error={errors.email}
            />

            {/* Date Picker Section */}
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.label}>Date of Birth</Text>
              
              <TouchableOpacity 
                style={[styles.datePickerButton, errors.dateOfBirth && styles.inputError]}
                onPress={() => setShowDatePicker(true)}
              >
                <View style={styles.datePickerContent}>
                  <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
                  <Text style={[styles.datePickerText, dateOfBirth && styles.datePickerTextSelected]}>
                    {dateOfBirth ? formatDate(dateOfBirth) : 'Select your date of birth'}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
              </TouchableOpacity>
              
              {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}
            </View>

            {/* Date Picker Modal */}
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth || new Date(2000, 0, 1)} // Default to Jan 1, 2000
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()} // Can't select future dates
                minimumDate={new Date(1900, 0, 1)} // Reasonable minimum date
                textColor="white"
                accentColor="#2563eb"
                themeVariant="dark"
              />
            )}
            
            {/* iOS Date Picker Done Button */}
            {showDatePicker && Platform.OS === 'ios' && (
              <View style={styles.datePickerActions}>
                <TouchableOpacity 
                  style={styles.datePickerDoneButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.datePickerDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>You must be 21 or older to play</Text>
            </View>

            <SimpleInput
              label="Home address"
              value={address}
              onChange={setAddress}
              placeholder="10, Riverside Street"
              error={errors.address}
            />

            <SimpleInput
              label="State"
              value={state}
              onChange={setState}
              placeholder="Lagos"
              error={errors.state}
            />

            <SimpleInput
              label="Country"
              value={country}
              onChange={setCountry}
              placeholder="Nigeria"
            />

            <TouchableOpacity style={styles.continueButton} onPress={nextStep}>
              <LinearGradient colors={['#2563eb', '#1d4ed8']} style={styles.gradientButton}>
                <Text style={styles.buttonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Step 2: OTP Verification Setup
  if (currentStep === 2) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Create an account" />
        
        <View style={styles.otpContainer}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.otpSubtitle}>
            We have sent a verification code to{'\n'}
            <Text style={styles.phoneHighlight}>{phoneNumber}</Text>
          </Text>

          {/* OTP Input Display */}
          <View style={styles.otpInputContainer}>
            {[0, 1, 2, 3, 4].map((index) => (
              <View key={index} style={styles.otpInput}>
                <Text style={styles.otpDigit}>{otpCode[index] || ''}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.otpTimer}>
            Didn't receive a code? Request in 00:58
          </Text>

          {/* Number Pad */}
          <View style={styles.numberPad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.numberButton}
                onPress={() => handleOtpInput(num.toString())}
              >
                <Text style={styles.numberButtonText}>{num}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.numberButton} 
              onPress={() => handleOtpInput('*')}
            >
              <Text style={styles.numberButtonText}>*</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.numberButton} 
              onPress={() => handleOtpInput('0')}
            >
              <Text style={styles.numberButtonText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.numberButton} onPress={clearOtp}>
              <Ionicons name="backspace" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.verifyButton, otpCode.length < 5 && styles.disabledButton]} 
            onPress={verifyOtp}
            disabled={otpCode.length < 5}
          >
            <Text style={[styles.buttonText, otpCode.length < 5 && styles.disabledButtonText]}>
              Verify
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Step 3: OTP Verification Success  
  if (currentStep === 3) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Create an account" />
        
        <View style={styles.otpContainer}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.otpSubtitle}>
            We have sent a verification code to{'\n'}
            <Text style={styles.phoneHighlight}>{phoneNumber}</Text>
          </Text>

          {/* Filled OTP Display */}
          <View style={styles.otpInputContainer}>
            {[1, 2, 3, 4, 5].map((num) => (
              <View key={num} style={[styles.otpInput, styles.otpInputFilled]}>
                <Text style={styles.otpDigitFilled}>{num}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.otpTimer}>
            Not your account? <Text style={styles.linkText}>Log out</Text>
          </Text>

          <TouchableOpacity style={styles.verifyButton} onPress={nextStep}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Step 4: Almost Done
  if (currentStep === 4) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Create an account" />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Almost done</Text>
              <Text style={styles.subtitle}>Secure your account</Text>
            </View>

            <SimpleInput
              label="Username"
              value={username}
              onChange={setUsername}
              placeholder="johndoe"
              error={errors.username}
            />

            {/* Password with eye toggle */}
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { paddingRight: 48 }, errors.password && styles.inputError]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••••••"
                  placeholderTextColor="#9ca3af"
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
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementText}>• Upper and lower case letters</Text>
              <Text style={styles.requirementText}>• Between 8 to 64 characters</Text>
              <Text style={styles.requirementText}>• Combination of symbols</Text>
            </View>

            <View style={styles.termsBox}>
              <Text style={styles.termsText}>
                📋 By creating an account you agree to our Terms and Conditions & Privacy Policy which includes how we can use, share & store your personal information.
              </Text>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={nextStep}>
              <LinearGradient colors={['#2563eb', '#1d4ed8']} style={styles.gradientButton}>
                <Text style={styles.buttonText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Step 5: Success Screen
  if (currentStep === 5) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={60} color="white" />
        </View>

        <Text style={styles.successTitle}>
          Your phone number has been verified successfully.
        </Text>

        <TouchableOpacity style={styles.completeButton} onPress={completeSignUp}>
          <LinearGradient colors={['#2563eb', '#1d4ed8']} style={styles.gradientButton}>
            <Text style={styles.buttonText}>Continue to App</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return null;
};

const styles = {
  container: { flex: 1, backgroundColor: '#000' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  loadingText: { fontSize: 18, color: '#e5e7eb', textAlign: 'center' },
  scrollContent: { flexGrow: 1, padding: 24 },
  
  // Header
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#374151' },
  backButton: { marginRight: 16, padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: 'white' },
  
  // Avatar
  avatarContainer: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#2563eb' },
  avatarText: { fontSize: 48, fontWeight: 'bold', color: 'white' },
  
  // Text
  titleContainer: { marginBottom: 24, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center' },
  
  // Form
  label: { fontSize: 14, color: '#e5e7eb', marginBottom: 8 },
  input: { backgroundColor: '#374151', borderWidth: 1, borderColor: '#4b5563', borderRadius: 8, padding: 12, color: 'white', fontSize: 16 },
  inputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4 },
  disclaimer: { fontSize: 12, color: '#9ca3af', lineHeight: 16, marginBottom: 24 },
  
  // Date Picker
  datePickerButton: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  datePickerText: {
    color: '#9ca3af',
    fontSize: 16,
    marginLeft: 8,
  },
  datePickerTextSelected: {
    color: 'white',
  },
  datePickerActions: {
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },
  datePickerDoneButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  datePickerDoneText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Password
  passwordContainer: { position: 'relative' },
  eyeButton: { position: 'absolute', right: 12, top: 12 },
  passwordRequirements: { marginBottom: 24 },
  requirementText: { fontSize: 12, color: '#9ca3af', marginBottom: 4 },
  
  // Buttons
  continueButton: { marginBottom: 20 },
  gradientButton: { paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  
  // Warning/Terms boxes
  warningBox: { padding: 12, backgroundColor: '#7c2d12', borderRadius: 8, marginBottom: 20 },
  warningText: { fontSize: 12, color: '#fca5a5' },
  termsBox: { padding: 12, backgroundColor: '#1f2937', borderRadius: 8, marginBottom: 24, borderWidth: 1, borderColor: '#374151' },
  termsText: { fontSize: 12, color: '#9ca3af', lineHeight: 16 },
  
  // OTP
  otpContainer: { flex: 1, padding: 24, alignItems: 'center' },
  otpSubtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center', marginBottom: 32 },
  phoneHighlight: { color: 'white', fontWeight: 'bold' },
  otpInputContainer: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  otpInput: { width: 48, height: 48, backgroundColor: '#374151', borderWidth: 2, borderColor: '#4b5563', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  otpInputFilled: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  otpDigit: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  otpDigitFilled: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  otpTimer: { fontSize: 14, color: '#9ca3af', marginBottom: 32 },
  linkText: { color: '#3b82f6' },
  
  // Number Pad
  numberPad: { flexDirection: 'row', flexWrap: 'wrap', maxWidth: 240, marginBottom: 32, gap: 20 },
  numberButton: { width: 60, height: 60, backgroundColor: 'transparent', borderWidth: 2, borderColor: '#4b5563', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  numberButtonText: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  
  // Verify button
  verifyButton: { width: '100%', paddingVertical: 16, backgroundColor: '#2563eb', borderRadius: 8, alignItems: 'center' },
  disabledButton: { backgroundColor: '#4b5563' },
  disabledButtonText: { color: '#9ca3af' },
  
  // Success
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: '#000' },
  successIcon: { width: 120, height: 120, backgroundColor: '#059669', borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center', lineHeight: 30, maxWidth: 360, marginBottom: 32 },
  completeButton: { width: '100%', maxWidth: 300 },
};

export default SignUpScreen;