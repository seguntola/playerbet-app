import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

const DashboardScreen = ({ navigation }) => {
  const { user, handleLogout } = useUser();
  const [activeSport, setActiveSport] = useState('football');
  const [bettingSlip, setBettingSlip] = useState([]);
  const [showBettingSlip, setShowBettingSlip] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [betMode, setBetMode] = useState('beast');

  const beastMultipliers = {
    2: 3, 3: 6, 4: 10, 5: 20, 6: 35, 7: 50, 8: 75, 9: 100, 10: 150
  };

  const safetyMultipliers = {
    2: 2.5, 3: 4, 4: 7, 5: 12, 6: 20, 7: 30, 8: 45, 9: 65, 10: 90
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
    }
  ];

  const getMultiplier = (numSelections) => {
    const multipliers = betMode === 'beast' ? beastMultipliers : safetyMultipliers;
    return multipliers[numSelections] || multipliers[10];
  };

  const getSafetyPlayRules = (numPicks) => {
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

  const handleLogoutSubmit = async () => {
    await handleLogout();
    navigation.navigate('Onboarding');
  };

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
            <Text style={styles.statLabel}>{prop.stat}</Text>
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

          {/* Betting Options */}
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



      <ScrollView style={styles.content}>
        {/* Sports Navigation */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sportsNav}
        >
          {['Football', 'Basketball', 'Tennis', 'Golf', 'Cricket'].map((sport) => (
            <TouchableOpacity
              key={sport}
              style={[
                styles.sportButton,
                activeSport === sport.toLowerCase() && styles.sportButtonActive
              ]}
              onPress={() => setActiveSport(sport.toLowerCase())}
            >
              <Text style={[
                styles.sportButtonText,
                activeSport === sport.toLowerCase() && styles.sportButtonTextActive
              ]}>
                {sport}
              </Text>
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

        {/* Player Props */}
        {activeSport === 'football' && (
          <View style={styles.propsSection}>
            <View style={styles.propsGrid}>
              {footballProps.map(prop => (
                <PlayerPropCard key={prop.id} prop={prop} />
              ))}
            </View>
          </View>
        )}

        {activeSport === 'basketball' && (
          <View style={styles.propsSection}>
            <View style={styles.propsGrid}>
              {basketballProps.map(prop => (
                <PlayerPropCard key={prop.id} prop={prop} />
              ))}
            </View>
          </View>
        )}

        {(activeSport === 'tennis' || activeSport === 'golf' || activeSport === 'cricket') && (
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonIcon}>
              {activeSport === 'tennis' && '🎾'}
              {activeSport === 'golf' && '⛳'}
              {activeSport === 'cricket' && '🏏'}
            </Text>
            <Text style={styles.comingSoonTitle}>
              Coming Soon
            </Text>
            <Text style={styles.comingSoonText}>
              We're working on bringing you the best {activeSport} player props!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Betting Slip FAB */}
      {bettingSlip.length > 0 && (
        <TouchableOpacity
          style={[
            styles.fab,
            { backgroundColor: bettingSlip.length >= 2 ? '#2563eb' : '#6b7280' }
          ]}
          onPress={() => setShowBettingSlip(true)}
        >
          <Text style={styles.fabNumber}>{bettingSlip.length}</Text>
          <Text style={styles.fabText}>PICKS</Text>
        </TouchableOpacity>
      )}

      {/* Betting Slip Modal */}
      <Modal
        visible={showBettingSlip}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modal}>
          {/* Modal Header */}
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
            {/* Minimum picks warning */}
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

            {/* Multiplier Display */}
            {bettingSlip.length >= 2 && (
              <LinearGradient
                colors={betMode === 'beast' ? ['#dc2626', '#ef4444'] : ['#059669', '#10b981']}
                style={styles.multiplierCard}
              >
                <Text style={styles.multiplierLabel}>
                  {betMode === 'beast' ? 'Beast Mode' : 'Safety Play'} Multiplier
                </Text>
                <Text style={styles.multiplierValue}>
                  {getMultiplier(bettingSlip.length)}x
                </Text>
                <Text style={styles.multiplierSubtext}>
                  {bettingSlip.length} Pick {betMode === 'beast' ? 'Parlay' : 'Safety Bet'}
                </Text>
              </LinearGradient>
            )}

            {/* Mode Selection */}
            {bettingSlip.length >= 2 && (
              <View style={styles.modeSelector}>
                <View style={styles.modeButtons}>
                  <TouchableOpacity
                    style={[styles.modeButton, betMode === 'beast' && styles.modeButtonActive]}
                    onPress={() => setBetMode('beast')}
                  >
                    <Text style={styles.modeButtonTitle}>🔥 BEAST MODE</Text>
                    <Text style={styles.modeButtonSubtext}>All picks must win</Text>
                    <Text style={styles.modeButtonSubtext}>Higher multipliers</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modeButton, betMode === 'safety' && styles.modeButtonActiveSafety]}
                    onPress={() => setBetMode('safety')}
                  >
                    <Text style={styles.modeButtonTitle}>🛡️ SAFETY PLAY</Text>
                    <Text style={styles.modeButtonSubtext}>
                      {getSafetyPlayRules(bettingSlip.length).description}
                    </Text>
                    <Text style={styles.modeButtonSubtext}>Forgiving payouts</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Mode Description */}
                <View style={[
                  styles.modeDescription,
                  { borderColor: betMode === 'beast' ? '#dc2626' : '#059669' }
                ]}>
                  <Text style={[
                    styles.modeDescriptionText,
                    { color: betMode === 'beast' ? '#fca5a5' : '#6ee7b7' }
                  ]}>
                    {betMode === 'beast' ? (
                      <>
                        <Text style={styles.modeDescriptionBold}>Beast Mode:</Text> Maximum risk, maximum reward! 
                        All {bettingSlip.length} picks must win or you lose everything. Higher multipliers for bigger payouts.
                      </>
                    ) : (
                      <>
                        <Text style={styles.modeDescriptionBold}>Safety Play:</Text> {getSafetyPlayRules(bettingSlip.length).description} and 
                        still win money! Lower multipliers but much better odds of winning something.
                      </>
                    )}
                  </Text>
                </View>
              </View>
            )}

            {/* Betting Slip Items */}
            <View style={styles.slipItems}>
              {bettingSlip.map((bet, index) => (
                <View key={bet.propId} style={styles.slipItem}>
                  <View style={styles.slipItemContent}>
                    <View style={styles.slipItemHeader}>
                      <View style={styles.slipItemNumber}>
                        <Text style={styles.slipItemNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.slipItemPlayer}>{bet.player.name}</Text>
                    </View>
                    <Text style={styles.slipItemMatch}>
                      {bet.match.home} vs {bet.match.away}
                    </Text>
                    <Text style={styles.slipItemSelection}>
                      {bet.stat}: {bet.selection.toUpperCase()} {bet.line}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeBetFromSlip(bet.propId)}
                  >
                    <Ionicons name="close" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Betting Footer */}
          <View style={styles.bettingFooter}>
            {/* Bet Amount */}
            <View style={styles.betAmountSection}>
              <Text style={styles.betAmountLabel}>Bet Amount</Text>
              <View style={styles.betAmountContainer}>
                <TextInput
                  style={styles.betAmountInput}
                  value={betAmount.toString()}
                  onChangeText={(text) => setBetAmount(parseFloat(text) || 0)}
                  keyboardType="numeric"
                />
                <TouchableOpacity style={styles.quickAmount} onPress={() => setBetAmount(10)}>
                  <Text style={styles.quickAmountText}>$10</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickAmount} onPress={() => setBetAmount(25)}>
                  <Text style={styles.quickAmountText}>$25</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickAmount} onPress={() => setBetAmount(50)}>
                  <Text style={styles.quickAmountText}>$50</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Potential Win */}
            {bettingSlip.length >= 2 && (
              <View style={styles.potentialWinSection}>
                <Text style={styles.potentialWinLabel}>Potential Win:</Text>
                <View style={styles.potentialWinAmount}>
                  {betMode === 'beast' ? (
                    <Text style={styles.potentialWinText}>${calculatePotentialWin()}</Text>
                  ) : (
                    <View>
                      <Text style={styles.potentialWinText}>${calculatePotentialWin().max}</Text>
                      <Text style={styles.potentialWinRange}>
                        (${calculatePotentialWin().min} - ${calculatePotentialWin().max})
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Place Bet Button */}
            {bettingSlip.length >= 2 ? (
              <TouchableOpacity
                style={[
                  styles.placeBetButton,
                  { backgroundColor: betMode === 'beast' ? '#dc2626' : '#10b981' }
                ]}
                onPress={() => {
                  const potentialWin = betMode === 'beast' 
                    ? calculatePotentialWin() 
                    : calculatePotentialWin().max;
                  Alert.alert(
                    'Bet Placed!',
                    `${betMode === 'beast' ? 'Beast Mode' : 'Safety Play'} bet placed successfully!\n` +
                    `${bettingSlip.length} picks @ ${getMultiplier(bettingSlip.length)}x\n` +
                    `Mode: ${betMode === 'beast' ? 'All picks must win' : getSafetyPlayRules(bettingSlip.length).description}\n` +
                    `Stake: $${betAmount}\n` +
                    `Potential Win: ${betMode === 'beast' ? '$' + potentialWin : '$' + calculatePotentialWin().min + ' - $' + calculatePotentialWin().max}`
                  );
                  clearBettingSlip();
                  setShowBettingSlip(false);
                }}
              >
                <Text style={styles.placeBetButtonText}>
                  Place {betMode === 'beast' ? 'Beast Mode' : 'Safety Play'} Bet
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.disabledBetButton} disabled>
                <Text style={styles.disabledBetButtonText}>
                  Add {2 - bettingSlip.length} More Pick{2 - bettingSlip.length > 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
  
  // Sports Navigation
  sportsNav: { paddingHorizontal: 20, gap: 8, marginBottom: 24 },
  sportButton: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#1f2937', borderRadius: 8, minWidth: 100 },
  sportButtonActive: { backgroundColor: '#2563eb' },
  sportButtonText: { fontSize: 14, fontWeight: '600', color: '#9ca3af', textAlign: 'center' },
  sportButtonTextActive: { color: 'white' },
  
  // Search
  searchContainer: { position: 'relative', marginBottom: 24, marginHorizontal: 20 },
  searchIcon: { position: 'absolute', left: 16, top: 12, zIndex: 1 },
  searchInput: { backgroundColor: '#1f2937', borderWidth: 1, borderColor: '#374151', borderRadius: 8, paddingLeft: 48, paddingRight: 16, paddingVertical: 12, color: 'white', fontSize: 14 },
  
  // Props Section
  propsSection: { marginBottom: 80, paddingHorizontal: 20 },
  propsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  
  // Player Prop Card
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
  bettingButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 4, backgroundColor: '#4b5563', borderWidth: 1, borderColor: '#6b7280', borderRadius: 6, alignItems: 'center', minHeight: 55, justifyContent: 'center' },
  bettingButtonSelected: { backgroundColor: '#059669', borderColor: '#10b981' },
  bettingButtonText: { fontSize: 12, fontWeight: '600', color: 'white', marginBottom: 2 },
  bettingButtonTextSelected: { fontWeight: '700' },
  
  selectedIndicator: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 1 },
  checkmark: { width: 8, height: 8, backgroundColor: 'white', borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  selectedText: { fontSize: 8, color: 'white' },
  
  // Coming Soon
  comingSoon: { alignItems: 'center', padding: 60, backgroundColor: '#1f2937', borderRadius: 12, borderWidth: 1, borderColor: '#374151', marginHorizontal: 20 },
  comingSoonIcon: { fontSize: 48, marginBottom: 16 },
  comingSoonTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  comingSoonText: { color: '#9ca3af', fontSize: 14, textAlign: 'center' },
  
  // FAB
  fab: { position: 'absolute', bottom: 70, right: 20, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 12 },
  fabNumber: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  fabText: { fontSize: 10, color: 'white' },
  
  // Modal
  modal: { flex: 1, backgroundColor: '#111827' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#1f2937', borderBottomWidth: 1, borderBottomColor: '#374151' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  modalActions: { flexDirection: 'row', gap: 8 },
  clearButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#374151', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, gap: 4 },
  clearButtonText: { fontSize: 12, color: '#ef4444' },
  closeButton: { backgroundColor: '#374151', padding: 6, borderRadius: 6 },
  
  modalContent: { flex: 1, padding: 16 },
  
  // Warning Card
  warningCard: { flexDirection: 'row', alignItems: 'center', margin: 16, padding: 12, backgroundColor: '#7c2d12', borderRadius: 8, gap: 8 },
  warningText: { flex: 1 },
  warningTitle: { color: '#fca5a5', fontSize: 14, fontWeight: 'bold' },
  warningSubtext: { color: '#fca5a5', fontSize: 12, opacity: 0.9 },
  
  // Multiplier Card
  multiplierCard: { margin: 16, padding: 16, borderRadius: 8, alignItems: 'center' },
  multiplierLabel: { fontSize: 14, opacity: 0.9, marginBottom: 4, color: 'white' },
  multiplierValue: { fontSize: 36, fontWeight: 'bold', color: 'white' },
  multiplierSubtext: { fontSize: 12, opacity: 0.9, color: 'white' },
  
  // Mode Selector
  modeSelector: { margin: 16 },
  modeButtons: { backgroundColor: '#1f2937', borderRadius: 12, padding: 8, flexDirection: 'row', gap: 8, borderWidth: 1, borderColor: '#374151' },
  modeButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  modeButtonActive: { backgroundColor: '#dc2626' },
  modeButtonActiveSafety: { backgroundColor: '#059669' },
  modeButtonTitle: { fontWeight: 'bold', fontSize: 14, color: 'white', marginBottom: 4 },
  modeButtonSubtext: { fontSize: 10, opacity: 0.8, color: 'white' },
  
  modeDescription: { marginTop: 12, padding: 12, borderRadius: 8, borderWidth: 1 },
  modeDescriptionText: { fontSize: 12, lineHeight: 16 },
  modeDescriptionBold: { fontWeight: 'bold' },
  
  // Slip Items
  slipItems: { margin: 16, gap: 12 },
  slipItem: { backgroundColor: '#1f2937', borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#374151' },
  slipItemContent: { flex: 1 },
  slipItemHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  slipItemNumber: { width: 24, height: 24, backgroundColor: '#4b5563', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  slipItemNumberText: { fontSize: 12, fontWeight: 'bold', color: 'white' },
  slipItemPlayer: { fontWeight: 'bold', fontSize: 14, color: 'white' },
  slipItemMatch: { fontSize: 12, color: '#9ca3af', marginBottom: 4 },
  slipItemSelection: { fontSize: 13, color: '#60a5fa' },
  removeButton: { padding: 4 },
  
  // Betting Footer
  bettingFooter: { padding: 16, backgroundColor: '#1f2937', borderTopWidth: 1, borderTopColor: '#374151' },
  betAmountSection: { marginBottom: 16 },
  betAmountLabel: { fontSize: 12, color: '#9ca3af', marginBottom: 6 },
  betAmountContainer: { flexDirection: 'row', gap: 8 },
  betAmountInput: { flex: 1, backgroundColor: '#374151', borderWidth: 1, borderColor: '#4b5563', borderRadius: 6, padding: 8, color: 'white', fontSize: 16, fontWeight: 'bold' },
  quickAmount: { backgroundColor: '#374151', borderWidth: 1, borderColor: '#4b5563', borderRadius: 6, paddingHorizontal: 16, paddingVertical: 8 },
  quickAmountText: { color: 'white', fontSize: 14 },
  
  potentialWinSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, fontSize: 16 },
  potentialWinLabel: { color: 'white' },
  potentialWinAmount: { alignItems: 'flex-end' },
  potentialWinText: { fontWeight: 'bold', color: '#10b981', fontSize: 20 },
  potentialWinRange: { fontSize: 12, opacity: 0.7, color: '#10b981' },
  
  placeBetButton: { paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  placeBetButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  disabledBetButton: { paddingVertical: 14, backgroundColor: '#4b5563', borderRadius: 8, alignItems: 'center' },
  disabledBetButtonText: { color: '#9ca3af', fontSize: 16, fontWeight: 'bold' },
  
  // Bottom Navigation
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#111827', borderTopWidth: 1, borderTopColor: '#374151', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12 },
  navItem: { alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, color: '#9ca3af' },
};

export default DashboardScreen;