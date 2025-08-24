// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import OnboardingFlow from './pages/OnboardingFlow';
import LoginFlow from './pages/LoginPage';
import SignUpFlow from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import BettingPage from './pages/BettingPage';

function App() {
  const [currentPage, setCurrentPage] = useState('onboarding');
  const [user, setUser] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('playerbet_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  // Navigation functions
  const navigateToLogin = () => setCurrentPage('login');
  const navigateToSignUp = () => setCurrentPage('signup');
  const navigateToDashboard = () => setCurrentPage('dashboard');
  const navigateToBetting = () => setCurrentPage('betting');
  const navigateToOnboarding = () => setCurrentPage('onboarding');

  // Authentication functions
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('playerbet_user', JSON.stringify(userData));
    navigateToDashboard();
  };

  const handleSignUp = (userData) => {
    setUser(userData);
    localStorage.setItem('playerbet_user', JSON.stringify(userData));
    navigateToDashboard();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('playerbet_user');
    navigateToOnboarding();
  };

  // Render current page
  const renderCurrentPage = () => {
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
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;