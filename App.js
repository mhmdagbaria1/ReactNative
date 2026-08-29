import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase/firebase';
import LoginScreen from './components/Login';
import RegisterScreen from './components/SignUp';
import HomeScreen from './components/HomeScreen';
import CreateCar from './components/CreateCar';
import CarsScreen from './components/CarsScreen';
import ContactScreen from './components/Contact';
import GeminiChatScreen from './components/GeminiChat';
import ForgetPasswordScreen from './components/ForgetPassword';

const Stack = createNativeStackNavigator();
export default function App() {
  const [isLogged, setIsLogged] = useState(null);
  useEffect(() => {
    const checkUser = async () => {
      const value = await AsyncStorage.getItem('userLogged');
      if (value === 'true') {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    };
    checkUser();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await AsyncStorage.setItem('userLogged', 'true');
        setIsLogged(true);
      } else {
        await AsyncStorage.setItem('userLogged', 'false');
        setIsLogged(false);
      }
    });
    return unsubscribe;
  }, []);
  if (isLogged === null) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLogged ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CreateCar" component={CreateCar} options={{ title: 'Add Car' }} />
            <Stack.Screen name="Cars" component={CarsScreen} options={{ title: 'My Cars' }} />
            <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact Us' }} />
            <Stack.Screen name="GeminiChat" component={GeminiChatScreen} options={{ title: 'AI Chat' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Sign Up' }} />
            <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{ title: 'Reset Password' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}