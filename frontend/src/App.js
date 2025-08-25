// Simplified App.js with Navigation Debugging
import React, { useState, useEffect } from 'react';
import OnboardingFlow from './pages/OnboardingFlow';
import LoginFlow from './pages/LoginPage';
import SignUpFlow from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import BettingPage from './pages/BettingPage';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [currentPage, setCurrentPage] = useState('onboarding');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugLog, setDebugLog] = useState([]);

  // Debug function
  const addDebugLog = (message) => {
    console.log('🔍 DEBUG:', message);
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Check if user is already logged in on app start - SIMPLIFIED VERSION
  useEffect(() => {
    addDebugLog('App started - checking auth status');
    
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem('playerbet_user');
      const savedToken = localStorage.getItem('playerbet_token');
      
      addDebugLog(`Saved user exists: ${!!savedUser}`);
      addDebugLog(`Saved token exists: ${!!savedToken}`);
      
      if (savedUser && savedToken) {
        try {
          const userData = JSON.parse(savedUser);
          addDebugLog(`Parsed user data: ${JSON.stringify(userData)}`);
          
          if (userData && userData.id) {
            addDebugLog(`Setting user and navigating to dashboard`);
            setUser(userData);
            setCurrentPage('dashboard');
          } else {
            addDebugLog('User data missing ID - clearing storage');
            localStorage.removeItem('playerbet_user');
            localStorage.removeItem('playerbet_token');
            setCurrentPage('onboarding');
          }
        } catch (error) {
          addDebugLog(`Error parsing user data: ${error.message}`);
          localStorage.removeItem('playerbet_user');
          localStorage.removeItem('playerbet_token');
          setCurrentPage('onboarding');
        }
      } else {
        addDebugLog('No saved user/token - staying on onboarding');
        setCurrentPage('onboarding');
      }
      
      setLoading(false);
    };

    // Small delay to see what's happening
    setTimeout(checkAuthStatus, 100);
  }, []);

  // Watch for user state changes
  useEffect(() => {
    addDebugLog(`User state changed: ${user ? `ID ${user.id}` : 'null'}`);
  }, [user]);

  // Watch for page changes
  useEffect(() => {
    addDebugLog(`Page changed to: ${currentPage}`);
  }, [currentPage]);

  // Navigation functions
  const navigateToLogin = () => {
    addDebugLog('Navigating to login');
    setCurrentPage('login');
  };
  
  const navigateToSignUp = () => {
    addDebugLog('Navigating to signup');
    setCurrentPage('signup');
  };
  
  const navigateToDashboard = () => {
    addDebugLog('Navigating to dashboard');
    setCurrentPage('dashboard');
  };
  
  const navigateToBetting = () => {
    addDebugLog('Navigating to betting');
    setCurrentPage('betting');
  };
  
  const navigateToOnboarding = () => {
    addDebugLog('Navigating to onboarding');
    setCurrentPage('onboarding');
  };

  // FIXED: Login handler with step-by-step logging
  const handleLogin = async (loginData) => {
    try {
      addDebugLog(`Starting login attempt for: ${loginData.email}`);
      
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      addDebugLog(`Login API response status: ${response.status}`);

      const result = await response.json();
      addDebugLog(`Login API result: ${JSON.stringify(result)}`);

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
        
        addDebugLog(`Created user object with ID: ${userWithId.id}`);
        
        // Store in localStorage first
        localStorage.setItem('playerbet_user', JSON.stringify(userWithId));
        localStorage.setItem('playerbet_token', result.token);
        addDebugLog('Saved to localStorage');
        
        // Then set state
        setUser(userWithId);
        addDebugLog('Set user state');
        
        // Wait a bit then navigate
        setTimeout(() => {
          addDebugLog('About to navigate to dashboard');
          navigateToDashboard();
        }, 100);
        
        return { success: true };
      } else {
        addDebugLog(`Login failed: ${result.message}`);
        return { success: false, message: result.message || 'Login failed' };
      }
    } catch (error) {
      addDebugLog(`Login error: ${error.message}`);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

const handleSignUp = async (signUpData) => {
  try {
    // CRITICAL FIX: Format date properly
    const formattedData = {
      ...signUpData,
      dateOfBirth: new Date(signUpData.dateOfBirth).toISOString()
    };
    
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData)
    });
    
    // ... rest of your existing code
  } catch (error) {
    // ... error handling
  }
};

  const handleLogout = () => {
    addDebugLog('Logging out');
    setUser(null);
    localStorage.removeItem('playerbet_user');
    localStorage.removeItem('playerbet_token');
    navigateToOnboarding();
  };

  // Show debug info if needed
  const showDebugInfo = debugLog.some(log => log.includes('ERROR') || log.includes('failed'));

  // Show loading screen
  if (loading) {
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
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #374151',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '16px', color: '#9ca3af' }}>Loading...</p>
        
        {/* Debug log */}
        {debugLog.length > 0 && (
          <div style={{
            marginTop: '20px',
            backgroundColor: '#1a1a1a',
            padding: '15px',
            borderRadius: '8px',
            maxWidth: '600px',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
              {debugLog.map((log, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>{log}</div>
              ))}
            </div>
          </div>
        )}
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Render current page with debug info
  const renderCurrentPage = () => {
    const pageComponent = (() => {
      switch (currentPage) {
        case 'onboarding':
          return (
            <OnboardingFlow 
              onLogin={navigateToLogin}
              onSignUp={navigateToSignUp}
            />
          );
        case 'login':
          return (
            <LoginFlow 
              onLogin={handleLogin}
              onSignUp={navigateToSignUp}
              onBack={navigateToOnboarding}
            />
          );
        case 'signup':
          return (
            <SignUpFlow
              onSignUp={handleSignUp}
              onLogin={navigateToLogin}
              onBack={navigateToOnboarding}
            />
          );
        case 'dashboard':
          return (
            <Dashboard 
              user={user}
              onLogout={handleLogout}
              onNavigateToBetting={navigateToBetting}
            />
          );
        case 'betting':
          return (
            <BettingPage 
              user={user}
              onBack={navigateToDashboard}
              onLogout={handleLogout}
            />
          );
        default:
          return <OnboardingFlow onLogin={navigateToLogin} onSignUp={navigateToSignUp} />;
      }
    })();

    return (
      <div>
        {pageComponent}
        
        {/* Debug Panel - Shows when there are issues */}
        {(showDebugInfo || debugLog.length > 10) && (
          <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            maxWidth: '400px',
            maxHeight: '300px',
            overflow: 'auto',
            zIndex: 1000,
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Debug Log ({currentPage} page):
              <button 
                onClick={() => setDebugLog([])}
                style={{
                  marginLeft: '10px',
                  backgroundColor: '#333',
                  color: 'white',
                  border: 'none',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            </div>
            {debugLog.slice(-15).map((log, index) => (
              <div key={index} style={{ 
                marginBottom: '3px',
                color: log.includes('ERROR') || log.includes('failed') ? '#ff6b6b' : 
                      log.includes('SUCCESS') || log.includes('successful') ? '#51cf66' : 'white'
              }}>
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;