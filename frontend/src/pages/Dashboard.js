import React, { useState } from 'react';
import { Trophy, Search, Home, Grid, User, TrendingUp, Users, Star, X, Trash2, LogOut, AlertCircle } from 'lucide-react';

const Dashboard = (props) => {
  const { user, onLogout, onNavigateToBetting } = props;
  const [activeTab, setActiveTab] = useState('football');
  const [activeSport, setActiveSport] = useState('football');
  const [bettingSlip, setBettingSlip] = useState([]);
  const [showBettingSlip, setShowBettingSlip] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [betMode, setBetMode] = useState('beast');

  const beastMultipliers = {
    2: 3,
    3: 6,
    4: 10,
    5: 20,
    6: 35,
    7: 50,
    8: 75,
    9: 100,
    10: 150
  };

  const safetyMultipliers = {
    2: 2.5,
    3: 4,
    4: 7,
    5: 12,
    6: 20,
    7: 30,
    8: 45,
    9: 65,
    10: 90
  };

  const safetyPayouts = {
    1.0: 1.0,
    0.9: 0.75,
    0.8: 0.5,
    0.7: 0.25
  };

  const footballProps = [
    {
      id: 1,
      player: { name: 'Erling Haaland', team: 'Man City', avatar: 'EH' },
      match: { home: 'Man City', away: 'Liverpool', time: 'Today 8:00 PM' },
      stat: 'Goals',
      line: 1.5,
      recentForm: [2, 1, 3, 0, 2]
    },
    {
      id: 2,
      player: { name: 'Mohamed Salah', team: 'Liverpool', avatar: 'MS' },
      match: { home: 'Man City', away: 'Liverpool', time: 'Today 8:00 PM' },
      stat: 'Goals + Assists',
      line: 2.0,
      recentForm: [3, 1, 2, 2, 4]
    },
    {
      id: 3,
      player: { name: 'Kevin De Bruyne', team: 'Man City', avatar: 'KB' },
      match: { home: 'Man City', away: 'Liverpool', time: 'Today 8:00 PM' },
      stat: 'Assists',
      line: 0.5,
      recentForm: [1, 0, 2, 1, 1]
    },
    {
      id: 4,
      player: { name: 'Bukayo Saka', team: 'Arsenal', avatar: 'BS' },
      match: { home: 'Arsenal', away: 'Chelsea', time: 'Tomorrow 3:00 PM' },
      stat: 'Shots on Target',
      line: 2.5,
      recentForm: [3, 2, 4, 2, 3]
    },
    {
      id: 5,
      player: { name: 'Cole Palmer', team: 'Chelsea', avatar: 'CP' },
      match: { home: 'Arsenal', away: 'Chelsea', time: 'Tomorrow 3:00 PM' },
      stat: 'Goals',
      line: 0.5,
      recentForm: [1, 0, 1, 2, 0]
    },
    {
      id: 6,
      player: { name: 'Martin Ødegaard', team: 'Arsenal', avatar: 'MØ' },
      match: { home: 'Arsenal', away: 'Chelsea', time: 'Tomorrow 3:00 PM' },
      stat: 'Key Passes',
      line: 3.5,
      recentForm: [4, 3, 5, 2, 4]
    }
  ];

  const basketballProps = [
    {
      id: 7,
      player: { name: 'LeBron James', team: 'Lakers', avatar: 'LJ' },
      match: { home: 'Lakers', away: 'Warriors', time: 'Today 10:30 PM' },
      stat: 'Points',
      line: 27.5,
      recentForm: [31, 24, 28, 33, 26]
    },
    {
      id: 8,
      player: { name: 'Stephen Curry', team: 'Warriors', avatar: 'SC' },
      match: { home: 'Lakers', away: 'Warriors', time: 'Today 10:30 PM' },
      stat: 'Points + Assists',
      line: 35.5,
      recentForm: [38, 32, 41, 34, 36]
    },
    {
      id: 9,
      player: { name: 'Anthony Davis', team: 'Lakers', avatar: 'AD' },
      match: { home: 'Lakers', away: 'Warriors', time: 'Today 10:30 PM' },
      stat: 'Rebounds',
      line: 11.5,
      recentForm: [13, 10, 15, 9, 12]
    }
  ];

  const getMultiplier = (numSelections) => {
    const multipliers = betMode === 'beast' ? beastMultipliers : safetyMultipliers;
    return multipliers[numSelections] || multipliers[10];
  };

  const getSafetyPlayRules = (numPicks) => {
    if (numPicks <= 2) return { maxLosses: 0, description: "All picks must win" };
    if (numPicks <= 4) return { maxLosses: 1, description: "Can lose 1 pick" };
    if (numPicks <= 6) return { maxLosses: 2, description: "Can lose up to 2 picks" };
    if (numPicks <= 8) return { maxLosses: 3, description: "Can lose up to 3 picks" };
    return { maxLosses: 4, description: "Can lose up to 4 picks" };
  };

  const addToBettingSlip = (prop, selection) => {
    const existingBetIndex = bettingSlip.findIndex(bet => bet.propId === prop.id);
    
    if (existingBetIndex !== -1) {
      if (bettingSlip[existingBetIndex].selection === selection) {
        setBettingSlip(bettingSlip.filter(bet => bet.propId !== prop.id));
      } else {
        const updatedSlip = [...bettingSlip];
        updatedSlip[existingBetIndex].selection = selection;
        setBettingSlip(updatedSlip);
      }
    } else {
      const newBet = {
        propId: prop.id,
        player: prop.player,
        match: prop.match,
        stat: prop.stat,
        line: prop.line,
        selection: selection
      };
      setBettingSlip([...bettingSlip, newBet]);
      
      if (bettingSlip.length >= 1) {
        setShowBettingSlip(true);
      }
    }
  };

  const removeBetFromSlip = (propId) => {
    setBettingSlip(bettingSlip.filter(bet => bet.propId !== propId));
  };

  const clearBettingSlip = () => {
    setBettingSlip([]);
  };

  const calculatePotentialWin = () => {
    if (bettingSlip.length < 2) return 0;
    const multiplier = getMultiplier(bettingSlip.length);
    
    if (betMode === 'beast') {
      return (betAmount * multiplier).toFixed(2);
    } else {
      const fullPayout = betAmount * multiplier;
      const minPayout = fullPayout * 0.25;
      return { max: fullPayout.toFixed(2), min: minPayout.toFixed(2) };
    }
  };

  const calculateAverageForForm = (form) => {
    return (form.reduce((a, b) => a + b, 0) / form.length).toFixed(1);
  };

  const PlayerPropCard = ({ prop }) => {
    const selectedBet = bettingSlip.find(bet => bet.propId === prop.id);
    const isOverSelected = selectedBet?.selection === 'over';
    const isUnderSelected = selectedBet?.selection === 'under';
    const avgForm = calculateAverageForForm(prop.recentForm);

    return (
      <div style={{
        background: selectedBet 
          ? 'linear-gradient(145deg, #1e3a8a 0%, #1f2937 50%, #1f2937 100%)' 
          : 'linear-gradient(145deg, #374151 0%, #1f2937 50%, #111827 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: selectedBet ? '2px solid #3b82f6' : '1px solid #4b5563',
        transition: 'all 0.3s ease-in-out',
        boxShadow: selectedBet 
          ? '0 8px 32px rgba(59, 130, 246, 0.3)' 
          : '0 4px 16px rgba(0, 0, 0, 0.2)',
        position: 'relative'
      }}>
        {selectedBet && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            borderRadius: '16px',
            pointerEvents: 'none'
          }} />
        )}

        <div style={{
          background: 'linear-gradient(90deg, #0f172a, #1e293b)',
          padding: '12px 16px',
          borderBottom: '1px solid #475569',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)'
          }} />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#cbd5e1',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)'
              }} />
              {prop.match.home} vs {prop.match.away}
            </div>
            <div style={{
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '600',
              color: '#60a5fa'
            }}>
              {prop.match.time}
            </div>
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                background: 'linear-gradient(45deg, #6366f1, #3b82f6, #8b5cf6)',
                borderRadius: '50%',
                zIndex: -1,
                opacity: 0.7
              }} />
              {prop.player.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                color: 'white', 
                fontSize: '18px', 
                fontWeight: '700',
                marginBottom: '4px'
              }}>
                {prop.player.name}
              </div>
              <div style={{ 
                color: '#94a3b8', 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {prop.player.team}
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
            border: '1px solid #334155',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
              pointerEvents: 'none'
            }} />
            
            <div style={{
              fontSize: '13px',
              color: '#94a3b8',
              marginBottom: '8px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              position: 'relative',
              zIndex: 1
            }}>
              {prop.stat}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '900',
                color: 'white',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'baseline',
                gap: '4px'
              }}>
                {prop.line}
                <span style={{
                  fontSize: '16px',
                  color: '#60a5fa',
                  fontWeight: '600'
                }}>
                  LINE
                </span>
              </div>
              <div style={{
                textAlign: 'right'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: '#64748b',
                  marginBottom: '2px'
                }}>
                  L5 Average
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: parseFloat(avgForm) > prop.line ? '#10b981' : '#ef4444'
                }}>
                  {avgForm}
                </div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <span style={{ 
                fontSize: '11px', 
                color: '#64748b', 
                marginRight: '8px',
                fontWeight: '600'
              }}>
                Recent Form:
              </span>
              {prop.recentForm.map((value, index) => (
                <div
                  key={index}
                  style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: value > prop.line ? '#059669' : '#dc2626',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: value > prop.line 
                      ? '0 2px 8px rgba(5, 150, 105, 0.4)' 
                      : '0 2px 8px rgba(220, 38, 38, 0.4)',
                    position: 'relative'
                  }}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            <button
              onClick={() => addToBettingSlip(prop, 'over')}
              style={{
                padding: '16px',
                background: isOverSelected 
                  ? 'linear-gradient(135deg, #059669, #10b981)' 
                  : 'linear-gradient(135deg, #4b5563, #374151)',
                border: isOverSelected ? '2px solid #10b981' : '1px solid #6b7280',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: isOverSelected ? '700' : '600',
                boxShadow: isOverSelected 
                  ? '0 4px 16px rgba(16, 185, 129, 0.4)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                if (!isOverSelected) {
                  e.target.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                if (!isOverSelected) {
                  e.target.style.background = 'linear-gradient(135deg, #4b5563, #374151)';
                  e.target.style.transform = 'translateY(0px)';
                }
              }}
            >
              {isOverSelected && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.2) 0%, transparent 50%)',
                  borderRadius: '12px'
                }} />
              )}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '14px', marginBottom: '6px', opacity: 0.9 }}>
                  OVER
                </div>
                {isOverSelected && (
                  <div style={{ 
                    fontSize: '12px', 
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{ fontSize: '8px', color: '#059669' }}>✓</div>
                    </div>
                    Selected
                  </div>
                )}
              </div>
            </button>
            <button
              onClick={() => addToBettingSlip(prop, 'under')}
              style={{
                padding: '16px',
                background: isUnderSelected 
                  ? 'linear-gradient(135deg, #059669, #10b981)' 
                  : 'linear-gradient(135deg, #4b5563, #374151)',
                border: isUnderSelected ? '2px solid #10b981' : '1px solid #6b7280',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: isUnderSelected ? '700' : '600',
                boxShadow: isUnderSelected 
                  ? '0 4px 16px rgba(16, 185, 129, 0.4)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                if (!isUnderSelected) {
                  e.target.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                if (!isUnderSelected) {
                  e.target.style.background = 'linear-gradient(135deg, #4b5563, #374151)';
                  e.target.style.transform = 'translateY(0px)';
                }
              }}
            >
              {isUnderSelected && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.2) 0%, transparent 50%)',
                  borderRadius: '12px'
                }} />
              )}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '14px', marginBottom: '6px', opacity: 0.9 }}>
                  UNDER
                </div>
                {isUnderSelected && (
                  <div style={{ 
                    fontSize: '12px', 
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{ fontSize: '8px', color: '#059669' }}>✓</div>
                    </div>
                    Selected
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: 'white',
      paddingBottom: '60px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trophy size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>PLAYERBET</h1>
            <p style={{ fontSize: '12px', margin: 0, opacity: 0.9 }}>
              Build Your Parlay
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <button
            onClick={onLogout}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(90deg, #1f2937, #111827)',
        padding: '12px 20px',
        borderBottom: '1px solid #374151'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          fontSize: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#dc2626', fontWeight: 'bold' }}>🔥 BEAST MODE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#9ca3af' }}>2 Picks:</span>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>3x</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#9ca3af' }}>3 Picks:</span>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>6x</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#9ca3af' }}>5 Picks:</span>
            <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>20x</span>
          </div>
          <div style={{ 
            height: '20px', 
            width: '1px', 
            backgroundColor: '#4b5563', 
            margin: '0 8px' 
          }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>🛡️ SAFETY PLAY</span>
            <span style={{ color: '#9ca3af', fontSize: '12px' }}>More forgiving payouts</span>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          {['Football', 'Basketball', 'Tennis', 'Golf', 'Cricket'].map((sport) => (
            <button
              key={sport}
              onClick={() => setActiveSport(sport.toLowerCase())}
              style={{
                padding: '12px 24px',
                backgroundColor: activeSport === sport.toLowerCase() ? '#2563eb' : '#1f2937',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s'
              }}
            >
              {sport}
            </button>
          ))}
        </div>

        <div style={{
          position: 'relative',
          marginBottom: '24px'
        }}>
          <Search size={20} style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} />
          <input
            type="text"
            placeholder="Search for players, teams, or props..."
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#374151'}
          />
        </div>

        {activeSport === 'football' && (
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⚽ FOOTBALL PLAYER PROPS
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {footballProps.map(prop => (
                <PlayerPropCard key={prop.id} prop={prop} />
              ))}
            </div>
          </div>
        )}

        {activeSport === 'basketball' && (
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🏀 BASKETBALL PLAYER PROPS
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {basketballProps.map(prop => (
                <PlayerPropCard key={prop.id} prop={prop} />
              ))}
            </div>
          </div>
        )}

        {(activeSport === 'tennis' || activeSport === 'golf' || activeSport === 'cricket') && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#1f2937',
            borderRadius: '12px',
            border: '1px solid #374151'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {activeSport === 'tennis' && '🎾'}
              {activeSport === 'golf' && '⛳'}
              {activeSport === 'cricket' && '🏏'}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              {activeSport.charAt(0).toUpperCase() + activeSport.slice(1)} Props Coming Soon
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              We're working on bringing you the best {activeSport} player props!
            </p>
          </div>
        )}
      </div>

      {bettingSlip.length > 0 && (
        <button
          onClick={() => setShowBettingSlip(!showBettingSlip)}
          style={{
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            backgroundColor: bettingSlip.length >= 2 ? '#2563eb' : '#6b7280',
            color: 'white',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 100
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{bettingSlip.length}</div>
            <div style={{ fontSize: '10px' }}>PICKS</div>
          </div>
        </button>
      )}

      {showBettingSlip && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '400px',
          height: '100vh',
          backgroundColor: '#111827',
          borderLeft: '1px solid #374151',
          overflowY: 'auto',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#1f2937',
            borderBottom: '1px solid #374151',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              Parlay Builder ({bettingSlip.length} Picks)
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={clearBettingSlip}
                style={{
                  backgroundColor: '#374151',
                  color: '#ef4444',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px'
                }}
              >
                <Trash2 size={14} />
                Clear
              </button>
              <button
                onClick={() => setShowBettingSlip(false)}
                style={{
                  backgroundColor: '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {bettingSlip.length < 2 && bettingSlip.length > 0 && (
            <div style={{
              margin: '16px',
              padding: '12px',
              backgroundColor: '#7c2d12',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={18} color="#fca5a5" />
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fca5a5', fontSize: '14px', fontWeight: 'bold' }}>
                  Minimum 2 picks required
                </div>
                <div style={{ color: '#fca5a5', fontSize: '12px', opacity: 0.9 }}>
                  Add {2 - bettingSlip.length} more selection{2 - bettingSlip.length > 1 ? 's' : ''} to place bet
                </div>
              </div>
            </div>
          )}

          {bettingSlip.length >= 2 && (
            <div style={{
              margin: '16px',
              padding: '16px',
              background: betMode === 'beast' 
                ? 'linear-gradient(135deg, #dc2626, #ef4444)' 
                : 'linear-gradient(135deg, #059669, #10b981)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>
                {betMode === 'beast' ? 'Beast Mode' : 'Safety Play'} Multiplier
              </div>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                {getMultiplier(bettingSlip.length)}x
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                {bettingSlip.length} Pick {betMode === 'beast' ? 'Parlay' : 'Safety Bet'}
              </div>
            </div>
          )}

          {bettingSlip.length >= 2 && (
            <div style={{ margin: '16px' }}>
              <div style={{
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                padding: '8px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                border: '1px solid #374151'
              }}>
                <button
                  onClick={() => setBetMode('beast')}
                  style={{
                    padding: '12px',
                    backgroundColor: betMode === 'beast' ? '#dc2626' : 'transparent',
                    color: betMode === 'beast' ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  <div style={{ marginBottom: '4px' }}>🔥 BEAST MODE</div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>All picks must win</div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>Higher multipliers</div>
                </button>
                <button
                  onClick={() => setBetMode('safety')}
                  style={{
                    padding: '12px',
                    backgroundColor: betMode === 'safety' ? '#059669' : 'transparent',
                    color: betMode === 'safety' ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  <div style={{ marginBottom: '4px' }}>🛡️ SAFETY PLAY</div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>{getSafetyPlayRules(bettingSlip.length).description}</div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>Forgiving payouts</div>
                </button>
              </div>
              
              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: betMode === 'beast' ? '#7c2d12' : '#064e3b',
                borderRadius: '8px',
                border: betMode === 'beast' ? '1px solid #dc2626' : '1px solid #059669'
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: betMode === 'beast' ? '#fca5a5' : '#6ee7b7',
                  lineHeight: '1.4'
                }}>
                  {betMode === 'beast' ? (
                    <>
                      <strong>Beast Mode:</strong> Maximum risk, maximum reward! All {bettingSlip.length} picks must win or you lose everything. Higher multipliers for bigger payouts.
                    </>
                  ) : (
                    <>
                      <strong>Safety Play:</strong> {getSafetyPlayRules(bettingSlip.length).description} and still win money! Lower multipliers but much better odds of winning something.
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
            {bettingSlip.map((bet, index) => (
              <div key={bet.propId} style={{
                backgroundColor: '#1f2937',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px',
                border: '1px solid #374151'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '8px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#4b5563',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </span>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                        {bet.player.name}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                      {bet.match.home} vs {bet.match.away}
                    </div>
                    <div style={{ fontSize: '13px', color: '#60a5fa' }}>
                      {bet.stat}: {bet.selection.toUpperCase()} {bet.line}
                    </div>
                  </div>
                  <button
                    onClick={() => removeBetFromSlip(bet.propId)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#ef4444',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#1f2937',
            borderTop: '1px solid #374151'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                Bet Amount
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                />
                <button
                  onClick={() => setBetAmount(10)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  $10
                </button>
                <button
                  onClick={() => setBetAmount(25)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  $25
                </button>
                <button
                  onClick={() => setBetAmount(50)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  $50
                </button>
              </div>
            </div>
            
            {bettingSlip.length >= 2 && (
              <>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  fontSize: '16px'
                }}>
                  <span>Potential Win:</span>
                  <div style={{ fontWeight: 'bold', color: '#10b981', fontSize: '20px' }}>
                    {betMode === 'beast' ? (
                      `$${calculatePotentialWin()}`
                    ) : (
                      <div style={{ textAlign: 'right' }}>
                        <div>${calculatePotentialWin().max}</div>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>
                          ($${calculatePotentialWin().min} - $${calculatePotentialWin().max})
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const potentialWin = betMode === 'beast' 
                      ? calculatePotentialWin() 
                      : calculatePotentialWin().max;
                    alert(
                      `${betMode === 'beast' ? 'Beast Mode' : 'Safety Play'} bet placed successfully!\n` +
                      `${bettingSlip.length} picks @ ${getMultiplier(bettingSlip.length)}x\n` +
                      `Mode: ${betMode === 'beast' ? 'All picks must win' : getSafetyPlayRules(bettingSlip.length).description}\n` +
                      `Stake: $${betAmount}\n` +
                      `Potential Win: ${betMode === 'beast' ? '$' + potentialWin : '$' + calculatePotentialWin().min + ' - $' + calculatePotentialWin().max}`
                    );
                    clearBettingSlip();
                    setShowBettingSlip(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: betMode === 'beast' ? '#dc2626' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Place {betMode === 'beast' ? 'Beast Mode' : 'Safety Play'} Bet
                </button>
              </>
            )}
            
            {bettingSlip.length < 2 && (
              <button
                disabled
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#4b5563',
                  color: '#9ca3af',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'not-allowed'
                }}
              >
                Add {2 - bettingSlip.length} More Pick{2 - bettingSlip.length > 1 ? 's' : ''}
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#111827',
        borderTop: '1px solid #374151',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0'
      }}>
        <button style={{
          background: 'none',
          border: 'none',
          color: '#2563eb',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Home size={20} />
          <span style={{ fontSize: '10px' }}>Home</span>
        </button>
        <button style={{
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Grid size={20} />
          <span style={{ fontSize: '10px' }}>Sports</span>
        </button>
        <button style={{
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Trophy size={20} />
          <span style={{ fontSize: '10px' }}>My Bets</span>
        </button>
        <button style={{
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px'
        }}>
          <User size={20} />
          <span style={{ fontSize: '10px' }}>Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;