import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Auto-advance from first screen after 3 seconds
  useEffect(() => {
    if (currentScreen === 0) {
      // Start pulse animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      const timer = setTimeout(() => {
        nextScreen();
        pulse.stop();
      }, 3000);
      return () => {
        clearTimeout(timer);
        pulse.stop();
      };
    }
  }, [currentScreen]);

  const nextScreen = () => {
    if (currentScreen < 1) {
      setIsAnimating(true);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentScreen(prev => prev + 1);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsAnimating(false);
        });
      });
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  // Screen 1: Logo Splash
  const SplashScreen1 = () => (
    <LinearGradient
      colors={['#1e40af', '#3b82f6', '#2563eb']}
      style={styles.splashContainer}
    >
      <View style={styles.logoContainer}>
        <Animated.View style={[styles.logoWrapper, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.logoBackground}>
            <View style={styles.logoInner}>
              <Ionicons name="trophy" size={32} color="#1e40af" />
            </View>
          </View>
          <View style={styles.logoPulse} />
        </Animated.View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.appName}>PlayerBet</Text>
          <View style={styles.titleUnderline} />
        </View>
        

      </View>
      
      {/* Loading indicator */}
      <View style={styles.loadingIndicator}>
        {[0, 1, 2].map((index) => (
          <Animated.View
            key={index}
            style={[
              styles.loadingDot,
              {
                opacity: fadeAnim,
                transform: [{
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  })
                }]
              }
            ]}
          />
        ))}
      </View>
    </LinearGradient>
  );

  // Screen 2: App Preview with realistic dashboard mockup
  const SplashScreen2 = () => (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLogo}>
          <LinearGradient
            colors={['#2563eb', '#3b82f6']}
            style={styles.headerLogoIcon}
          >
            <Ionicons name="trophy" size={20} color="white" />
          </LinearGradient>
          <Text style={styles.headerLogoText}>PlayerBet</Text>
        </View>
      </View>

      {/* Phone Mockup */}
      <View style={styles.mockupContainer}>
        <View style={styles.phoneMockup}>
          <LinearGradient
            colors={['#000', '#111827']}
            style={styles.phoneContent}
          >
            {/* Mock App Header - Exactly like mobile dashboard */}
            <LinearGradient colors={['#7c3aed', '#2563eb']} style={styles.mockHeader}>
              <View style={styles.mockHeaderContent}>
                <View style={styles.mockHeaderLeft}>
                  <View style={styles.mockLogoIcon}>
                    <Ionicons name="trophy" size={12} color="white" />
                  </View>
                  <View>
                    <Text style={styles.mockHeaderTitle}>PLAYERBET</Text>
                    <Text style={styles.mockHeaderSubtitle}>Build Your Parlay</Text>
                  </View>
                </View>
                <View style={styles.mockHeaderRight}>
                  <View style={styles.mockUserAvatar}>
                    <Text style={styles.mockUserAvatarText}>A</Text>
                  </View>
                  <View style={styles.mockLogoutButton}>
                    <Ionicons name="log-out-outline" size={8} color="white" />
                    <Text style={styles.mockLogoutText}>Logout</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
            
            {/* Navigation Tabs */}
            <View style={styles.mockTabs}>
              <View style={[styles.mockTab, styles.mockTabActive]}>
                <Text style={styles.mockTabTextActive}>Football</Text>
              </View>
              <View style={styles.mockTab}>
                <Text style={styles.mockTabText}>Basketball</Text>
              </View>
              <View style={styles.mockTab}>
                <Text style={styles.mockTabText}>Tennis</Text>
              </View>
            </View>
            
            {/* Search Bar */}
            <View style={styles.mockSearchBar}>
              <Ionicons name="search" size={12} color="#9ca3af" />
              <Text style={styles.mockSearchText}>Search players...</Text>
            </View>
            
            {/* Mock Player Prop Cards - 2x2 Grid layout like actual mobile dashboard */}
            <View style={styles.mockCards}>
              {/* First Row - Erling Haaland and Bukayo Saka side by side */}
              <View style={styles.mockCardRow}>
                {/* Card 1 - Erling Haaland */}
                <View style={[styles.mockCard, styles.mockCardSelected]}>
                  {/* Match Header with live indicator */}
                  <LinearGradient
                    colors={['#0f172a', '#1e293b']}
                    style={styles.mockCardHeader}
                  >
                    <View style={styles.mockMatchInfo}>
                      <View style={styles.mockLiveIndicator} />
                      <Text style={styles.mockMatchText}>Man City vs Liverpool</Text>
                    </View>
                    <View style={styles.mockMatchTime}>
                      <Text style={styles.mockMatchTimeText}>Today 8:00 PM</Text>
                    </View>
                  </LinearGradient>

                  {/* Player Section */}
                  <View style={styles.mockCardContent}>
                    <View style={styles.mockPlayerSection}>
                      <LinearGradient
                        colors={['#6366f1', '#3b82f6']}
                        style={styles.mockPlayerAvatar}
                      >
                        <Text style={styles.mockPlayerAvatarText}>EH</Text>
                      </LinearGradient>
                      <View style={styles.mockPlayerInfo}>
                        <View style={styles.mockPlayerNameContainer}>
                          <Text style={styles.mockPlayerFirstName}>Erling</Text>
                          <Text style={styles.mockPlayerLastName}>Haaland</Text>
                        </View>
                        <Text style={styles.mockPlayerTeam}>Man City</Text>
                      </View>
                    </View>

                    {/* Stat Section with gradient background */}
                    <LinearGradient
                      colors={['#0f172a', '#1e293b']}
                      style={styles.mockStatSection}
                    >
                      <Text style={styles.mockStatLabel}>GOALS</Text>
                      <View style={styles.mockStatLine}>
                        <View style={styles.mockStatNumber}>
                          <Text style={styles.mockStatValue}>1.5</Text>
                          <Text style={styles.mockStatUnit}>LINE</Text>
                        </View>
                        <View style={styles.mockStatAvgSection}>
                          <Text style={styles.mockStatAvgLabel}>L5 Avg</Text>
                          <Text style={styles.mockStatAvg}>1.6</Text>
                        </View>
                      </View>
                    </LinearGradient>

                    {/* Betting Options */}
                    <View style={styles.mockBettingOptions}>
                      <View style={styles.mockBettingButton}>
                        <Text style={styles.mockBettingButtonText}>OVER</Text>
                      </View>
                      <View style={[styles.mockBettingButton, styles.mockBettingButtonSelected]}>
                        <Text style={styles.mockBettingButtonSelectedText}>UNDER</Text>
                        <View style={styles.mockSelectedIndicator}>
                          <View style={styles.mockCheckmark}>
                            <Ionicons name="checkmark" size={4} color="#059669" />
                          </View>
                          <Text style={styles.mockSelectedText}>Selected</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Card 2 - Bukayo Saka (side by side with Haaland) */}
                <View style={styles.mockCard}>
                  {/* Match Header with live indicator */}
                  <LinearGradient
                    colors={['#0f172a', '#1e293b']}
                    style={styles.mockCardHeader}
                  >
                    <View style={styles.mockMatchInfo}>
                      <View style={styles.mockLiveIndicator} />
                      <Text style={styles.mockMatchText}>Arsenal vs Chelsea</Text>
                    </View>
                    <View style={styles.mockMatchTime}>
                      <Text style={styles.mockMatchTimeText}>Tomorrow 3:00 PM</Text>
                    </View>
                  </LinearGradient>

                  {/* Player Section */}
                  <View style={styles.mockCardContent}>
                    <View style={styles.mockPlayerSection}>
                      <LinearGradient
                        colors={['#6366f1', '#3b82f6']}
                        style={styles.mockPlayerAvatar}
                      >
                        <Text style={styles.mockPlayerAvatarText}>BS</Text>
                      </LinearGradient>
                      <View style={styles.mockPlayerInfo}>
                        <View style={styles.mockPlayerNameContainer}>
                          <Text style={styles.mockPlayerFirstName}>Bukayo</Text>
                          <Text style={styles.mockPlayerLastName}>Saka</Text>
                        </View>
                        <Text style={styles.mockPlayerTeam}>Arsenal</Text>
                      </View>
                    </View>

                    {/* Stat Section with gradient background */}
                    <LinearGradient
                      colors={['#0f172a', '#1e293b']}
                      style={styles.mockStatSection}
                    >
                      <Text style={styles.mockStatLabel}>SHOTS ON TARGET</Text>
                      <View style={styles.mockStatLine}>
                        <View style={styles.mockStatNumber}>
                          <Text style={styles.mockStatValue}>2.5</Text>
                          <Text style={styles.mockStatUnit}>LINE</Text>
                        </View>
                        <View style={styles.mockStatAvgSection}>
                          <Text style={styles.mockStatAvgLabel}>L5 Avg</Text>
                          <Text style={styles.mockStatAvg}>2.8</Text>
                        </View>
                      </View>
                    </LinearGradient>

                    {/* Betting Options */}
                    <View style={styles.mockBettingOptions}>
                      <View style={styles.mockBettingButton}>
                        <Text style={styles.mockBettingButtonText}>OVER</Text>
                      </View>
                      <View style={styles.mockBettingButton}>
                        <Text style={styles.mockBettingButtonText}>UNDER</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Second Row - Cole Palmer and Marcus Rashford side by side */}
              <View style={styles.mockCardRow}>
                {/* Card 3 - Cole Palmer */}
                <View style={[styles.mockCard, { opacity: 0.7 }]}>
                  {/* Match Header with live indicator */}
                  <LinearGradient
                    colors={['#0f172a', '#1e293b']}
                    style={styles.mockCardHeader}
                  >
                    <View style={styles.mockMatchInfo}>
                      <View style={styles.mockLiveIndicator} />
                      <Text style={styles.mockMatchText}>Chelsea vs Spurs</Text>
                    </View>
                    <View style={styles.mockMatchTime}>
                      <Text style={styles.mockMatchTimeText}>Sat 2:00 PM</Text>
                    </View>
                  </LinearGradient>

                  {/* Player Section */}
                  <View style={styles.mockCardContent}>
                    <View style={styles.mockPlayerSection}>
                      <LinearGradient
                        colors={['#6366f1', '#3b82f6']}
                        style={styles.mockPlayerAvatar}
                      >
                        <Text style={styles.mockPlayerAvatarText}>CP</Text>
                      </LinearGradient>
                      <View style={styles.mockPlayerInfo}>
                        <View style={styles.mockPlayerNameContainer}>
                          <Text style={styles.mockPlayerFirstName}>Cole</Text>
                          <Text style={styles.mockPlayerLastName}>Palmer</Text>
                        </View>
                        <Text style={styles.mockPlayerTeam}>Chelsea</Text>
                      </View>
                    </View>

                    {/* Stat Section with gradient background */}
                    <LinearGradient
                      colors={['#0f172a', '#1e293b']}
                      style={styles.mockStatSection}
                    >
                      <Text style={styles.mockStatLabel}>GOALS</Text>
                      <View style={styles.mockStatLine}>
                        <View style={styles.mockStatNumber}>
                          <Text style={styles.mockStatValue}>0.5</Text>
                          <Text style={styles.mockStatUnit}>LINE</Text>
                        </View>
                        <View style={styles.mockStatAvgSection}>
                          <Text style={styles.mockStatAvgLabel}>L5 Avg</Text>
                          <Text style={styles.mockStatAvg}>0.6</Text>
                        </View>
                      </View>
                    </LinearGradient>

                    {/* Betting Options */}
                    <View style={styles.mockBettingOptions}>
                      <View style={styles.mockBettingButton}>
                        <Text style={styles.mockBettingButtonText}>OVER</Text>
                      </View>
                      <View style={styles.mockBettingButton}>
                        <Text style={styles.mockBettingButtonText}>UNDER</Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                {/* Card 4 - Marcus Rashford */}
                <View style={[styles.mockCard, { opacity: 0.7 }]}>
                  {/* Match Header with live indicator */}
                  <LinearGradient
                    colors={['#0f172a', '#1e293b']}
                    style={styles.mockCardHeader}
                  >
                    <View style={styles.mockMatchInfo}>
                      <View style={styles.mockLiveIndicator} />
                      <Text style={styles.mockMatchText}>Man Utd vs Newcastle</Text>
                    </View>
                    <View style={styles.mockMatchTime}>
                      <Text style={styles.mockMatchTimeText}>Sun 4:00 PM</Text>
                    </View>
                  </LinearGradient>

                  {/* Player Section */}
                  <View style={styles.mockCardContent}>
                    <View style={styles.mockPlayerSection}>
                      <LinearGradient
                        colors={['#6366f1', '#3b82f6']}
                        style={styles.mockPlayerAvatar}
                      >
                        <Text style={styles.mockPlayerAvatarText}>MR</Text>
                      </LinearGradient>
                      <View style={styles.mockPlayerInfo}>
                        <View style={styles.mockPlayerNameContainer}>
                          <Text style={styles.mockPlayerFirstName}>Marcus</Text>
                          <Text style={styles.mockPlayerLastName}>Rashford</Text>
                        </View>
                        <Text style={styles.mockPlayerTeam}>Man Utd</Text>
                      </View>
                    </View>

                    {/* Stat Section with gradient background */}
                    <LinearGradient
                      colors={['#0f172a', '#1e293b']}
                      style={styles.mockStatSection}
                    >
                      <Text style={styles.mockStatLabel}>GOALS + ASSISTS</Text>
                      <View style={styles.mockStatLine}>
                        <View style={styles.mockStatNumber}>
                          <Text style={styles.mockStatValue}>1.5</Text>
                          <Text style={styles.mockStatUnit}>LINE</Text>
                        </View>
                        <View style={styles.mockStatAvgSection}>
                          <Text style={styles.mockStatAvgLabel}>L5 Avg</Text>
                          <Text style={styles.mockStatAvg}>1.4</Text>
                        </View>
                      </View>
                    </LinearGradient>

                    {/* Betting Options */}
                    <View style={styles.mockBettingOptions}>
                      <View style={styles.mockBettingButton}>
                        <Text style={styles.mockBettingButtonText}>OVER</Text>
                      </View>
                      <View style={styles.mockBettingButton}>
                        <Text style={styles.mockBettingButtonText}>UNDER</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Bottom Navigation */}
            <View style={styles.mockBottomNav}>
              <View style={[styles.mockNavItem, styles.mockNavItemActive]}>
                <Ionicons name="home" size={12} color="#2563eb" />
                <Text style={styles.mockNavTextActive}>Home</Text>
              </View>
              <View style={styles.mockNavItem}>
                <Ionicons name="trophy-outline" size={12} color="#9ca3af" />
                <Text style={styles.mockNavText}>My Bets</Text>
              </View>
              <View style={styles.mockNavItem}>
                <Ionicons name="person-outline" size={12} color="#9ca3af" />
                <Text style={styles.mockNavText}>Profile</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={styles.mainTitle}>
          Discover a new world of{'\n'}
          <Text style={styles.highlightText}>betting</Text>
        </Text>
        <Text style={styles.description}>
          Join the millions of players around the{'\n'}
          world who are cashing out on their{'\n'}
          favorite sports
        </Text>
      </View>



      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <LinearGradient colors={['#7c3aed', '#6d28d9']} style={styles.gradientButton}>
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <LinearGradient colors={['#2563eb', '#1d4ed8']} style={styles.gradientButton}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Page Indicator */}
      <View style={styles.pageIndicator}>
        <View style={styles.indicatorInactive} />
        <View style={styles.indicatorActive} />
      </View>
    </View>
  );

  const screens = [SplashScreen1, SplashScreen2];
  const CurrentScreenComponent = screens[currentScreen];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
        <CurrentScreenComponent />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 32,
  },
  logoWrapper: {
    position: 'relative',
  },
  logoBackground: {
    width: 96,
    height: 96,
    backgroundColor: '#facc15',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '12deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
  },
  logoInner: {
    width: 64,
    height: 64,
    backgroundColor: '#eab308',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-12deg' }],
  },
  logoPulse: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    backgroundColor: '#fde047',
    borderRadius: 12,
  },
  titleContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: -1,
  },
  titleUnderline: {
    width: 64,
    height: 4,
    backgroundColor: '#facc15',
    marginTop: 12,
    borderRadius: 2,
  },
  loadingIndicator: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  mockupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  phoneMockup: {
    width: Math.min(240, width * 0.7),
    height: Math.min(420, height * 0.5),
    backgroundColor: '#111827',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
  },
  phoneContent: {
    height: '100%',
    width: '100%',
  },
  mockHeader: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  mockHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mockHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mockLogoIcon: {
    width: 16,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockHeaderTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'white',
  },
  mockHeaderSubtitle: {
    fontSize: 6,
    color: 'rgba(255,255,255,0.9)',
  },
  mockHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mockUserAvatar: {
    width: 16,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockUserAvatarText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: 'white',
  },
  mockLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 3,
  },
  mockLogoutText: {
    fontSize: 6,
    color: 'white',
  },
  mockTabs: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  mockTab: {
    flex: 1,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 4,
  },
  mockTabActive: {
    backgroundColor: '#2563eb',
  },
  mockTabText: {
    fontSize: 7,
    color: '#9ca3af',
  },
  mockTabTextActive: {
    fontSize: 7,
    color: 'white',
    fontWeight: '500',
  },
  mockSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 10,
    marginVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#374151',
  },
  mockSearchText: {
    fontSize: 7,
    color: '#9ca3af',
  },
  mockCards: {
    paddingHorizontal: 10,
    flex: 1,
    gap: 6,
  },
  mockCardRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  mockCard: {
    backgroundColor: '#374151',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4b5563',
    overflow: 'hidden',
    flex: 1,
    minWidth: 0, // Important for flex to work properly
  },
  mockCardSelected: {
    backgroundColor: '#1e3a8a',
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  mockCardHeader: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
  },
  mockMatchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  mockLiveIndicator: {
    width: 3,
    height: 3,
    backgroundColor: '#10b981',
    borderRadius: 1.5,
  },
  mockMatchText: {
    fontSize: 6,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  mockMatchTime: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    marginTop: 2,
  },
  mockMatchTimeText: {
    fontSize: 5,
    color: '#60a5fa',
    fontWeight: '600',
  },
  mockSmallMatchText: {
    fontSize: 5,
    color: '#cbd5e1',
  },
  mockCardContent: {
    padding: 8,
  },
  mockPlayerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  mockPlayerAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockPlayerAvatarText: {
    fontSize: 6,
    fontWeight: 'bold',
    color: 'white',
  },
  mockSmallPlayerAvatar: {
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockSmallPlayerAvatarText: {
    fontSize: 5,
    fontWeight: 'bold',
    color: 'white',
  },
  mockPlayerInfo: {
    flex: 1,
  },
  mockPlayerNameContainer: {
    marginBottom: 1,
  },
  mockPlayerFirstName: {
    fontSize: 7,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 8,
  },
  mockPlayerLastName: {
    fontSize: 7,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 8,
  },
  mockPlayerTeam: {
    fontSize: 5,
    color: '#94a3b8',
  },
  mockStatNumber: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  mockStatUnit: {
    fontSize: 5,
    color: '#60a5fa',
    fontWeight: '600',
  },
  mockStatAvgSection: {
    alignItems: 'flex-end',
  },
  mockStatAvgLabel: {
    fontSize: 4,
    color: '#64748b',
    marginBottom: 1,
  },
  mockFormSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  mockFormLabel: {
    fontSize: 4,
    color: '#64748b',
    fontWeight: '600',
  },
  mockFormBadges: {
    flexDirection: 'row',
    gap: 2,
  },
  mockFormBadge: {
    width: 10,
    height: 10,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockFormValue: {
    fontSize: 5,
    color: 'white',
    fontWeight: 'bold',
  },
  mockSelectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  mockCheckmark: {
    width: 6,
    height: 6,
    backgroundColor: 'white',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockSelectedText: {
    fontSize: 4,
    color: 'white',
  },
  mockCardSmaller: {
    opacity: 0.8,
  },
  mockSmallCardHeader: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
  },
  mockSmallCardContent: {
    padding: 6,
  },
  mockSmallPlayerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  mockSmallPlayerName: {
    fontSize: 6,
    fontWeight: 'bold',
    color: 'white',
  },
  mockSmallPlayerStat: {
    fontSize: 5,
    color: '#94a3b8',
  },
  mockStatSection: {
    borderRadius: 4,
    padding: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  mockStatLabel: {
    fontSize: 5,
    color: '#94a3b8',
    marginBottom: 2,
    fontWeight: '600',
  },
  mockStatLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mockStatValue: {
    fontSize: 12,
    fontWeight: '900',
    color: 'white',
  },
  mockStatAvg: {
    fontSize: 5,
    color: '#10b981',
    fontWeight: 'bold',
  },
  mockBettingOptions: {
    flexDirection: 'row',
    gap: 4,
  },
  mockBettingButton: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: '#4b5563',
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6b7280',
  },
  mockBettingButtonSelected: {
    backgroundColor: '#059669',
    borderColor: '#10b981',
  },
  mockBettingButtonText: {
    fontSize: 6,
    fontWeight: '600',
    color: 'white',
  },
  mockBettingButtonSelectedText: {
    fontSize: 6,
    fontWeight: 'bold',
    color: 'white',
  },
  mockSmallBettingOptions: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 4,
  },
  mockSmallBettingButton: {
    flex: 1,
    paddingVertical: 4,
    backgroundColor: '#4b5563',
    borderRadius: 3,
    alignItems: 'center',
  },
  mockSmallBettingButtonText: {
    fontSize: 5,
    color: 'white',
  },
  floatingElement1: {
    position: 'absolute',
    top: '15%',
    right: '5%',
    width: 44,
    height: 44,
    backgroundColor: 'rgba(37, 99, 235, 0.3)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(96, 165, 250, 0.5)',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  floatingElement2: {
    position: 'absolute',
    bottom: '25%',
    left: '5%',
    width: 36,
    height: 36,
    backgroundColor: 'rgba(251, 191, 36, 0.3)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(251, 191, 36, 0.5)',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  mockBottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
    backgroundColor: '#111827',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  mockNavItem: {
    alignItems: 'center',
    gap: 2,
  },
  mockNavItemActive: {
    // Active state styling
  },
  mockNavText: {
    fontSize: 5,
    color: '#9ca3af',
  },
  mockNavTextActive: {
    fontSize: 5,
    color: '#2563eb',
  },
  contentSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  highlightText: {
    color: '#60a5fa',
  },
  description: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  button: {
    flex: 1,
  },
  gradientButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 16,
  },
  indicatorInactive: {
    width: 8,
    height: 8,
    backgroundColor: '#4b5563',
    borderRadius: 4,
  },
  indicatorActive: {
    width: 24,
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
});

export default OnboardingScreen;