import React, { useState } from 'react';
import { Trophy, Eye, EyeOff } from 'lucide-react';

const LoginFlow = ({ onLogin, onSignUp, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      setShowError(true);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate login validation (replace with real API call)
    //   if (email === 'demo@playerbet.com' && password === 'password123') {
    //     // Success - navigate to dashboard
    //     onLogin({ email, name: 'Demo User' });
    //   } else {
    //     // Show error
    //     setErrorMessage("Sorry we couldn't find your details. Please double-check or Reset Password");
    //     setShowError(true);
    //   }
    onLogin({ email, password, name: 'Demo User' });

    }, 2000);
  };

  const handleForgotPassword = () => {
    alert('Forgot password functionality coming soon!');
  };

  const handleRegister = () => {
    if (onSignUp) onSignUp();
  };

  const closeError = () => {
    setShowError(false);
  };

  const retryLogin = () => {
    setShowError(false);
    setEmail('');
    setPassword('');
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {/* Loading Animation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '120px',
            height: '60px',
            position: 'relative'
          }}>
            {/* Animated Green Arrow */}
            <div style={{
              width: '0',
              height: '0',
              borderLeft: '30px solid transparent',
              borderRight: '30px solid transparent',
              borderBottom: '50px solid #10b981',
              borderRadius: '8px',
              transform: 'rotate(-30deg)',
              animation: 'bounce 1s infinite',
              position: 'absolute',
              left: '15px',
              top: '5px'
            }}></div>
            <div style={{
              width: '0',
              height: '0',
              borderLeft: '25px solid transparent',
              borderRight: '25px solid transparent',
              borderBottom: '40px solid #059669',
              borderRadius: '6px',
              transform: 'rotate(30deg)',
              animation: 'bounce 1s infinite 0.3s',
              position: 'absolute',
              right: '15px',
              top: '10px'
            }}></div>
          </div>
        </div>

        <h2 style={{
          fontSize: '18px',
          fontWeight: '500',
          margin: 0,
          color: '#e5e7eb'
        }}>
          Logging you in...
        </h2>

        <style>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0) rotate(-30deg); }
            40% { transform: translateY(-20px) rotate(-30deg); }
            60% { transform: translateY(-10px) rotate(-30deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '40px 32px 32px',
        maxWidth: '480px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Header with Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '40px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#2563eb',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trophy size={20} color="white" />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>PlayerBet</span>
        </div>

        {/* Avatar Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            backgroundColor: '#374151',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #4b5563'
          }}>
            <span style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#9ca3af'
            }}>
              A
            </span>
          </div>
        </div>

        {/* Title and Register Link */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            Log In
          </h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px'
          }}>
            Don't have an account?{' '}
            <button
              onClick={handleRegister}
              style={{
                color: '#3b82f6',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '14px'
              }}
            >
              Register
            </button>
          </p>
        </div>

        {/* Form */}
        <div style={{ marginBottom: '32px' }}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#e5e7eb',
              fontSize: '14px',
              marginBottom: '8px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#4b5563'}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#e5e7eb',
              fontSize: '14px',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '16px',
                  paddingRight: '50px',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#4b5563'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div style={{ textAlign: 'left', marginBottom: '32px' }}>
            <button
              onClick={handleForgotPassword}
              style={{
                color: '#3b82f6',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                textDecoration: 'underline'
              }}
            >
              Forgot password? Reset
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#1d4ed8')}
          onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#2563eb')}
        >
          LOGIN
        </button>

        {/* Demo Credentials */}
        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#1f2937',
          borderRadius: '8px',
          border: '1px solid #374151'
        }}>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 4px 0' }}>Demo credentials:</p>
          <p style={{ fontSize: '12px', color: '#e5e7eb', margin: '0' }}>
            Email: demo@playerbet.com<br />
            Password: password123
          </p>
        </div>
      </div>

      {/* Error Modal */}
      {showError && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1f2937',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '320px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid #374151'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '12px',
              color: 'white'
            }}>
              Incorrect log in details
            </h3>
            <p style={{
              color: '#9ca3af',
              fontSize: '14px',
              lineHeight: '1.5',
              marginBottom: '24px'
            }}>
              {errorMessage}
            </p>
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={retryLogin}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Re-try
              </button>
              <button
                onClick={closeError}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                LOGIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Button (for development) */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            zIndex: 100
          }}
        >
          ← Back
        </button>
      )}
    </div>
  );
};

export default LoginFlow;