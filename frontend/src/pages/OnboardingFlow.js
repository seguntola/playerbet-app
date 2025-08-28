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
    if (currentScreen < 1) {
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
              {/* Floating elements - positioned to stay within screen bounds */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '48px',
            height: '48px',
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(96, 165, 250, 0.3)'
          }}>
            <TrendingUp size={20} color="#60a5fa" />
          </div>
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            width: '40px',
            height: '40px',
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

  // Screen 2: App Preview with realistic dashboard mockup
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
            width: '280px',
            height: '500px',
            backgroundColor: '#111827',
            borderRadius: '24px',
            border: '4px solid #374151',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Phone Screen Content - Realistic Dashboard */}
            <div style={{
              height: '100%',
              background: 'linear-gradient(to bottom, #000, #111827)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Mock App Header - Exactly like mobile dashboard */}
              <div style={{
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Trophy size={12} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>PLAYERBET</div>
                    <div style={{ fontSize: '8px', opacity: 0.9 }}>Build Your Parlay</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    A
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    gap: '4px',
                    fontSize: '8px'
                  }}>
                    <div style={{ fontSize: '8px' }}>⏏</div>
                    Logout
                  </div>
                </div>
              </div>
              
              {/* Navigation Tabs */}
              <div style={{ 
                display: 'flex', 
                gap: '6px', 
                padding: '12px',
                borderBottom: '1px solid #374151'
              }}>
                <div style={{
                  flex: 1,
                  backgroundColor: '#2563eb',
                  textAlign: 'center',
                  padding: '6px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '500'
                }}>Football</div>
                <div style={{
                  flex: 1,
                  backgroundColor: '#1f2937',
                  textAlign: 'center',
                  padding: '6px',
                  borderRadius: '6px',
                  fontSize: '10px'
                }}>Basketball</div>
                <div style={{
                  flex: 1,
                  backgroundColor: '#1f2937',
                  textAlign: 'center',
                  padding: '6px',
                  borderRadius: '6px',
                  fontSize: '10px'
                }}>Tennis</div>
              </div>
              
              {/* Search Bar */}
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '8px',
                padding: '8px',
                margin: '12px',
                fontSize: '10px',
                color: '#9ca3af',
                border: '1px solid #374151'
              }}>
                🔍 Search for players, teams...
              </div>
              
              {/* Mock Player Prop Cards */}
              <div style={{ 
                padding: '0 12px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                flex: 1,
                overflowY: 'auto'
              }}>
                {/* Player Prop Card 1 */}
                <div style={{
                  background: 'linear-gradient(145deg, #374151, #1f2937)',
                  borderRadius: '12px',
                  border: '1px solid #4b5563',
                  overflow: 'hidden'
                }}>
                  {/* Match Header */}
                  <div style={{
                    background: 'linear-gradient(90deg, #0f172a, #1e293b)',
                    padding: '8px',
                    borderBottom: '1px solid #475569'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '8px',
                      color: '#cbd5e1'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{
                          width: '4px',
                          height: '4px',
                          backgroundColor: '#10b981',
                          borderRadius: '50%'
                        }}></div>
                        Man City vs Liverpool
                      </div>
                      <div style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        fontSize: '8px',
                        color: '#60a5fa'
                      }}>
                        Today 8:00 PM
                      </div>
                    </div>
                  </div>

                  {/* Player Info with exact mobile structure */}
                  <div style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>
                        EH
                      </div>
                      <div>
                        <div>
                          <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'white', lineHeight: '12px' }}>
                            Erling
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'white', lineHeight: '12px' }}>
                            Haaland
                          </div>
                        </div>
                        <div style={{ fontSize: '8px', color: '#94a3b8' }}>
                          Man City
                        </div>
                      </div>
                    </div>

                    {/* Detailed Stat Section */}
                    <div style={{
                      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                      borderRadius: '6px',
                      padding: '8px',
                      marginBottom: '8px',
                      border: '1px solid #334155'
                    }}>
                      <div style={{ fontSize: '8px', color: '#94a3b8', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        GOALS
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '6px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                          <div style={{ fontSize: '16px', fontWeight: '900', color: 'white' }}>1.5</div>
                          <div style={{ fontSize: '8px', color: '#60a5fa', fontWeight: '600' }}>LINE</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '7px', color: '#64748b', marginBottom: '1px' }}>L5 Average</div>
                          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#10b981' }}>
                            1.6
                          </div>
                        </div>
                      </div>
                      
                      {/* Recent Form */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '7px', color: '#64748b', fontWeight: '600' }}>L5:</span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[2, 1, 3, 0, 2].map((value, index) => (
                            <div
                              key={index}
                              style={{
                                width: '12px',
                                height: '12px',
                                backgroundColor: value > 1.5 ? '#059669' : '#dc2626',
                                borderRadius: '3px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '6px',
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            >
                              {value}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Betting Options with Selected State */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <div style={{
                        padding: '8px',
                        background: 'linear-gradient(135deg, #4b5563, #374151)',
                        border: '1px solid #6b7280',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontSize: '8px',
                        fontWeight: '600',
                        color: 'white',
                        minHeight: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        OVER
                      </div>
                      <div style={{
                        padding: '8px',
                        background: 'linear-gradient(135deg, #059669, #10b981)',
                        border: '2px solid #10b981',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontSize: '8px',
                        fontWeight: '700',
                        color: 'white',
                        minHeight: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px'
                      }}>
                        <div>UNDER</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <div style={{ fontSize: '6px', color: '#059669' }}>✓</div>
                          </div>
                          <span style={{ fontSize: '6px' }}>Selected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Player Prop Card 2 - Smaller */}
                <div style={{
                  background: 'linear-gradient(145deg, #374151, #1f2937)',
                  borderRadius: '12px',
                  border: '1px solid #4b5563',
                  opacity: 0.8
                }}>
                  <div style={{
                    background: 'linear-gradient(90deg, #0f172a, #1e293b)',
                    padding: '6px',
                    borderBottom: '1px solid #475569'
                  }}>
                    <div style={{ fontSize: '7px', color: '#cbd5e1' }}>
                      Arsenal vs Chelsea • Tomorrow 3:00 PM
                    </div>
                  </div>
                  <div style={{ padding: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                        borderRadius: '50%',
                        fontSize: '8px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        BS
                      </div>
                      <div>
                        <div style={{ fontSize: '9px', fontWeight: 'bold', color: 'white' }}>
                          Bukayo Saka
                        </div>
                        <div style={{ fontSize: '7px', color: '#94a3b8' }}>
                          Shots on Target 2.5
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                      <div style={{
                        padding: '6px',
                        backgroundColor: '#4b5563',
                        borderRadius: '4px',
                        textAlign: 'center',
                        fontSize: '7px',
                        color: 'white'
                      }}>
                        OVER
                      </div>
                      <div style={{
                        padding: '6px',
                        backgroundColor: '#4b5563',
                        borderRadius: '4px',
                        textAlign: 'center',
                        fontSize: '7px',
                        color: 'white'
                      }}>
                        UNDER
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Nav */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '8px',
                backgroundColor: '#111827',
                borderTop: '1px solid #374151'
              }}>
                {['🏠', '⚽', '🏆', '👤'].map((icon, i) => (
                  <div key={i} style={{
                    padding: '4px',
                    fontSize: '12px',
                    color: i === 0 ? '#2563eb' : '#9ca3af'
                  }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>
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
      </div>
    </div>
  );

  const screens = [SplashScreen1, SplashScreen2];
  const CurrentScreenComponent = screens[currentScreen];

  return (
    <div style={{
      transition: 'opacity 0.3s',
      opacity: isAnimating ? 0 : 1
    }}>
      <CurrentScreenComponent />

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