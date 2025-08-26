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
    if (currentScreen < 2) {
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

  // Screen 1: Logo Splash (matches web)
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

  // Screen 2: App Preview (matches web)
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
            colors={['#111827', '#000']}
            style={styles.phoneContent}
          >
            {/* Mock App Header */}
            <View style={styles.mockHeader}>
              <View style={styles.mockHeaderContent}>
                <Ionicons name="trophy" size={16} color="#60a5fa" />
                <Text style={styles.mockHeaderText}>PlayerBet</Text>
              </View>
            </View>
            
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
              <View style={styles.mockTab}>
                <Text style={styles.mockTabText}>Golf</Text>
              </View>
            </View>
            
            {/* Search Bar */}
            <View style={styles.mockSearchBar}>
              <Text style={styles.mockSearchText}>🔍 Search for players, teams...</Text>
            </View>
            
            {/* Mock Game Cards */}
            <View style={styles.mockCards}>
              <View style={styles.mockCard}>
                <View style={styles.mockCardHeader}>
                  <Text style={styles.mockCardTime}>Today 8:00 PM</Text>
                  <Text style={styles.mockCardLive}>LIVE</Text>
                </View>
                <View style={styles.mockCardRow}>
                  <Text style={styles.mockCardTeam}>Team A</Text>
                  <Text style={styles.mockCardOdds}>2.1</Text>
                </View>
                <View style={styles.mockCardRow}>
                  <Text style={styles.mockCardTeam}>Team B</Text>
                  <Text style={styles.mockCardOdds}>1.8</Text>
                </View>
              </View>
              <View style={[styles.mockCard, { opacity: 0.75 }]}>
                <View style={styles.mockCardHeader}>
                  <Text style={styles.mockCardTime}>Tomorrow 3:00 PM</Text>
                </View>
                <View style={styles.mockCardRow}>
                  <Text style={styles.mockCardTeam}>Team C</Text>
                  <Text style={styles.mockCardOdds}>1.9</Text>
                </View>
                <View style={styles.mockCardRow}>
                  <Text style={styles.mockCardTeam}>Team D</Text>
                  <Text style={styles.mockCardOdds}>2.0</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Floating elements */}
        <View style={styles.floatingElement1}>
          <Ionicons name="trending-up" size={24} color="#60a5fa" />
        </View>
        <View style={styles.floatingElement2}>
          <Ionicons name="star" size={16} color="#fbbf24" />
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
        <View style={styles.indicatorInactive} />
      </View>
    </View>
  );

  // Screen 3: Final CTA (matches web)
  const SplashScreen3 = () => (
    <View style={styles.finalScreen}>
      <View style={styles.finalContent}>
        <Text style={styles.finalTitle}>
          Predict, play and{'\n'}
          <Text style={styles.finalHighlight}>win big</Text>
        </Text>
        <Text style={styles.finalSubtitle}>
          Get ready to place your bets
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
        <View style={styles.indicatorInactive} />
        <View style={styles.indicatorActive} />
      </View>
    </View>
  );

  const screens = [SplashScreen1, SplashScreen2, SplashScreen3];
  const CurrentScreenComponent = screens[currentScreen];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
        <CurrentScreenComponent />
      </Animated.View>

      {/* Development Navigation (for testing) */}
      {currentScreen > 0 && (
        <View style={styles.devNav}>
          <TouchableOpacity
            style={styles.devButton}
            onPress={() => setCurrentScreen(Math.max(0, currentScreen - 1))}
          >
            <Text style={styles.devButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.devButton}
            onPress={nextScreen}
          >
            <Text style={styles.devButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingVertical: 32,
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
    paddingHorizontal: 32,
    position: 'relative',
  },
  phoneMockup: {
    width: 256,
    height: 384,
    backgroundColor: '#111827',
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
    overflow: 'hidden',
  },
  phoneContent: {
    height: '100%',
    padding: 16,
  },
  mockHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  mockHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mockHeaderText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  mockTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  mockTab: {
    flex: 1,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  mockTabActive: {
    backgroundColor: '#2563eb',
  },
  mockTabText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  mockTabTextActive: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  mockSearchBar: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  mockSearchText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  mockCards: {
    gap: 8,
  },
  mockCard: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 12,
  },
  mockCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mockCardTime: {
    fontSize: 10,
    color: '#9ca3af',
  },
  mockCardLive: {
    fontSize: 10,
    color: '#10b981',
  },
  mockCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
  },
  mockCardTeam: {
    fontSize: 10,
    color: 'white',
  },
  mockCardOdds: {
    fontSize: 10,
    color: '#60a5fa',
  },
  floatingElement1: {
    position: 'absolute',
    top: -32,
    right: -32,
    width: 64,
    height: 64,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  floatingElement2: {
    position: 'absolute',
    bottom: -24,
    left: -24,
    width: 48,
    height: 48,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  contentSection: {
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 30,
  },
  highlightText: {
    color: '#60a5fa',
  },
  description: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    maxWidth: 400,
    alignSelf: 'center',
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  button: {
    flex: 1,
  },
  gradientButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 24,
  },
  indicatorInactive: {
    width: 8,
    height: 8,
    backgroundColor: '#4b5563',
    borderRadius: 4,
  },
  indicatorActive: {
    width: 32,
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  finalScreen: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 32,
  },
  finalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  finalTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 52,
  },
  finalHighlight: {
    color: '#60a5fa',
  },
  finalSubtitle: {
    fontSize: 18,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 48,
  },
  devNav: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  devButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  devButtonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default OnboardingScreen;