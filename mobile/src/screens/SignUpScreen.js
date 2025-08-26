import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const SignUpScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 32 }}>
      <View style={{ alignItems: 'center' }}>
        <Ionicons name="person-add" size={80} color="#3b82f6" style={{ marginBottom: 32 }} />
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 16, textAlign: 'center' }}>
          Sign Up
        </Text>
        <Text style={{ fontSize: 16, color: '#9ca3af', marginBottom: 40, textAlign: 'center' }}>
          Registration form coming soon
        </Text>
        <TouchableOpacity
          style={{ width: '100%', marginBottom: 16 }}
          onPress={() => navigation.navigate('Login')}
        >
          <LinearGradient
            colors={['#2563eb', '#1d4ed8']}
            style={{ paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Go to Login</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
