import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';

import OrdersScreen from './OrdersScreen';
import ProductsScreen from './ProductsScreen';
import POSScreen from './POSScreen';
import EnquiriesScreen from './EnquiriesScreen';
import SettingsScreen from './SettingScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function MainTabs() {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'orders',    title: 'Orders',    icon: 'home' },
    { key: 'products',  title: 'Products',  icon: 'shopping' },
    { key: 'pos',       title: 'POS',       icon: 'cart-outline' },
    { key: 'enquiries', title: 'Enquiries', icon: 'bell-outline' },
    { key: 'settings',  title: 'Settings',  icon: 'cog-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    orders: OrdersScreen,
    products: ProductsScreen,
    pos: POSScreen,
    enquiries: EnquiriesScreen,
    settings: SettingsScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderIcon={({ route, color }) => (
        <MaterialCommunityIcons name={route.icon} color={color} size={24} />
      )}
      barStyle={styles.bar}
      activeColor="#FFD700"
      inactiveColor="#FFFFFF"
      labeled={true}
      shifting={false}
      sceneAnimationEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#1E1E50',
    elevation: 10,
    paddingBottom: 2,
  },
});
