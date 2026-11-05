import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
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
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerLeft: (props) => {
            if (props?.canGoBack || navigation.canGoBack()) {
              return (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
              );
            }
            return null;
          },
        })}
      >
        {isLogged ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="CreateCar"
              component={CreateCar}
              options={{ title: 'Add Car' }}
            />

            <Stack.Screen
              name="Cars"
              component={CarsScreen}
              options={{ title: 'My Cars' }}
            />

            <Stack.Screen
              name="Contact"
              component={ContactScreen}
              options={{ title: 'Contact Us' }}
            />

            <Stack.Screen
              name="GeminiChat"
              component={GeminiChatScreen}
              options={{ title: 'AI Chat' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Sign Up' }}
            />

            <Stack.Screen
              name="ForgetPassword"
              component={ForgetPasswordScreen}
              options={{ title: 'Reset Password' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    paddingRight: 12,
    paddingLeft: 4,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B71F3',
  },
});