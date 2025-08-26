import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

const ProfileScreen = ({ navigation }) => {
  const { user, handleLogout } = useUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await handleLogout();
    navigation.navigate('Onboarding');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Mock user stats (in real app, would come from API)
  const userStats = {
    totalBets: 23,
    winRate: 67,
    totalWagered: 2450,
    netProfit: 890,
    biggestWin: 2500,
    currentStreak: 5,
    favoriteSport: 'Football',
    memberSince: 'March 2024'
  };

  const recentBets = [
    {
      id: 1,
      date: '2024-08-24',
      sport: 'Football',
      description: '3-Pick Beast Mode Parlay',
      amount: 50,
      payout: 300,
      status: 'Won',
      picks: ['Haaland Over 1.5 Goals', 'Salah Over 2.0 G+A', 'KDB Over 0.5 Assists']
    },
    {
      id: 2,
      date: '2024-08-23',
      sport: 'Basketball',
      description: '2-Pick Safety Play',
      amount: 25,
      payout: 0,
      status: 'Lost',
      picks: ['LeBron Over 27.5 Points', 'Curry Over 35.5 P+A']
    },
    {
      id: 3,
      date: '2024-08-22',
      sport: 'Football',
      description: '5-Pick Beast Mode Parlay',
      amount: 100,
      payout: 2000,
      status: 'Won',
      picks: ['Arsenal Win', 'Over 2.5 Goals', 'Saka Over 2.5 SOT', '+ 2 more']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Won': return '#10b981';
      case 'Lost': return '#ef4444';
      case 'Pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Won': return 'checkmark-circle';
      case 'Lost': return 'close-circle';
      case 'Pending': return 'time';
      default: return 'help-circle';
    }
  };

  const ProfileMenuItem = ({ icon, title, subtitle, onPress, showArrow = true, rightComponent }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <Ionicons name={icon} size={24} color="#60a5fa" />
        </View>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {rightComponent}
        {showArrow && <Ionicons name="chevron-forward" size={20} color="#6b7280" />}
      </View>
    </TouchableOpacity>
  );

  const StatCard = ({ label, value, color = 'white', icon }) => (
    <View style={styles.statCard}>
      {icon && (
        <View style={styles.statIcon}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
      )}
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#7c3aed', '#2563eb']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={() => setShowSettings(true)}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <LinearGradient
            colors={['#1f2937', '#111827']}
            style={styles.userCardGradient}
          >
            {/* Avatar and Basic Info */}
            <View style={styles.userInfo}>
              <LinearGradient
                colors={['#3b82f6', '#1d4ed8']}
                style={styles.userAvatar}
              >
                <Text style={styles.userAvatarText}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </LinearGradient>
              
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
                <View style={styles.memberSince}>
                  <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
                  <Text style={styles.memberSinceText}>Member since {userStats.memberSince}</Text>
                </View>
              </View>
            </View>

            {/* Balance Display */}
            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceAmount}>${user?.balance || '1,000'}</Text>
              <View style={styles.balanceActions}>
                <TouchableOpacity style={styles.balanceButton}>
                  <Ionicons name="add" size={16} color="#10b981" />
                  <Text style={styles.balanceButtonText}>Deposit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.balanceButton}>
                  <Ionicons name="arrow-up" size={16} color="#f59e0b" />
                  <Text style={styles.balanceButtonText}>Withdraw</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          
          {/* Key Stats Row */}
          <View style={styles.keyStats}>
            <StatCard label="Win Rate" value={`${userStats.winRate}%`} color="#10b981" icon="trending-up" />
            <StatCard label="Total Bets" value={userStats.totalBets} color="white" icon="trophy-outline" />
            <StatCard label="Net Profit" value={`$${userStats.netProfit}`} color="#10b981" icon="cash-outline" />
          </View>
          
          {/* Detailed Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard label="Total Wagered" value={`$${userStats.totalWagered}`} color="white" />
            <StatCard label="Biggest Win" value={`$${userStats.biggestWin}`} color="#fbbf24" />
            <StatCard label="Current Streak" value={`${userStats.currentStreak}W`} color="#10b981" />
            <StatCard label="Favorite Sport" value={userStats.favoriteSport} color="#60a5fa" />
          </View>
        </View>

        {/* Recent Bets Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bets</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.recentBets}>
            {recentBets.map((bet) => (
              <View key={bet.id} style={styles.betCard}>
                <View style={styles.betHeader}>
                  <View style={styles.betInfo}>
                    <Text style={styles.betSport}>{bet.sport}</Text>
                    <Text style={styles.betDate}>{new Date(bet.date).toLocaleDateString()}</Text>
                  </View>
                  <View style={[styles.betStatus, { backgroundColor: getStatusColor(bet.status) + '20' }]}>
                    <Ionicons 
                      name={getStatusIcon(bet.status)} 
                      size={14} 
                      color={getStatusColor(bet.status)} 
                    />
                    <Text style={[styles.betStatusText, { color: getStatusColor(bet.status) }]}>
                      {bet.status}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.betDescription}>{bet.description}</Text>
                
                <View style={styles.betPicks}>
                  {bet.picks.map((pick, index) => (
                    <Text key={index} style={styles.betPick}>• {pick}</Text>
                  ))}
                </View>
                
                <View style={styles.betAmount}>
                  <Text style={styles.betWager}>Wagered: ${bet.amount}</Text>
                  {bet.status === 'Won' && (
                    <Text style={styles.betPayout}>Won: ${bet.payout}</Text>
                  )}
                  {bet.status === 'Lost' && (
                    <Text style={styles.betLoss}>Lost: ${bet.amount}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.menuSection}>
            <ProfileMenuItem
              icon="person-outline"
              title="Personal Information"
              subtitle="Update your details"
              onPress={() => Alert.alert('Coming Soon', 'Personal information editing coming soon!')}
            />
            
            <ProfileMenuItem
              icon="card-outline"
              title="Payment Methods"
              subtitle="Manage deposits & withdrawals"
              onPress={() => Alert.alert('Coming Soon', 'Payment methods coming soon!')}
            />
            
            <ProfileMenuItem
              icon="shield-checkmark-outline"
              title="Security"
              subtitle="Password, 2FA, biometrics"
              onPress={() => Alert.alert('Coming Soon', 'Security settings coming soon!')}
            />
            
            <ProfileMenuItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Bet alerts and updates"
              onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon!')}
            />
            
            <ProfileMenuItem
              icon="help-circle-outline"
              title="Help & Support"
              subtitle="FAQ, contact us"
              onPress={() => Alert.alert('Coming Soon', 'Help center coming soon!')}
            />
            
            <ProfileMenuItem
              icon="document-text-outline"
              title="Terms & Privacy"
              subtitle="Legal information"
              onPress={() => Alert.alert('Coming Soon', 'Legal documents coming soon!')}
            />
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModal}>
            <Text style={styles.logoutModalTitle}>Logout</Text>
            <Text style={styles.logoutModalMessage}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.logoutModalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelLogout}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmLogout}>
                <Text style={styles.confirmButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.settingsModal}>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>Settings</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.settingsContent}>
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Preferences</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="notifications-outline" size={24} color="#60a5fa" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Push Notifications</Text>
                    <Text style={styles.settingSubtitle}>Bet results and promotions</Text>
                  </View>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#374151', true: '#10b981' }}
                  thumbColor={notificationsEnabled ? '#ffffff' : '#9ca3af'}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="finger-print" size={24} color="#60a5fa" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>Biometric Login</Text>
                    <Text style={styles.settingSubtitle}>Face ID or Touch ID</Text>
                  </View>
                </View>
                <Switch
                  value={biometricEnabled}
                  onValueChange={setBiometricEnabled}
                  trackColor={{ false: '#374151', true: '#10b981' }}
                  thumbColor={biometricEnabled ? '#ffffff' : '#9ca3af'}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  container: { flex: 1, backgroundColor: '#000' },
  
  // Header
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  
  content: { flex: 1 },
  
  // User Card
  userCard: { margin: 20, borderRadius: 16, overflow: 'hidden' },
  userCardGradient: { padding: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  userAvatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  userAvatarText: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  userDetails: { flex: 1 },
  userName: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  userEmail: { fontSize: 16, color: '#9ca3af', marginBottom: 8 },
  memberSince: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  memberSinceText: { fontSize: 14, color: '#9ca3af' },
  
  // Balance
  balanceSection: { alignItems: 'center' },
  balanceLabel: { fontSize: 14, color: '#9ca3af', marginBottom: 4 },
  balanceAmount: { fontSize: 28, fontWeight: 'bold', color: '#10b981', marginBottom: 16 },
  balanceActions: { flexDirection: 'row', gap: 12 },
  balanceButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 4 },
  balanceButtonText: { color: 'white', fontSize: 14, fontWeight: '500' },
  
  // Sections
  section: { marginHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 16 },
  seeAllText: { color: '#3b82f6', fontSize: 14 },
  
  // Stats
  keyStats: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { backgroundColor: '#1f2937', borderRadius: 12, padding: 16, flex: 1, minWidth: '30%', alignItems: 'center', borderWidth: 1, borderColor: '#374151' },
  statIcon: { marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#9ca3af', textAlign: 'center' },
  
  // Recent Bets
  recentBets: { gap: 12 },
  betCard: { backgroundColor: '#1f2937', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#374151' },
  betHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  betInfo: { flex: 1 },
  betSport: { fontSize: 14, fontWeight: '600', color: '#60a5fa', marginBottom: 2 },
  betDate: { fontSize: 12, color: '#9ca3af' },
  betStatus: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  betStatusText: { fontSize: 12, fontWeight: '500' },
  betDescription: { fontSize: 16, fontWeight: '600', color: 'white', marginBottom: 8 },
  betPicks: { marginBottom: 12 },
  betPick: { fontSize: 12, color: '#9ca3af', marginBottom: 2 },
  betAmount: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  betWager: { fontSize: 14, color: '#9ca3af' },
  betPayout: { fontSize: 14, fontWeight: '600', color: '#10b981' },
  betLoss: { fontSize: 14, fontWeight: '600', color: '#ef4444' },
  
  // Menu
  menuSection: { backgroundColor: '#1f2937', borderRadius: 12, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#374151' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  menuItemIcon: { marginRight: 12 },
  menuItemText: { flex: 1 },
  menuItemTitle: { fontSize: 16, fontWeight: '500', color: 'white', marginBottom: 2 },
  menuItemSubtitle: { fontSize: 14, color: '#9ca3af' },
  menuItemRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  
  // Logout
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1f2937', paddingVertical: 16, borderRadius: 12, gap: 12, borderWidth: 1, borderColor: '#374151' },
  logoutText: { fontSize: 16, color: '#ef4444', fontWeight: '500' },
  
  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  logoutModal: { backgroundColor: '#1f2937', borderRadius: 16, padding: 24, width: '100%', maxWidth: 300, alignItems: 'center' },
  logoutModalTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  logoutModalMessage: { fontSize: 14, color: '#9ca3af', textAlign: 'center', marginBottom: 24 },
  logoutModalActions: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelButton: { flex: 1, backgroundColor: '#374151', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  confirmButton: { flex: 1, backgroundColor: '#ef4444', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  confirmButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  
  // Settings Modal
  settingsModal: { flex: 1, backgroundColor: '#000' },
  settingsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#374151' },
  settingsTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  settingsContent: { flex: 1, padding: 20 },
  settingsSection: { marginBottom: 32 },
  settingsSectionTitle: { fontSize: 16, fontWeight: '600', color: 'white', marginBottom: 16 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#374151' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingText: { marginLeft: 12, flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '500', color: 'white', marginBottom: 2 },
  settingSubtitle: { fontSize: 14, color: '#9ca3af' },
};

export default ProfileScreen;