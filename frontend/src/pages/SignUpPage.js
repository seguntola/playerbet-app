import React, { useState } from 'react';
import { Trophy, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';

// Simple Input Component - OUTSIDE the main component so it doesn't get redefined
const SimpleInput = ({ label, type = 'text', value, onChange, placeholder, error }) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{
      display: 'block',
      color: '#e5e7eb',
      fontSize: '14px',
      marginBottom: '8px'
    }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '12px',
        backgroundColor: '#374151',
        border: '1px solid ' + (error ? '#ef4444' : '#4b5563'),
        borderRadius: '8px',
        color: 'white',
        fontSize: '16px',
        outline: 'none',
        boxSizing: 'border-box'
      }}
    />
    {error && (
      <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
        {error}
      </div>
    )}
  </div>
);

const SignUpFlow = ({ onSignUp, onLogin, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Simple individual state variables - same pattern that works
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (!firstName) newErrors.firstName = 'First name is required';
        if (!lastName) newErrors.lastName = 'Last name is required';
        if (!phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        break;
      case 1:
        if (!email) newErrors.email = 'Email is required';
        if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!address) newErrors.address = 'Address is required';
        if (!state) newErrors.state = 'State is required';
        break;
      case 4:
        if (!username) newErrors.username = 'Username is required';
        if (!password) newErrors.password = 'Password is required';
        if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
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

  const completeSignUp = () => {
    if (onSignUp) {
      onSignUp({
        firstName,
        lastName,
        phoneNumber,
        referralCode,
        email,
        dateOfBirth,
        address,
        state,
        country,
        username,
        password,
        name: firstName + ' ' + lastName
      });
    }
  };

  // Status Bar
  const StatusBar = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 24px',
      fontSize: '14px',
      color: 'white'
    }}>
      <span style={{ fontWeight: '600' }}>9:27</span>
      <div>📶🔋</div>
    </div>
  );

  // Header
  const Header = ({ title, showBack = true }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '20px 24px',
      borderBottom: '1px solid #374151'
    }}>
      {showBack && (
        <button
          onClick={prevStep}
          style={{
            background: 'none',
            border: 'none',
            color: '#3b82f6',
            cursor: 'pointer',
            marginRight: '16px',
            padding: '4px'
          }}
        >
          <ArrowLeft size={24} />
        </button>
      )}
      <h1 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: 'white',
        margin: 0
      }}>
        {title}
      </h1>
    </div>
  );

  // Loading Screen
  if (isLoading) {
    const messages = ['All set! Let\'s get right into it.', 'Getting you verified.', 'Complete!'];

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', color: 'white' }}>
        <StatusBar />
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '40px',
          minHeight: 'calc(100vh - 50px)'
        }}>
          <div style={{ marginBottom: '32px', fontSize: '48px' }}>🎉</div>
          <h2 style={{ fontSize: '18px', fontWeight: '500', margin: 0, color: '#e5e7eb', textAlign: 'center' }}>
            {messages[loadingStep]}
          </h2>
        </div>
      </div>
    );
  }

  // Step 0: Get Started
  if (currentStep === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', color: 'white' }}>
        <StatusBar />
        <Header title="Create an account" showBack={false} />
        
        <div style={{ padding: '32px 24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #2563eb'
            }}>
              <span style={{ fontSize: '48px', fontWeight: 'bold', color: 'white' }}>A</span>
            </div>
          </div>

          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Get Started</h2>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Sign up to get the most out of PlayerBet</p>
          </div>

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
            type="tel"
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

          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '24px', lineHeight: '1.4' }}>
            By proceeding, you agree to our Terms & Conditions and Privacy Policy
          </div>

          <button
            onClick={nextStep}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Basic Information
  if (currentStep === 1) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', color: 'white' }}>
        <StatusBar />
        <Header title="Create an account" />
        
        <div style={{ padding: '32px 24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Basic Information</h2>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Let's get to know you, shall we?</p>
          </div>

          <SimpleInput
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="john@gmail.com"
            error={errors.email}
          />

          <SimpleInput
            label="Date of Birth"
            type="date"
            value={dateOfBirth}
            onChange={setDateOfBirth}
            error={errors.dateOfBirth}
          />

          <div style={{ padding: '12px', backgroundColor: '#7c2d12', borderRadius: '8px', marginBottom: '20px', fontSize: '12px', color: '#fca5a5' }}>
            You must be 21 or older to play
          </div>

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

          <button
            onClick={nextStep}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Step 2: OTP Verification Setup
  if (currentStep === 2) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', color: 'white' }}>
        <StatusBar />
        <Header title="Create an account" />
        
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>OTP Verification</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
            We have sent a verification code to<br />
            <strong style={{ color: 'white' }}>{phoneNumber}</strong>
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#374151',
                  border: '2px solid #4b5563',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}
              >
                {otpCode[index] || ''}
              </div>
            ))}
          </div>

          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
            Didn't receive a code? Request in 00:58
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '240px', margin: '0 auto 32px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleOtpInput(num.toString())}
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'transparent',
                  border: '2px solid #4b5563',
                  borderRadius: '50%',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {num}
              </button>
            ))}
            <button onClick={() => handleOtpInput('*')} style={{ width: '60px', height: '60px', backgroundColor: 'transparent', border: '2px solid #4b5563', borderRadius: '50%', color: 'white', fontSize: '20px', cursor: 'pointer' }}>*</button>
            <button onClick={() => handleOtpInput('0')} style={{ width: '60px', height: '60px', backgroundColor: 'transparent', border: '2px solid #4b5563', borderRadius: '50%', color: 'white', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>0</button>
            <button onClick={clearOtp} style={{ width: '60px', height: '60px', backgroundColor: 'transparent', border: '2px solid #4b5563', borderRadius: '50%', color: 'white', fontSize: '16px', cursor: 'pointer' }}>⌫</button>
          </div>

          <button
            onClick={verifyOtp}
            disabled={otpCode.length < 5}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: otpCode.length === 5 ? '#2563eb' : '#4b5563',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: otpCode.length === 5 ? 'pointer' : 'not-allowed'
            }}
          >
            Verify
          </button>
        </div>
      </div>
    );
  }

  // Step 3: OTP Verification Success  
  if (currentStep === 3) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', color: 'white' }}>
        <StatusBar />
        <Header title="Create an account" />
        
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>OTP Verification</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
            We have sent a verification code to<br />
            <strong style={{ color: 'white' }}>{phoneNumber}</strong>
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#ef4444',
                  border: '2px solid #ef4444',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              >
                {num}
              </div>
            ))}
          </div>

          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
            Not your account? <button style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>Log out</button>
          </p>

          <button
            onClick={nextStep}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Verify
          </button>
        </div>
      </div>
    );
  }

  // Step 4: Almost Done
  if (currentStep === 4) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', color: 'white' }}>
        <StatusBar />
        <Header title="Create an account" />
        
        <div style={{ padding: '32px 24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Almost done</h2>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Secure your account</p>
          </div>

          <SimpleInput
            label="Username"
            value={username}
            onChange={setUsername}
            placeholder="johndoe"
            error={errors.username}
          />

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#e5e7eb', fontSize: '14px', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '12px',
                  paddingRight: '48px',
                  backgroundColor: '#374151',
                  border: '1px solid ' + (errors.password ? '#ef4444' : '#4b5563'),
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.password}
              </div>
            )}
          </div>

          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '24px', lineHeight: '1.4' }}>
            • Upper and lower case letters<br />
            • Between 8 to 64 characters<br />
            • Combination of symbols
          </div>

          <div style={{ padding: '12px', backgroundColor: '#1f2937', borderRadius: '8px', marginBottom: '24px', fontSize: '12px', color: '#9ca3af', lineHeight: '1.4' }}>
            📋 By creating an account you agree to our Terms and Conditions & Privacy Policy which includes how we can use, share & store your personal information.
          </div>

          <button
            onClick={nextStep}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Step 5: Success Screen
  if (currentStep === 5) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <StatusBar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', backgroundColor: '#059669', borderRadius: '50%', marginBottom: '32px' }}>
            <Check size={60} color="white" />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', lineHeight: '1.3' }}>
            Your phone number has been verified successfully.
          </h2>

          <button
            onClick={completeSignUp}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '16px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '32px'
            }}
          >
            Continue to App
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default SignUpFlow;