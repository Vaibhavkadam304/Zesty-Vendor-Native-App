import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import MainTabs from './src/screens/MainTabs';
import OrdersScreen from './src/screens/OrdersScreen';
import POSScreen from './src/screens/POSScreen';
import UpdateStoreScreen from './src/screens/UpdateStoreScreen';
import DefaultLogin from './src/screens/DefaultLogin';
import OrderDetailsScreen from './src/screens/OrderDetailsScreen';
import SplashScreen from './src/screens/SplashScreen';
import CustomDrawerContent from './src/screens/CustomDrawerContent';


import { StripeTerminalProvider } from '@stripe/stripe-terminal-react-native';

MaterialCommunityIcons.loadFont();

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const theme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: '#33006F',
    background: '#F8F6F4',
  },
};

// ← helper to fetch your connection token
const fetchConnectionToken = async () => {
  try {
    const res = await fetch('http://192.168.1.6:3000/connection_token', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const { secret } = await res.json();
    console.log('✅ connection token:', secret);
    return secret;
  } catch (err) {
    console.error('❌ fetchConnectionToken error:', err);
    throw err; // rethrow so the SDK sees the failure
  }
};

function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="MainTabs"
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="MainTabs" component={MainTabs} />
      <Drawer.Screen name="Orders" component={OrdersScreen} />
      <Drawer.Screen name="POS" component={POSScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      delay: 1200,
      useNativeDriver: true,
    }).start(() => {
      setSplashVisible(false);
    });
  }, [fadeAnim]);

  if (isSplashVisible) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
        <Image
          source={require('./assets/splash_logo.png')}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </Animated.View>
    );
  }

  return (
    <StripeTerminalProvider
      tokenProvider={fetchConnectionToken}
      logLevel="info"
      simulated={true}
    >
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="DefaultLogin">
            <Stack.Screen
              name="DefaultLogin"
              component={DefaultLogin}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen
              name="Home"
              component={AppDrawer}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OrderDetails"
              component={OrderDetailsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="UpdateStore"
              component={UpdateStoreScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StripeTerminalProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#E8E0F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});
