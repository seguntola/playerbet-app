import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const onboardingData = [
    {
      id: 1,
      title: 'Welcome to PlayerBet',
      subtitle: 'The future of sports betting',
      description: 'Experience the most advanced player prop betting platform with real-time odds and instant payouts.',
      icon: 'trophy',
      backgroundColor: ['#1e40af', '#3b82f6'],
    },
    {
      id: 2,
      title: 'Smart Betting',
      subtitle: 'Beast Mode & Safety Play',
      description: 'Choose your risk level. Beast Mode for maximum rewards or Safety Play for more forgiving payouts.',
      icon: 'flash',
      backgroundColor: ['#7c3aed', '#a855f7'],
    },
    {
      id: 3,
      title: 'Live Props',
      subtitle: 'Real-time player statistics',
      description: 'Bet on your favorite players with live updates and comprehensive performance analytics.',
      icon: 'stats-chart',
      backgroundColor: ['#dc2626', '#ef4444'],
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < onboardingData.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const renderOnboardingItem = ({ item }) => (
    <LinearGradient
      colors={item.backgroundColor}
      style={[styles.slide, { width }]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={80} color="white" />
        </View>
        
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {onboardingData.map((item) => renderOnboardingItem({ item }))}
      </ScrollView>

      {/* Page Indicators */}
      <View style={styles.indicatorContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor: index === currentIndex ? '#10b981' : '#4b5563',
                width: index === currentIndex ? 32 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <LinearGradient
            colors={['#7c3aed', '#6d28d9']}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SignUp')}
        >
          <LinearGradient
            colors={['#2563eb', '#1d4ed8']}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingBottom: 32,
    gap: 16,
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
});

export default OnboardingScreen;
