import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

const DashboardScreen = ({ navigation }) => {
  const { user, handleLogout } = useUser();
  
  const handleLogoutSubmit = async () => {
    
    await handleLogout();
    navigation.navigate('Onboarding');
  };
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Header */}
      <LinearGradient colors={['#7c3aed', '#2563eb']} style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <Ionicons name="trophy" size={24} color="white" />
            </View>
            <View>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>PLAYERBET</Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>Build Your Parlay</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 4 }}
            onPress={handleLogoutSubmit}
          >
            <Ionicons name="log-out-outline" size={16} color="white" />
            <Text style={{ color: 'white', fontSize: 14 }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 16, textAlign: 'center' }}>
          Welcome, {user?.name || 'User'}!
        </Text>
        
        <View style={{ backgroundColor: '#1f2937', borderRadius: 12, padding: 20, marginBottom: 20, alignItems: 'center' }}>
          <Ionicons name="wallet" size={48} color="#10b981" style={{ marginBottom: 16 }} />
          <Text style={{ fontSize: 16, color: '#9ca3af', marginBottom: 8 }}>Current Balance</Text>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#10b981' }}>${user?.balance || '1,000'}</Text>
        </View>

        <View style={{ backgroundColor: '#1f2937', borderRadius: 12, padding: 20, alignItems: 'center' }}>
          <Ionicons name="construct" size={64} color="#6b7280" style={{ marginBottom: 16 }} />
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>Dashboard Coming Soon</Text>
          <Text style={{ color: '#9ca3af', textAlign: 'center', marginBottom: 20 }}>
            Full betting interface with player props and live games
          </Text>
          
          <TouchableOpacity
            style={{ width: '100%' }}
            onPress={() => navigation.navigate('Profile')}
          >
            <LinearGradient
              colors={['#2563eb', '#1d4ed8']}
              style={{ paddingVertical: 16, borderRadius: 8, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>View Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
