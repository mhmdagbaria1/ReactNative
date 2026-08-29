import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { auth } from '../Firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const validate = () => {
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };
  const handleLogin = async () => {
    if (!validate()) return;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('userLogged', 'true');
    } catch (error) {
      console.log('Error caught in login:', error);
      console.log('Error code:', error.code);
      
      let errorMessage = error.message;
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Please check your email.';
      }


      Alert.alert('Login Error', errorMessage);
      if (typeof window !== 'undefined' && window.alert) {
         window.alert(errorMessage);
      }
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <CustomInput
        placeholder="Email"
        value={email}
        setValue={setEmail}
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Password"
        value={password}
        setValue={setPassword}
        secureTextEntry
      />
      <CustomButton title="Login" onPress={handleLogin} />
      
      <View style={styles.linksContainer}>
        <Text style={styles.linkText} onPress={() => navigation.navigate('ForgetPassword')}>
          Forgot Password?
        </Text>
        <Text style={styles.linkText} onPress={() => navigation.navigate('Register')}>
          Don't have an account? Sign Up
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F9FBFC',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  linksContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#3B71F3',
    marginVertical: 10,
    fontWeight: 'bold',
  }
});