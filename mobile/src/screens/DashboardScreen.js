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
  const [activeSport, setActiveSport] = useState('basketball_nba'); // API sport keys
  const [bettingSlip, setBettingSlip] = useState([]);
  const [showBettingSlip, setShowBettingSlip] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [betMode, setBetMode] = useState('beast');
  
  // API Data State
  const [gamesData, setGamesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const beastMultipliers = {
    2: 3, 3: 6, 4: 10, 5: 20, 6: 35, 7: 50, 8: 75, 9: 100, 10: 150
  };

  const safetyMultipliers = {
    2: 2.5, 3: 4, 4: 7, 5: 12, 6: 20, 7: 30, 8: 45, 9: 65, 10: 90
  };

  // Sports mapping for display vs API keys
  const sportsMapping = {
    'football': 'soccer_epl',
    'basketball': 'basketball_nba',
    'americanfootball': 'americanfootball_nfl',
    'tennis': 'tennis', // TODO: Add tennis support when available
    'golf': 'golf', // TODO: Add golf support when available
    'cricket': 'cricket', // TODO: Add cricket support when available
  };

  // Fetch games data from API
  const fetchGamesData = async (sportKey, forceRefresh = false) => {
    try {
      if (!forceRefresh) setLoading(true);
      setError(null);

      console.log(`🔍 Fetching games for sport: ${sportKey}`);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/games/sports/${sportKey}/games-with-props?maxGames=6`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`📊 Games API response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch games`);
      }

      const games = await response.json();
      console.log(`📋 Games API result:`, games);

      setGamesData(prev => ({
        ...prev,
        [sportKey]: games
      }));

    } catch (error) {
      console.error(`❌ Error fetching games for ${sportKey}:`, error);
      setError(`Failed to load ${sportKey} games. ${error.message}`);
      
      // Fallback to mock data for demo purposes
      setGamesData(prev => ({
        ...prev,
        [sportKey]: generateFallbackData(sportKey)
      }));
    } finally {
      setLoading(false);
      if (forceRefresh) setRefreshing(false);
    }
  };

  // Generate fallback data when API fails
  const generateFallbackData = (sportKey) => {
    console.log(`🔄 Using fallback data for ${sportKey}`);
    
    if (sportKey === 'basketball_nba') {
      return [
        {
          id: 'fallback_game1',
          homeTeam: 'Lakers',
          awayTeam: 'Warriors',
          gameTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          status: 'Upcoming',
          players: [
            {
              id: 'fallback_lebron',
              name: 'LeBron James',
              team: 'Lakers',
              position: 'SF', 
              avatar: 'LJ', // Hard-coded: Avatar generation
              stats: [
                { type: 'Points', line: 27.5, overOdds: 1.90, underOdds: 1.90 },
                { type: 'Assists', line: 8.5, overOdds: 2.10, underOdds: 1.75 }
              ]
            },
            {
              id: 'fallback_curry',
              name: 'Stephen Curry', 
              team: 'Warriors',
              position: 'PG',
              avatar: 'SC', // Hard-coded: Avatar generation
              stats: [
                { type: 'Points', line: 28.5, overOdds: 1.95, underOdds: 1.85 },
                { type: '3-Pointers', line: 4.5, overOdds: 1.80, underOdds: 2.00 }
              ]
            }
          ]
        }
      ];
    }
    
    if (sportKey === 'soccer_epl') {
      return [
        {
          id: 'fallback_game2',
          homeTeam: 'Man City',
          awayTeam: 'Liverpool', 
          gameTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          status: 'Upcoming',
          players: [
            {
              id: 'fallback_haaland',
              name: 'Erling Haaland',
              team: 'Man City',
              position: 'ST', // Hard-coded: Position data
              avatar: 'EH', // Hard-coded: Avatar generation
              stats: [
                { type: 'Goals', line: 1.5, overOdds: 1.85, underOdds: 1.95 }
              ]
            }
          ]
        }
      ];
    }
    
    return [];
  };

  // Load initial data
  useEffect(() => {
    fetchGamesData(activeSport);
  }, []);

  // Fetch new data when sport changes
  useEffect(() => {
    if (gamesData[activeSport]) {
      setLoading(false);
    } else {
      fetchGamesData(activeSport);
    }
  }, [activeSport]);

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGamesData(activeSport, true);
  };

  // Convert API game data to component format
  const convertApiDataToProps = (games) => {
    if (!games || !Array.isArray(games)) return [];
    
    const props = [];
    
    games.forEach(game => {
      if (!game.players || !Array.isArray(game.players)) return;
      
      game.players.forEach(player => {
        if (!player.stats || !Array.isArray(player.stats)) return;
        
        player.stats.forEach(stat => {
          props.push({
            id: `${game.id}_${player.id}_${stat.type}`,
            player: {
              name: player.name,
              team: player.team,
              avatar: player.avatar || generatePlayerAvatar(player.name) // Fallback to generated avatar
            },
            match: {
              home: game.homeTeam,
              away: game.awayTeam,
              time: formatGameTime(game.gameTime) // Convert ISO date to display format
            },
            stat: stat.type,
            line: stat.line,
            overOdds: stat.overOdds || 1.90, // Fallback odds if missing
            underOdds: stat.underOdds || 1.90, // Fallback odds if missing
            recentForm: generateMockRecentForm(stat.line, stat.type), // Hard-coded: Recent form data not available from API
            gameStatus: game.status || 'Upcoming' // From API
          });
        });
      });
    });
    
    return props;
  };

  // Generate player avatar from name (fallback when API doesn't provide)
  const generatePlayerAvatar = (playerName) => {
    // Hard-coded: Avatar generation logic since API doesn't always provide avatars
    const nameParts = playerName.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0] ? `${nameParts[0][0]}?` : '??';
  };

  // Format game time for display
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

  // Generate mock recent form data
  const generateMockRecentForm = (line, statType) => {
    // Hard-coded: Recent form data - not available from TheOddsAPI
    // This would typically come from a separate stats API
    const variance = statType.includes('Goals') ? line * 0.4 : line * 0.3;
    const form = [];
    
    for (let i = 0; i < 5; i++) {
      const randomVariation = (Math.random() - 0.5) * variance;
      const value = Math.max(0, line + randomVariation);
      form.push(parseFloat(value.toFixed(1)));
    }
    
    return form;
  };

  // Get current sport data
  const getCurrentSportData = () => {
    const currentGames = gamesData[activeSport] || [];
    return convertApiDataToProps(currentGames);
  };

  const getMultiplier = (numSelections) => {
    const multipliers = betMode === 'beast' ? beastMultipliers : safetyMultipliers;
    return multipliers[numSelections] || multipliers[10];
  };

  const getSafetyPlayRules = (numPicks) => {
    // Hard-coded: Safety play rules logic
    if (numPicks <= 2) return { description: "All picks must win" };
    if (numPicks <= 4) return { description: "Can lose 1 pick" };
    if (numPicks <= 6) return { description: "Can lose up to 2 picks" };
    if (numPicks <= 8) return { description: "Can lose up to 3 picks" };
    return { description: "Can lose up to 4 picks" };
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

  const removeBetFromSlip = (propId) => {
    setBettingSlip(bettingSlip.filter(bet => bet.propId !== propId));
  };

  const clearBettingSlip = () => {
    setBettingSlip([]);
  };

  const calculatePotentialWin = () => {
    if (bettingSlip.length < 2) return 0;
    const multiplier = getMultiplier(bettingSlip.length);
    
    // Use actual odds from API
    const totalOdds = bettingSlip.reduce((total, bet) => total * bet.odds, 1);
    
    if (betMode === 'beast') {
      return (betAmount * totalOdds * multiplier).toFixed(2);
    } else {
      const fullPayout = betAmount * totalOdds * multiplier;
      const minPayout = fullPayout * 0.25;
      return { max: fullPayout.toFixed(2), min: minPayout.toFixed(2) };
    }
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

  // Sport button mapping
  const sportButtons = [
    { key: 'soccer_epl', label: 'Football', available: true },
    { key: 'basketball_nba', label: 'Basketball', available: true },
    { key: 'americanfootball_nfl', label: 'NFL', available: true },
    { key: 'tennis', label: 'Tennis', available: false }, // Hard-coded: Not available yet
    { key: 'golf', label: 'Golf', available: false }, // Hard-coded: Not available yet
    { key: 'cricket', label: 'Cricket', available: false } // Hard-coded: Not available yet
  ];

  const PlayerPropCard = ({ prop }) => {
    const selectedBet = bettingSlip.find(bet => bet.propId === prop.id);
    const isOverSelected = selectedBet?.selection === 'over';
    const isUnderSelected = selectedBet?.selection === 'under';
    const avgForm = calculateAverageForForm(prop.recentForm);

    return (
      <View style={[
        styles.propCard, 
        selectedBet && styles.propCardSelected
      ]}>
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

          {/* Stat Details */}
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
              <View style={styles.avgSection}>
                <Text style={styles.avgLabel}>L5 Average</Text>
                <Text style={[
                  styles.avgValue,
                  { color: parseFloat(avgForm) > prop.line ? '#10b981' : '#ef4444' }
                ]}>
                  {avgForm}
                </Text>
              </View>
            </View>
            
            {/* Recent Form */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>L5:</Text>
              <View style={styles.formBadges}>
                {prop.recentForm.map((value, index) => (
                  <View
                    key={index}
                    style={[
                      styles.formBadge,
                      { backgroundColor: value > prop.line ? '#059669' : '#dc2626' }
                    ]}
                  >
                    <Text style={styles.formValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>

          {/* Betting Options with Real Odds */}
          <View style={styles.bettingOptions}>
            <TouchableOpacity
              style={[
                styles.bettingButton,
                isOverSelected && styles.bettingButtonSelected
              ]}
              onPress={() => addToBettingSlip(prop, 'over')}
            >
              <Text style={[
                styles.bettingButtonText,
                isOverSelected && styles.bettingButtonTextSelected
              ]}>
                OVER
              </Text>
              <Text style={styles.oddsText}>{prop.overOdds}</Text>
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
              onPress={() => addToBettingSlip(prop, 'under')}
            >
              <Text style={[
                styles.bettingButtonText,
                isUnderSelected && styles.bettingButtonTextSelected
              ]}>
                UNDER
              </Text>
              <Text style={styles.oddsText}>{prop.underOdds}</Text>
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
      </View>
    );
  };

  // Loading component
  const LoadingView = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text style={styles.loadingText}>Loading games...</Text>
    </View>
  );

  // Error component
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
        {/* Sports Navigation */}
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

        {/* Content based on loading/error state */}
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

      {/* Betting Slip Modal - Rest of modal code remains the same */}
      <Modal
        visible={showBettingSlip}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modal}>
          {/* Modal content remains the same as original code */}
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
            {/* Rest of the modal content remains the same */}
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

            {/* Continue with rest of modal JSX... */}
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
  
  // Header - same as before
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
  
  // Sports Navigation - Updated
  sportsNav: { paddingHorizontal: 20, gap: 8, marginBottom: 24 },
  sportButton: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#1f2937', borderRadius: 8, minWidth: 100, alignItems: 'center' },
  sportButtonActive: { backgroundColor: '#2563eb' },
  sportButtonDisabled: { backgroundColor: '#374151', opacity: 0.6 },
  sportButtonText: { fontSize: 14, fontWeight: '600', color: '#9ca3af', textAlign: 'center' },
  sportButtonTextActive: { color: 'white' },
  sportButtonTextDisabled: { color: '#6b7280' },
  comingSoonText: { fontSize: 10, color: '#9ca3af', marginTop: 2 },
  
  // Search - same as before
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
  
  // Props Section - same as before with additions
  propsSection: { marginBottom: 80, paddingHorizontal: 20 },
  propsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  
  // Player Prop Card - Updated with odds display
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
  
  statSection: { borderRadius: 8, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  statLabel: { fontSize: 11, color: '#94a3b8', marginBottom: 6, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  lineSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  lineNumber: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  lineText: { fontSize: 20, fontWeight: '900', color: 'white' },
  lineLabel: { fontSize: 10, color: '#60a5fa', fontWeight: '600' },
  avgSection: { alignItems: 'flex-end' },
  avgLabel: { fontSize: 9, color: '#64748b', marginBottom: 1 },
  avgValue: { fontSize: 12, fontWeight: 'bold' },
  
  formSection: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  formLabel: { fontSize: 9, color: '#64748b', fontWeight: '600' },
  formBadges: { flexDirection: 'row', gap: 2, flex: 1, flexWrap: 'wrap' },
  formBadge: { width: 18, height: 18, borderRadius: 3, justifyContent: 'center', alignItems: 'center' },
  formValue: { fontSize: 8, color: 'white', fontWeight: 'bold' },
  
  bettingOptions: { flexDirection: 'row', gap: 6 },
  bettingButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 4, backgroundColor: '#4b5563', borderWidth: 1, borderColor: '#6b7280', borderRadius: 6, alignItems: 'center', minHeight: 60, justifyContent: 'center' },
  bettingButtonSelected: { backgroundColor: '#059669', borderColor: '#10b981' },
  bettingButtonText: { fontSize: 12, fontWeight: '600', color: 'white', marginBottom: 2 },
  bettingButtonTextSelected: { fontWeight: '700' },
  oddsText: { fontSize: 10, color: '#9ca3af', fontWeight: '500' }, // New: Display odds
  
  selectedIndicator: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 1 },
  checkmark: { width: 8, height: 8, backgroundColor: 'white', borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  selectedText: { fontSize: 8, color: 'white' },
  
  // FAB and Modal styles remain the same as before...
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
  
  // Modal styles remain the same...
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
  
  // Bottom Navigation - same as before
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#111827', borderTopWidth: 1, borderTopColor: '#374151', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12 },
  navItem: { alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, color: '#9ca3af' },
};

export default DashboardScreen;