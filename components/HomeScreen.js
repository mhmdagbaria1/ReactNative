import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../Firebase/firebase';
import { signOut } from 'firebase/auth';
import CustomButton from '../components/CustomButton';
export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState('');
  useEffect(() => {
    const getUser = async () => {
      const data = await AsyncStorage.getItem('user');
      if (data) {
        const parsed = JSON.parse(data);
        setUser(parsed.email);
      }
    };
    getUser();
  }, []);
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.setItem('userLogged', 'false');
      await signOut(auth); 
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>{user}</Text>
      <CustomButton title="Add New Car" onPress={() => navigation.navigate('CreateCar')} />
      <View style={{ height: 10 }} />
      <CustomButton title="Manage Cars" onPress={() => navigation.navigate('Cars')} />
      <View style={{ height: 10 }} />
      <CustomButton title="Contact Us" onPress={() => navigation.navigate('Contact')} />
      <View style={{ height: 10 }} />
      <CustomButton title="AI Chat (Gemini)" onPress={() => navigation.navigate('GeminiChat')} />
      <View style={{ height: 10 }} />
      <CustomButton title="Logout" onPress={logout} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FBFC',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#666'
  }
});