import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const handleResetPassword = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      if (Platform.OS === 'web') {
        window.alert('Success: An email has been sent to your address for Reset Password.');
        navigation.navigate('Login');
      } else {
        Alert.alert(
          'Success',
          'An email has been sent to your address for Reset Password.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
      setEmail('');
    } catch (error) {
      const errorMessage = error.code === 'auth/user-not-found' 
        ? 'No account found with this email.' 
        : error.message;
        
      if (Platform.OS === 'web') {
        window.alert('Error: ' + errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <CustomInput
        placeholder="Enter your email"
        value={email}
        setValue={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <CustomButton
        title={loading ? "Sending..." : "Send Reset Link"}
        onPress={handleResetPassword}
      />
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
});