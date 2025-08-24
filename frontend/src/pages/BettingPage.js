import React from 'react';

const BettingPage = ({ user, onBack, onLogout }) => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1f2937', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Betting Page</h1>
        <p style={{ marginBottom: '2rem', color: '#9ca3af' }}>Coming soon...</p>
        <button 
          onClick={onBack}
          style={{ 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            padding: '12px 24px', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BettingPage;