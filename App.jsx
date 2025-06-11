import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
// Screens
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import MainTabs from './src/screens/MainTabs';
import OrdersScreen from './src/screens/OrdersScreen';
import EnquiriesScreen from './src/screens/EnquiriesScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import POSScreen from './src/screens/POSScreen';
import UpdateStoreScreen from './src/screens/UpdateStoreScreen';
import DefaultLogin from './src/screens/DefaultLogin';
import OrderDetailsScreen from './src/screens/OrderDetailsScreen';
import SplashScreen from './src/screens/SplashScreen';
import CustomDrawerContent from './src/screens/CustomDrawerContent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
MaterialCommunityIcons.loadFont(); // 👈 This forces the icon font to load
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const theme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: '#33006F',
    // surface: '#E8E0F7',
    background: '#F8F6F4',  // ← define your background color here
  },
};
function AppDrawer() {
  return (
     <Drawer.Navigator
      initialRouteName="MainTabs"
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="MainTabs" component={MainTabs} options={{ title: 'Main-Tabs' }} />
      <Drawer.Screen name="Orders" component={OrdersScreen} options={{ title: 'My Orders' }} />
    </Drawer.Navigator>
  );
}
export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current; // initial opacity 1
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200, // fade-out duration
      delay: 1200, // delay before fade starts
      useNativeDriver: true,
    }).start(() => {
      setSplashVisible(false);
    });
  }, [fadeAnim]);
  if (isSplashVisible) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
        <Image
          source={require('./assets/splash_logo.png')} // put your image in /assets folder
          style={styles.splashImage}
          resizeMode="contain"
        />
        {/* <Text style={styles.splashText}>Welcome to My App</Text> */}
      </Animated.View>
    );
  }
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="DefaultLogin">
          <Stack.Screen name="DefaultLogin" component={DefaultLogin} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Create Account' }} />
          <Stack.Screen name="Home" component={AppDrawer} options={{ headerShown: false }} />
          <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="UpdateStore" component={UpdateStoreScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
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
  splashText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});
