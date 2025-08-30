import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { API_CONFIG } from '../utils/Constants';

const DashboardScreen = ({ navigation }) => {
  const { user, handleLogout } = useUser();
  const [activeSport, setActiveSport] = useState('basketball_nba');
  const [bettingSlip, setBettingSlip] = useState([]);
  const [showBettingSlip, setShowBettingSlip] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [betMode, setBetMode] = useState('beast');
  
  // API Data State
  const [gamesData, setGamesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [dataVersion, setDataVersion] = useState(0);

  // Player Details Modal State
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedProp, setSelectedProp] = useState(null);

  const beastMultipliers = {
    2: 3, 3: 6, 4: 10, 5: 20, 6: 35, 7: 50, 8: 75, 9: 100, 10: 150
  };

  const safetyMultipliers = {
    2: 2.5, 3: 4, 4: 7, 5: 12, 6: 20, 7: 30, 8: 45, 9: 65, 10: 90
  };

  // Fetch games data from API with enhanced fallback logic
  const fetchGamesData = async (sportKey, forceRefresh = false) => {
    try {
      if (!forceRefresh) setLoading(true);
      setError(null);

      console.log(`Fetching games for sport: ${sportKey}`);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/games/sports/${sportKey}/games-with-props?maxGames=6`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`Games API response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch games`);
      }

      const games = await response.json();
      console.log('Raw API Response:', games);

      // ENHANCED: Check if response is valid and has usable data
      if (!games || !Array.isArray(games) || games.length === 0) {
        console.log(`Invalid or empty API response for ${sportKey}, using fallback data`);
        throw new Error('Empty or invalid API response');
      }

      // ENHANCED: Check if any games have missing players data
      const hasValidPlayers = games.some(game => 
        game.players && 
        Array.isArray(game.players) && 
        game.players.length > 0 &&
        game.players.some(player => 
          player.stats && 
          Array.isArray(player.stats) && 
          player.stats.length > 0
        )
      );

      if (!hasValidPlayers) {
        console.log(`No valid player data found in API response for ${sportKey}, using fallback data`);
        throw new Error('No valid player data in API response');
      }

      setGamesData(prev => ({
        ...prev,
        [sportKey]: games
      }));
      
      setDataVersion(v => v + 1);
      console.log(`Successfully loaded ${games.length} games for ${sportKey}`);

    } catch (error) {
      console.error(`Error fetching games for ${sportKey}:`, error);
      setError(`Failed to load ${sportKey} games. ${error.message}`);
      
      // ENHANCED: Always provide fallback data when API fails or has no players
      console.log(`Setting fallback data for ${sportKey}`);
      const fallbackData = generateFallbackData(sportKey);
      
      setGamesData(prev => ({
        ...prev,
        [sportKey]: fallbackData
      }));
      
      setDataVersion(v => v + 1);
    } finally {
      setLoading(false);
      if (forceRefresh) setRefreshing(false);
    }
  };

  // Enhanced fallback data with all sports
  const generateFallbackData = (sportKey) => {
    console.log(`Using fallback data for ${sportKey}`);
    
    if (sportKey === 'basketball_nba') {
      return [
        {
          id: 'fallback_game1',
          homeTeam: 'Lakers',
          awayTeam: 'Warriors',
          gameTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          status: 'Upcoming',
          players: [
            {
              id: 'fallback_lebron',
              name: 'LeBron James',
              team: 'Lakers',
              position: 'SF',
              avatar: 'LJ',
              stats: [
                { type: 'Points', line: 27.5 },
                { type: 'Assists', line: 8.5 }
              ]
            },
            {
              id: 'fallback_curry',
              name: 'Stephen Curry',
              team: 'Warriors',
              position: 'PG',
              avatar: 'SC',
              stats: [
                { type: 'Points', line: 28.5 },
                { type: '3-Pointers', line: 4.5 }
              ]
            }
          ]
        }
      ];
    }
    
    if (sportKey === 'soccer_epl') {
      return [
        {
          id: 'fallback_soccer_game1',
          homeTeam: 'Man City',
          awayTeam: 'Liverpool',
          gameTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          status: 'Upcoming',
          players: [
            {
              id: 'fallback_haaland',
              name: 'Erling Haaland',
              team: 'Man City',
              position: 'ST',
              avatar: 'EH',
              stats: [
                { type: 'Goals', line: 1.5 },
                { type: 'Shots on Target', line: 2.5 }
              ]
            },
            {
              id: 'fallback_salah',
              name: 'Mohamed Salah',
              team: 'Liverpool',
              position: 'RW',
              avatar: 'MS',
              stats: [
                { type: 'Goals', line: 1.5 },
                { type: 'Assists', line: 0.5 }
              ]
            }
          ]
        },
        {
          id: 'fallback_soccer_game2',
          homeTeam: 'Arsenal',
          awayTeam: 'Chelsea',
          gameTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          status: 'Upcoming',
          players: [
            {
              id: 'fallback_saka',
              name: 'Bukayo Saka',
              team: 'Arsenal',
              position: 'RW',
              avatar: 'BS',
              stats: [
                { type: 'Shots on Target', line: 2.5 },
                { type: 'Assists', line: 0.5 }
              ]
            }
          ]
        }
      ];
    }
    
    if (sportKey === 'americanfootball_nfl') {
      return [
        {
          id: 'fallback_nfl_game1',
          homeTeam: 'Chiefs',
          awayTeam: 'Bills',
          gameTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          status: 'Upcoming',
          players: [
            {
              id: 'fallback_mahomes',
              name: 'Patrick Mahomes',
              team: 'Chiefs',
              position: 'QB',
              avatar: 'PM',
              stats: [
                { type: 'Pass Yards', line: 267.5 },
                { type: 'Pass Touchdowns', line: 1.5 }
              ]
            },
            {
              id: 'fallback_kelce',
              name: 'Travis Kelce',
              team: 'Chiefs',
              position: 'TE',
              avatar: 'TK',
              stats: [
                { type: 'Receiving Yards', line: 65.5 },
                { type: 'Receptions', line: 5.5 }
              ]
            }
          ]
        },
        {
          id: 'fallback_nfl_game2',
          homeTeam: '49ers',
          awayTeam: 'Cowboys',
          gameTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
          status: 'Upcoming',
          players: [
            {
              id: 'fallback_mccaffrey',
              name: 'Christian McCaffrey',
              team: '49ers',
              position: 'RB',
              avatar: 'CM',
              stats: [
                { type: 'Rush Yards', line: 87.5 },
                { type: 'Receiving Yards', line: 31.5 }
              ]
            }
          ]
        }
      ];
    }
    
    return [];
  };

  useEffect(() => {
    fetchGamesData(activeSport);
  }, []);

  useEffect(() => {
    if (gamesData[activeSport]) {
      setLoading(false);
    } else {
      fetchGamesData(activeSport);
    }
  }, [activeSport]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGamesData(activeSport, true);
  };

  const convertApiDataToProps = (games) => {
    if (!games || !Array.isArray(games) || games.length === 0) {
      return [];
    }
    
    const props = [];
    
    games.forEach(game => {
      if (!game?.players || !Array.isArray(game.players)) return;
      
      game.players.forEach(player => {
        if (!player?.stats || !Array.isArray(player.stats)) return;
        
        player.stats.forEach(stat => {
          props.push({
            id: `${game.id}_${player.id || player.name}_${stat.type}`,
            player: {
              name: player.name,
              team: player.team,
              avatar: player.avatar || generatePlayerAvatar(player.name)
            },
            match: {
              home: game.homeTeam,
              away: game.awayTeam,
              time: formatGameTime(game.gameTime)
            },
            stat: stat.type,
            line: stat.line,
            recentForm: generateMockRecentForm(stat.line, stat.type),
            gameStatus: game.status || 'Upcoming'
          });
        });
      });
    });
    
    return props;
  };

  const generatePlayerAvatar = (playerName) => {
    const nameParts = playerName.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0] ? `${nameParts[0][0]}?` : '??';
  };

  const formatGameTime = (gameTimeISO) => {
    const gameDate = new Date(gameTimeISO);
    const now = new Date();
    const diffHours = Math.ceil((gameDate - now) / (1000 * 60 * 60));
    
    if (diffHours < 2) {
      return 'Starting Soon';
    } else if (diffHours < 24) {
      return `Today ${gameDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffHours < 48) {
      return `Tomorrow ${gameDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return gameDate.toLocaleDateString('en-US', { 
        weekday: 'short',
        hour: 'numeric', 
        minute: '2-digit'
      });
    }
  };

  const generateMockRecentForm = (line, statType) => {
    const variance = statType.includes('Goals') ? line * 0.4 : line * 0.3;
    const form = [];
    
    for (let i = 0; i < 5; i++) {
      const randomVariation = (Math.random() - 0.5) * variance;
      const value = Math.max(0, line + randomVariation);
      form.push(parseFloat(value.toFixed(1)));
    }
    
    return form;
  };

  const getCurrentSportData = () => {
    const data = gamesData[activeSport];
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    
    return convertApiDataToProps(data);
  };

  const getMultiplier = (numSelections) => {
    const multipliers = betMode === 'beast' ? beastMultipliers : safetyMultipliers;
    return multipliers[numSelections] || multipliers[10];
  };

  const addToBettingSlip = (prop, selection) => {
    const existingBetIndex = bettingSlip.findIndex(bet => bet.propId === prop.id);
    
    if (existingBetIndex !== -1) {
      if (bettingSlip[existingBetIndex].selection === selection) {
        setBettingSlip(bettingSlip.filter(bet => bet.propId !== prop.id));
      } else {
        const updatedSlip = [...bettingSlip];
        updatedSlip[existingBetIndex].selection = selection;
        updatedSlip[existingBetIndex].odds = selection === 'over' ? prop.overOdds : prop.underOdds;
        setBettingSlip(updatedSlip);
      }
    } else {
      const newBet = {
        propId: prop.id,
        player: prop.player,
        match: prop.match,
        stat: prop.stat,
        line: prop.line,
        selection: selection,
        odds: selection === 'over' ? prop.overOdds : prop.underOdds
      };
      setBettingSlip([...bettingSlip, newBet]);
    }
  };

  const clearBettingSlip = () => {
    setBettingSlip([]);
  };

  const calculateAverageForForm = (form) => {
    return (form.reduce((a, b) => a + b, 0) / form.length).toFixed(1);
  };

  const handleLogoutSubmit = async () => {
    await handleLogout();
    navigation.navigate('Onboarding');
  };

  const handleFABPress = () => {
    if (bettingSlip.length === 0) {
      Alert.alert(
        'No picks selected',
        'Select some player props to start building your parlay!',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    setShowBettingSlip(true);
  };

  // UPDATED: Handle card click to show player details modal
  const handleCardClick = (prop) => {
    setSelectedProp(prop);
    setShowPlayerModal(true);
  };

  // Sport button mapping - UPDATED: reduced available width
  const sportButtons = [
    { key: 'soccer_epl', label: 'Football', available: true },
    { key: 'basketball_nba', label: 'Basketball', available: true },
    { key: 'americanfootball_nfl', label: 'NFL', available: true },
    { key: 'tennis', label: 'Tennis', available: false },
    { key: 'golf', label: 'Golf', available: false },
    { key: 'cricket', label: 'Cricket', available: false }
  ];

  // UPDATED: Simplified PlayerPropCard without recent form data
  const PlayerPropCard = ({ prop }) => {
    const selectedBet = bettingSlip.find(bet => bet.propId === prop.id);
    const isOverSelected = selectedBet?.selection === 'over';
    const isUnderSelected = selectedBet?.selection === 'under';

    return (
      <TouchableOpacity 
        style={[
          styles.propCard, 
          selectedBet && styles.propCardSelected
        ]}
        onPress={() => handleCardClick(prop)}
        activeOpacity={0.8}
      >
        {/* Match Header */}
        <LinearGradient
          colors={['#0f172a', '#1e293b']}
          style={styles.propCardHeader}
        >
          <View style={styles.matchInfo}>
            <View style={styles.liveIndicator} />
            <Text style={styles.matchText}>{prop.match.home} vs {prop.match.away}</Text>
          </View>
          <View style={styles.matchTime}>
            <Text style={styles.matchTimeText}>{prop.match.time}</Text>
          </View>
        </LinearGradient>

        <View style={styles.propCardContent}>
          {/* Player Info */}
          <View style={styles.playerSection}>
            <LinearGradient
              colors={['#6366f1', '#3b82f6']}
              style={styles.playerAvatar}
            >
              <Text style={styles.playerAvatarText}>{prop.player.avatar}</Text>
            </LinearGradient>
            <View style={styles.playerInfo}>
              <View style={styles.playerNameContainer}>
                <Text style={styles.playerFirstName}>
                  {prop.player.name.split(' ')[0]}
                </Text>
                <Text style={styles.playerLastName}>
                  {prop.player.name.split(' ').slice(1).join(' ')}
                </Text>
              </View>
              <Text style={styles.playerTeam}>{prop.player.team}</Text>
            </View>
          </View>

          {/* SIMPLIFIED: Stat Details without recent form */}
          <LinearGradient
            colors={['#0f172a', '#1e293b']}
            style={styles.statSection}
          >
            <Text style={styles.statLabel}>{prop.stat.toUpperCase()}</Text>
            <View style={styles.lineSection}>
              <View style={styles.lineNumber}>
                <Text style={styles.lineText}>{prop.line}</Text>
                <Text style={styles.lineLabel}>LINE</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Betting Options */}
          <View style={styles.bettingOptions}>
            <TouchableOpacity
              style={[
                styles.bettingButton,
                isOverSelected && styles.bettingButtonSelected
              ]}
              onPress={(e) => {
                e.stopPropagation();
                addToBettingSlip(prop, 'over');
              }}
            >
              <Text style={[
                styles.bettingButtonText,
                isOverSelected && styles.bettingButtonTextSelected
              ]}>
                OVER
              </Text>
              {isOverSelected && (
                <View style={styles.selectedIndicator}>
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={8} color="#059669" />
                  </View>
                  <Text style={styles.selectedText}>Selected</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.bettingButton,
                isUnderSelected && styles.bettingButtonSelected
              ]}
              onPress={(e) => {
                e.stopPropagation();
                addToBettingSlip(prop, 'under');
              }}
            >
              <Text style={[
                styles.bettingButtonText,
                isUnderSelected && styles.bettingButtonTextSelected
              ]}>
                UNDER
              </Text>
              {isUnderSelected && (
                <View style={styles.selectedIndicator}>
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={8} color="#059669" />
                  </View>
                  <Text style={styles.selectedText}>Selected</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // NEW: Player Details Modal Component
  const PlayerDetailsModal = () => {
    if (!selectedProp) return null;

    const avgForm = calculateAverageForForm(selectedProp.recentForm);
    const isAboveLine = parseFloat(avgForm) > selectedProp.line;

    return (
      <Modal
        visible={showPlayerModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPlayerModal(false)}
      >
        <SafeAreaView style={styles.playerModal}>
          {/* Modal Header */}
          <LinearGradient colors={['#7c3aed', '#2563eb']} style={styles.playerModalHeader}>
            <View style={styles.playerModalHeaderContent}>
              <View style={styles.playerModalInfo}>
                <LinearGradient
                  colors={['#6366f1', '#3b82f6']}
                  style={styles.playerModalAvatar}
                >
                  <Text style={styles.playerModalAvatarText}>{selectedProp.player.avatar}</Text>
                </LinearGradient>
                <View>
                  <Text style={styles.playerModalName}>{selectedProp.player.name}</Text>
                  <Text style={styles.playerModalTeam}>{selectedProp.player.team}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.playerModalClose}
                onPress={() => setShowPlayerModal(false)}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView style={styles.playerModalContent}>
            {/* Match Info */}
            <View style={styles.playerModalSection}>
              <Text style={styles.playerModalSectionTitle}>Match Details</Text>
              <LinearGradient colors={['#1f2937', '#111827']} style={styles.playerModalCard}>
                <View style={styles.matchDetailsRow}>
                  <Text style={styles.matchDetailsLabel}>Match:</Text>
                  <Text style={styles.matchDetailsValue}>
                    {selectedProp.match.home} vs {selectedProp.match.away}
                  </Text>
                </View>
                <View style={styles.matchDetailsRow}>
                  <Text style={styles.matchDetailsLabel}>Time:</Text>
                  <Text style={styles.matchDetailsValue}>{selectedProp.match.time}</Text>
                </View>
                <View style={styles.matchDetailsRow}>
                  <Text style={styles.matchDetailsLabel}>Status:</Text>
                  <Text style={styles.matchDetailsValue}>{selectedProp.gameStatus}</Text>
                </View>
              </LinearGradient>
            </View>

            {/* Stat Analysis */}
            <View style={styles.playerModalSection}>
              <Text style={styles.playerModalSectionTitle}>{selectedProp.stat} Analysis</Text>
              <LinearGradient colors={['#1f2937', '#111827']} style={styles.playerModalCard}>
                <View style={styles.statAnalysisHeader}>
                  <View style={styles.statAnalysisMain}>
                    <Text style={styles.statAnalysisLine}>{selectedProp.line}</Text>
                    <Text style={styles.statAnalysisLabel}>BETTING LINE</Text>
                  </View>
                  <View style={styles.statAnalysisAvg}>
                    <Text style={[
                      styles.statAnalysisAvgValue,
                      { color: isAboveLine ? '#10b981' : '#ef4444' }
                    ]}>
                      {avgForm}
                    </Text>
                    <Text style={styles.statAnalysisAvgLabel}>L5 AVERAGE</Text>
                  </View>
                </View>

                {/* Performance Indicator */}
                <View style={styles.performanceIndicator}>
                  <View style={[
                    styles.performanceBar,
                    { backgroundColor: isAboveLine ? '#10b981' : '#ef4444' }
                  ]}>
                    <Text style={styles.performanceText}>
                      {isAboveLine ? 'TRENDING OVER' : 'TRENDING UNDER'}
                    </Text>
                  </View>
                </View>

                {/* Recent Form */}
                <View style={styles.recentFormSection}>
                  <Text style={styles.recentFormTitle}>Last 5 Games Performance</Text>
                  <View style={styles.recentFormGrid}>
                    {selectedProp.recentForm.map((value, index) => (
                      <View key={index} style={styles.formGameCard}>
                        <Text style={styles.formGameNumber}>Game {5-index}</Text>
                        <Text style={[
                          styles.formGameValue,
                          { color: value > selectedProp.line ? '#10b981' : '#ef4444' }
                        ]}>
                          {value}
                        </Text>
                        <View style={[
                          styles.formGameIndicator,
                          { backgroundColor: value > selectedProp.line ? '#10b981' : '#ef4444' }
                        ]}>
                          <Ionicons 
                            name={value > selectedProp.line ? "trending-up" : "trending-down"} 
                            size={10} 
                            color="white" 
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Quick Actions */}
            <View style={styles.playerModalSection}>
              <Text style={styles.playerModalSectionTitle}>Quick Actions</Text>
              <View style={styles.quickActions}>
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => {
                    addToBettingSlip(selectedProp, 'over');
                    setShowPlayerModal(false);
                  }}
                >
                  <LinearGradient colors={['#10b981', '#059669']} style={styles.quickActionGradient}>
                    <Ionicons name="trending-up" size={20} color="white" />
                    <Text style={styles.quickActionText}>Bet Over {selectedProp.line}</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => {
                    addToBettingSlip(selectedProp, 'under');
                    setShowPlayerModal(false);
                  }}
                >
                  <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.quickActionGradient}>
                    <Ionicons name="trending-down" size={20} color="white" />
                    <Text style={styles.quickActionText}>Bet Under {selectedProp.line}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const LoadingView = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text style={styles.loadingText}>Loading games...</Text>
    </View>
  );

  const ErrorView = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle" size={48} color="#ef4444" />
      <Text style={styles.errorTitle}>Unable to load games</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity 
        style={styles.retryButton} 
        onPress={() => fetchGamesData(activeSport)}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#7c3aed', '#2563eb']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoSection}>
            <View style={styles.logoIcon}>
              <Ionicons name="trophy" size={20} color="white" />
            </View>
            <View>
              <Text style={styles.logoText}>PLAYERBET</Text>
              <Text style={styles.logoSubtext}>Build Your Parlay</Text>
            </View>
          </View>
          
          <View style={styles.userSection}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutSubmit}>
              <Ionicons name="log-out-outline" size={16} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2563eb"
            colors={['#2563eb']}
          />
        }
      >
        {/* UPDATED: Sports Navigation with smaller buttons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sportsNav}
        >
          {sportButtons.map((sport) => (
            <TouchableOpacity
              key={sport.key}
              style={[
                styles.sportButton,
                activeSport === sport.key && styles.sportButtonActive,
                !sport.available && styles.sportButtonDisabled
              ]}
              onPress={() => sport.available && setActiveSport(sport.key)}
              disabled={!sport.available}
            >
              <Text style={[
                styles.sportButtonText,
                activeSport === sport.key && styles.sportButtonTextActive,
                !sport.available && styles.sportButtonTextDisabled
              ]}>
                {sport.label}
              </Text>
              {!sport.available && (
                <Text style={styles.comingSoonText}>Soon</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for players, teams, or props..."
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Content */}
        {loading ? (
          <LoadingView />
        ) : error && (!gamesData[activeSport] || gamesData[activeSport].length === 0) ? (
          <ErrorView />
        ) : (
          <View style={styles.propsSection}>
            <View style={styles.propsGrid}>
              {getCurrentSportData().map(prop => (
                <PlayerPropCard key={prop.id} prop={prop} />
              ))}
              {getCurrentSportData().length === 0 && (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No games available for {sportButtons.find(s => s.key === activeSport)?.label}</Text>
                  <Text style={styles.noDataSubtext}>Try refreshing or check back later</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Player Details Modal */}
      <PlayerDetailsModal />

      {/* Enhanced Betting Slip FAB */}
      {bettingSlip.length > 0 && (
        <TouchableOpacity
          style={[
            styles.fab,
            { 
              backgroundColor: bettingSlip.length >= 2 ? '#2563eb' : '#6b7280',
              ...(bettingSlip.length >= 2 && {
                shadowColor: '#2563eb',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
              })
            }
          ]}
          onPress={handleFABPress}
          activeOpacity={0.8}
        >
          <Text style={styles.fabNumber}>{bettingSlip.length}</Text>
          <Text style={styles.fabText}>PICKS</Text>
          {bettingSlip.length >= 2 && (
            <View style={styles.fabBadge}>
              <Text style={styles.fabBadgeText}>Ready!</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Betting Slip Modal */}
      <Modal
        visible={showBettingSlip}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Parlay Builder ({bettingSlip.length} Picks)
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.clearButton} onPress={clearBettingSlip}>
                <Ionicons name="trash-outline" size={14} color="#ef4444" />
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowBettingSlip(false)}
              >
                <Ionicons name="close" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={styles.modalContent}>
            {bettingSlip.length < 2 && (
              <View style={styles.warningCard}>
                <Ionicons name="alert-circle" size={18} color="#fca5a5" />
                <View style={styles.warningText}>
                  <Text style={styles.warningTitle}>Minimum 2 picks required</Text>
                  <Text style={styles.warningSubtext}>
                    Add {2 - bettingSlip.length} more selection{2 - bettingSlip.length > 1 ? 's' : ''} to place bet
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={20} color="#2563eb" />
          <Text style={[styles.navText, { color: '#2563eb' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="grid-outline" size={20} color="#9ca3af" />
          <Text style={styles.navText}>Sports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="trophy-outline" size={20} color="#9ca3af" />
          <Text style={styles.navText}>My Bets</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={20} color="#9ca3af" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: { flex: 1, backgroundColor: '#000' },
  
  // Header
  header: { paddingHorizontal: 20, paddingVertical: 20 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoSection: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  logoIcon: { width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  logoSubtext: { fontSize: 10, color: 'rgba(255,255,255,0.9)' },
  
  userSection: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 0 },
  userAvatar: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  userAvatarText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 6 },
  logoutText: { color: 'white', fontSize: 13 },

  content: { flex: 1, paddingTop: 20 },
  
  // UPDATED: Sports Navigation with smaller buttons
  sportsNav: { paddingHorizontal: 20, gap: 6, marginBottom: 24 },
  sportButton: { paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#1f2937', borderRadius: 6, minWidth: 70, alignItems: 'center' },
  sportButtonActive: { backgroundColor: '#2563eb' },
  sportButtonDisabled: { backgroundColor: '#374151', opacity: 0.6 },
  sportButtonText: { fontSize: 12, fontWeight: '600', color: '#9ca3af', textAlign: 'center' },
  sportButtonTextActive: { color: 'white' },
  sportButtonTextDisabled: { color: '#6b7280' },
  comingSoonText: { fontSize: 8, color: '#9ca3af', marginTop: 1 },
  
  // Search
  searchContainer: { position: 'relative', marginBottom: 24, marginHorizontal: 20 },
  searchIcon: { position: 'absolute', left: 16, top: 12, zIndex: 1 },
  searchInput: { backgroundColor: '#1f2937', borderWidth: 1, borderColor: '#374151', borderRadius: 8, paddingLeft: 48, paddingRight: 16, paddingVertical: 12, color: 'white', fontSize: 14 },
  
  // Loading/Error States
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  loadingText: { marginTop: 16, fontSize: 16, color: '#9ca3af' },
  
  errorContainer: { alignItems: 'center', padding: 40 },
  errorTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginTop: 16, marginBottom: 8 },
  errorText: { fontSize: 14, color: '#9ca3af', textAlign: 'center', marginBottom: 24 },
  retryButton: { backgroundColor: '#2563eb', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  
  noDataContainer: { alignItems: 'center', padding: 40, width: '100%' },
  noDataText: { fontSize: 16, color: 'white', marginBottom: 8 },
  noDataSubtext: { fontSize: 14, color: '#9ca3af', textAlign: 'center' },
  
  // Props Section
  propsSection: { marginBottom: 80, paddingHorizontal: 20 },
  propsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  
  // UPDATED: Player Prop Card - Simplified without recent form
  propCard: { backgroundColor: '#374151', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#4b5563', width: '48%' },
  propCardSelected: { borderColor: '#3b82f6', borderWidth: 2, backgroundColor: '#1e3a8a' },
  propCardHeader: { paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#475569' },
  matchInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  liveIndicator: { width: 4, height: 4, backgroundColor: '#10b981', borderRadius: 2 },
  matchText: { color: '#cbd5e1', fontSize: 10, fontWeight: '600' },
  matchTime: { backgroundColor: 'rgba(59, 130, 246, 0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  matchTimeText: { fontSize: 9, fontWeight: '600', color: '#60a5fa' },
  
  propCardContent: { padding: 12 },
  playerSection: { flexDirection: 'row', alignItems: 'center', gap: 24, marginBottom: 12 },
  playerAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  playerAvatarText: { fontSize: 14, fontWeight: 'bold', color: 'white' },
  playerInfo: { flex: 1, height: 48, justifyContent: 'center', alignItems: 'flex-start' },
  playerNameContainer: { height: 32, justifyContent: 'center', alignItems: 'flex-start', marginBottom: 2, width: '100%' },
  playerFirstName: { fontSize: 14, fontWeight: '700', color: 'white', textAlign: 'left', lineHeight: 16 },
  playerLastName: { fontSize: 14, fontWeight: '700', color: 'white', textAlign: 'left', lineHeight: 16 },
  playerTeam: { fontSize: 11, fontWeight: '500', color: '#94a3b8', textAlign: 'left' },
  
  // UPDATED: Simplified stat section
  statSection: { borderRadius: 8, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  statLabel: { fontSize: 11, color: '#94a3b8', marginBottom: 6, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  lineSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lineNumber: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  lineText: { fontSize: 20, fontWeight: '900', color: 'white' },
  lineLabel: { fontSize: 10, color: '#60a5fa', fontWeight: '600' },
  
  // NEW: Details button
  detailsButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  detailsButtonText: { fontSize: 9, color: '#60a5fa', fontWeight: '600' },
  
  bettingOptions: { flexDirection: 'row', gap: 6 },
  bettingButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 4, backgroundColor: '#4b5563', borderWidth: 1, borderColor: '#6b7280', borderRadius: 6, alignItems: 'center', minHeight: 60, justifyContent: 'center' },
  bettingButtonSelected: { backgroundColor: '#059669', borderColor: '#10b981' },
  bettingButtonText: { fontSize: 12, fontWeight: '600', color: 'white', marginBottom: 2 },
  bettingButtonTextSelected: { fontWeight: '700' },
  oddsText: { fontSize: 10, color: '#9ca3af', fontWeight: '500' },
  
  selectedIndicator: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 1 },
  checkmark: { width: 8, height: 8, backgroundColor: 'white', borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  selectedText: { fontSize: 8, color: 'white' },
  
  // NEW: Player Details Modal Styles
  playerModal: { flex: 1, backgroundColor: '#000' },
  playerModalHeader: { paddingHorizontal: 20, paddingVertical: 16 },
  playerModalHeaderContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  playerModalInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  playerModalAvatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  playerModalAvatarText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  playerModalName: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  playerModalTeam: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  playerModalClose: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 20 },
  
  playerModalContent: { flex: 1, padding: 20 },
  playerModalSection: { marginBottom: 24 },
  playerModalSectionTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 12 },
  playerModalCard: { borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#374151' },
  
  // Match Details
  matchDetailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  matchDetailsLabel: { fontSize: 14, color: '#9ca3af' },
  matchDetailsValue: { fontSize: 14, fontWeight: '600', color: 'white' },
  
  // Stat Analysis
  statAnalysisHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  statAnalysisMain: { alignItems: 'center' },
  statAnalysisLine: { fontSize: 36, fontWeight: 'bold', color: 'white' },
  statAnalysisLabel: { fontSize: 12, color: '#60a5fa', fontWeight: '600' },
  statAnalysisAvg: { alignItems: 'center' },
  statAnalysisAvgValue: { fontSize: 24, fontWeight: 'bold' },
  statAnalysisAvgLabel: { fontSize: 12, color: '#9ca3af', fontWeight: '600' },
  
  // Performance Indicator
  performanceIndicator: { marginBottom: 16 },
  performanceBar: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center' },
  performanceText: { fontSize: 12, fontWeight: 'bold', color: 'white' },
  
  // Recent Form
  recentFormSection: { marginBottom: 16 },
  recentFormTitle: { fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 12 },
  recentFormGrid: { flexDirection: 'row', gap: 8 },
  formGameCard: { flex: 1, backgroundColor: '#374151', borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#4b5563' },
  formGameNumber: { fontSize: 10, color: '#9ca3af', marginBottom: 4 },
  formGameValue: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  formGameIndicator: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  
  // Betting Analysis
  bettingAnalysisSection: {},
  bettingAnalysisTitle: { fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 12 },
  oddsComparison: { flexDirection: 'row', gap: 12 },
  oddsOption: { flex: 1, backgroundColor: '#374151', borderRadius: 8, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#4b5563' },
  oddsOptionLabel: { fontSize: 12, color: '#9ca3af', marginBottom: 4 },
  oddsOptionValue: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  oddsOptionPayout: { fontSize: 10, color: '#60a5fa' },
  
  // Quick Actions
  quickActions: { flexDirection: 'row', gap: 12 },
  quickActionButton: { flex: 1 },
  quickActionGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 12, borderRadius: 8, gap: 8 },
  quickActionText: { fontSize: 14, fontWeight: '600', color: 'white' },
  
  // FAB
  fab: { 
    position: 'absolute', 
    bottom: 70, 
    right: 20, 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 12, 
    elevation: 12,
    overflow: 'visible'
  },
  fabNumber: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  fabText: { fontSize: 10, color: 'white' },
  fabBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
  },
  fabBadgeText: {
    fontSize: 8,
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Modal styles
  modal: { flex: 1, backgroundColor: '#111827' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#1f2937', borderBottomWidth: 1, borderBottomColor: '#374151' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  modalActions: { flexDirection: 'row', gap: 8 },
  clearButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#374151', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, gap: 4 },
  clearButtonText: { fontSize: 12, color: '#ef4444' },
  closeButton: { backgroundColor: '#374151', padding: 6, borderRadius: 6 },
  
  modalContent: { flex: 1, padding: 16 },
  
  warningCard: { flexDirection: 'row', alignItems: 'center', margin: 16, padding: 12, backgroundColor: '#7c2d12', borderRadius: 8, gap: 8 },
  warningText: { flex: 1 },
  warningTitle: { color: '#fca5a5', fontSize: 14, fontWeight: 'bold' },
  warningSubtext: { color: '#fca5a5', fontSize: 12, opacity: 0.9 },
  
  // Bottom Navigation
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#111827', borderTopWidth: 1, borderTopColor: '#374151', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12 },
  navItem: { alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, color: '#9ca3af' },
};

export default DashboardScreen;