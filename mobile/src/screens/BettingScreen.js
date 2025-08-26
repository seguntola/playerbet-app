import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const BettingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <LinearGradient colors={['#7c3aed', '#2563eb']} style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Betting</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <Ionicons name="analytics-outline" size={80} color="#3b82f6" style={{ marginBottom: 32 }} />
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 16, textAlign: 'center' }}>
          Advanced Betting
        </Text>
        <Text style={{ fontSize: 16, color: '#9ca3af', marginBottom: 40, textAlign: 'center' }}>
          Coming Soon - Advanced betting features
        </Text>
        <TouchableOpacity
          style={{ width: '100%' }}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <LinearGradient
            colors={['#2563eb', '#1d4ed8']}
            style={{ paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Back to Dashboard</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BettingScreen;
