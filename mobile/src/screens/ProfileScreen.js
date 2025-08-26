import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

const ProfileScreen = ({ navigation }) => {
  const { user, handleLogout } = useUser();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Header */}
      <LinearGradient colors={['#7c3aed', '#2563eb']} style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* User Info */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <LinearGradient
            colors={['#3b82f6', '#1d4ed8']}
            style={{ width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}
          >
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </LinearGradient>
          
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 }}>
            {user?.name || 'User'}
          </Text>
          <Text style={{ fontSize: 16, color: '#9ca3af' }}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>

        {/* Balance */}
        <View style={{ backgroundColor: '#1f2937', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 14, color: '#9ca3af', marginBottom: 4 }}>Current Balance</Text>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#10b981' }}>${user?.balance || '1,000'}</Text>
        </View>

        {/* Stats */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 16 }}>Statistics</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {[
              { label: 'Total Bets', value: '0', color: 'white' },
              { label: 'Win Rate', value: '0%', color: 'white' },
              { label: 'Total Wagered', value: '$0', color: 'white' },
              { label: 'Net Profit', value: '$0', color: '#10b981' },
            ].map((stat, index) => (
              <View key={index} style={{ backgroundColor: '#1f2937', borderRadius: 12, padding: 16, flex: 1, minWidth: '45%', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: stat.color, marginBottom: 4 }}>{stat.value}</Text>
                <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#1f2937', paddingHorizontal: 16, paddingVertical: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            onPress={handleLogout}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="log-out-outline" size={24} color="#ef4444" />
              <Text style={{ fontSize: 16, color: '#ef4444', fontWeight: '500' }}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
