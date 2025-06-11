// src/screens/SettingScreen.jsx
import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,             // ← import here
} from 'react-native';
import {
  useTheme,
  Surface,
  Text,
  IconButton,
  Appbar,
  ActivityIndicator,
  Switch,
} from 'react-native-paper';
import {
  StoreIcon,
  OrdersIcon,
  DeliveryIcon,
  GalleryIcon,
  PaymentIcon,
  SupportIcon,
} from './components/icons';
import CustomHeader from './components/CustomHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');      // ← grab width
const H_PAD    = 16;                             // horizontal padding
const colWidth = (width - H_PAD * 2) / 3;        // ← calculate cell width

const shortcuts = [
  { key: 'store', label: 'Store Setting', icon: 'store', screen: 'UpdateStore' },
  { key: 'orders', label: 'Orders', icon: 'format-list-bulleted', screen: 'Orders' },
  { key: 'delivery', label: 'Delivery Slot', icon: 'truck-delivery', screen: 'UpdateStore' },
  { key: 'gallery', label: 'Gallery', icon: 'image-multiple', screen: 'UpdateStore' },
  { key: 'payment', label: 'Payment', icon: 'credit-card-outline', screen: 'UpdateStore' },
  { key: 'support', label: 'Support', icon: 'headset', screen: 'UpdateStore' },
];

export default function SettingScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.shortcut}
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
        <MaterialCommunityIcons name={item.icon} size={28} color={colors.primary} />
      </View>
      <Text style={styles.label}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <>
        <CustomHeader navigation={navigation} />
        <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={styles.header}>Your Shortcuts</Text>
        <FlatList
            data={shortcuts}
            renderItem={renderItem}
            keyExtractor={i => i.key}
            numColumns={3}
            contentContainerStyle={styles.grid}
        />
        </View>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F6F4',  // add your desired color here
  },
 header: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333', // or use your theme color
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  grid: {
    justifyContent: 'space-between',
  },
  shortcut: {
    width: colWidth,       // ← now colWidth is defined
    alignItems: 'center',
    marginVertical: 12,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // ensure no background unless you add one
    padding: 0,  // ensure no extra padding
    margin: 0,
  },
  label: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
  },
});
