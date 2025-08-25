import React, { useState, useEffect } from 'react';
import { ChevronRight, Trophy, TrendingUp, Star } from 'lucide-react';

const OnboardingFlow = ({ onLogin, onSignUp }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance from first screen after 3 seconds
  useEffect(() => {
    if (currentScreen === 0) {
      const timer = setTimeout(() => {
        nextScreen();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const nextScreen = () => {
    if (currentScreen < 2) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentScreen(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleLogin = () => {
    if (onLogin) onLogin();
  };

  const handleSignUp = () => {
    if (onSignUp) onSignUp();
  };

  // Screen 1: Logo Splash
  const SplashScreen1 = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e40af, #3b82f6, #2563eb)',
      color: 'white',
      padding: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}>
        {/* Logo */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '96px',
            height: '96px',
            backgroundColor: '#facc15',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'rotate(12deg)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#eab308',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(-12deg)'
            }}>
              <Trophy size={32} color="#1e40af" />
            </div>
          </div>
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '24px',
            height: '24px',
            backgroundColor: '#fde047',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}></div>
        </div>
        
        {/* App Name */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            margin: 0,
            letterSpacing: '-0.025em'
          }}>
            PlayerBet
          </h1>
          <div style={{
            width: '64px',
            height: '4px',
            backgroundColor: '#facc15',
            margin: '12px auto 0',
            borderRadius: '2px'
          }}></div>
        </div>
      </div>
      
      {/* Loading indicator */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        display: 'flex',
        gap: '8px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          animation: 'pulse 1s infinite'
        }}></div>
        <div style={{
          width: '8px',
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          animation: 'pulse 1s infinite 0.2s'
        }}></div>
        <div style={{
          width: '8px',
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          animation: 'pulse 1s infinite 0.4s'
        }}></div>
      </div>
    </div>
  );

  // Screen 2: App Preview
  const SplashScreen2 = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#000',
      color: 'white'
    }}>
      {/* Logo and Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
      </div>

      {/* Phone Mockup */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
        position: 'relative'
      }}>
        <div style={{ position: 'relative' }}>
          {/* Phone Frame */}
          <div style={{
            width: '256px',
            height: '384px',
            backgroundColor: '#111827',
            borderRadius: '24px',
            border: '4px solid #374151',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Phone Screen Content */}
            <div style={{
              height: '100%',
              background: 'linear-gradient(to bottom, #111827, #000)',
              padding: '16px'
            }}>
              {/* Mock App Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid #374151'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trophy size={16} color="#60a5fa" />
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>PlayerBet</span>
                </div>
              </div>
              
              {/* Navigation Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div style={{
                  flex: 1,
                  backgroundColor: '#2563eb',
                  textAlign: 'center',
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '10px',
                  fontWeight: '500'
                }}>Football</div>
                <div style={{
                  flex: 1,
                  backgroundColor: '#1f2937',
                  textAlign: 'center',
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '10px'
                }}>Basketball</div>
                <div style={{
                  flex: 1,
                  backgroundColor: '#1f2937',
                  textAlign: 'center',
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '10px'
                }}>Tennis</div>
                <div style={{
                  flex: 1,
                  backgroundColor: '#1f2937',
                  textAlign: 'center',
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '10px'
                }}>Golf</div>
              </div>
              
              {/* Search Bar */}
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '8px',
                padding: '8px',
                marginBottom: '16px',
                fontSize: '10px',
                color: '#9ca3af'
              }}>
                🔍 Search for players, teams...
              </div>
              
              {/* Mock Game Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    fontSize: '10px'
                  }}>
                    <div style={{ color: '#9ca3af' }}>Today 8:00 PM</div>
                    <div style={{ color: '#10b981' }}>LIVE</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span>Team A</span>
                    <span style={{ color: '#60a5fa' }}>2.1</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span>Team B</span>
                    <span style={{ color: '#60a5fa' }}>1.8</span>
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '8px',
                  padding: '12px',
                  opacity: 0.75
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    fontSize: '10px'
                  }}>
                    <div style={{ color: '#9ca3af' }}>Tomorrow 3:00 PM</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span>Team C</span>
                    <span style={{ color: '#60a5fa' }}>1.9</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span>Team D</span>
                    <span style={{ color: '#60a5fa' }}>2.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div style={{
            position: 'absolute',
            top: '-32px',
            right: '-32px',
            width: '64px',
            height: '64px',
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(96, 165, 250, 0.3)'
          }}>
            <TrendingUp size={24} color="#60a5fa" />
          </div>
          <div style={{
            position: 'absolute',
            bottom: '-24px',
            left: '-24px',
            width: '48px',
            height: '48px',
            backgroundColor: 'rgba(251, 191, 36, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(251, 191, 36, 0.3)'
          }}>
            <Star size={16} color="#fbbf24" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 32px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            Discover a new world of<br />
            <span style={{ color: '#60a5fa' }}>betting</span>
          </h2>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px',
            lineHeight: '1.5',
            margin: 0
          }}>
            Join the millions of players around the<br />
            world who are cashing out on their<br />
            favorite sports
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
          <button
            onClick={handleLogin}
            style={{
              flex: 1,
              backgroundColor: '#7c3aed',
              color: 'white',
              fontWeight: '600',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '16px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#6d28d9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#7c3aed'}
          >
            Login
          </button>
          <button
            onClick={handleSignUp}
            style={{
              flex: 1,
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: '600',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '16px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Page Indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        paddingBottom: '24px'
      }}>
        <div style={{ width: '8px', height: '8px', backgroundColor: '#4b5563', borderRadius: '50%' }}></div>
        <div style={{ width: '32px', height: '8px', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
        <div style={{ width: '8px', height: '8px', backgroundColor: '#4b5563', borderRadius: '50%' }}></div>
      </div>
    </div>
  );

  // Screen 3: Final CTA (simplified for now)
  const SplashScreen3 = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#000',
      color: 'white',
      padding: '32px'
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '16px',
          lineHeight: '1.1'
        }}>
          Predict, play and<br />
          <span style={{ color: '#60a5fa' }}>win big</span>
        </h2>
        <p style={{
          color: '#9ca3af',
          fontSize: '18px',
          marginBottom: '48px'
        }}>
          Get ready to place your bets
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '400px' }}>
          <button
            onClick={handleLogin}
            style={{
              flex: 1,
              backgroundColor: '#7c3aed',
              color: 'white',
              fontWeight: '600',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Login
          </button>
          <button
            onClick={handleSignUp}
            style={{
              flex: 1,
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: '600',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Page Indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <div style={{ width: '8px', height: '8px', backgroundColor: '#4b5563', borderRadius: '50%' }}></div>
        <div style={{ width: '8px', height: '8px', backgroundColor: '#4b5563', borderRadius: '50%' }}></div>
        <div style={{ width: '32px', height: '8px', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
      </div>
    </div>
  );

  const screens = [SplashScreen1, SplashScreen2, SplashScreen3];
  const CurrentScreenComponent = screens[currentScreen];

  return (
    <div style={{
      transition: 'opacity 0.3s',
      opacity: isAnimating ? 0 : 1
    }}>
      <CurrentScreenComponent />
      
      {/* Development Navigation */}
      {currentScreen > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => setCurrentScreen(Math.max(0, currentScreen - 1))}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Previous
          </button>
          <button
            onClick={nextScreen}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Next
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default OnboardingFlow;