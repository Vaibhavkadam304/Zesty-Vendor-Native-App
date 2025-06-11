// src/screens/OrdersScreen.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  ActivityIndicator,
  Card,
  Button,
  useTheme,
  Avatar,
  Divider,
  Text,
  Appbar,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from './components/CustomHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function OrdersScreen() {
  const { colors } = useTheme();
  const [orders, setOrders]      = useState([]);
  const [loading, setLoading]    = useState(true);
  const [refreshing, setRefresh] = useState(false);

  const navigation = useNavigation();

  const CACHE_KEY = '@orders_cache';

  const loadOrders = async () => {
    setLoading(true);

    // 1) load from cache
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (raw) {
      setOrders(JSON.parse(raw));
    }

    try {
      // 2) fetch vendor & jwt from storage
      const userId = await AsyncStorage.getItem('@user_id');
      const token  = await AsyncStorage.getItem('@jwt_token');

      const { data } = await api.get('/dokan/v1/orders', {
        params:  { vendor: userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(data);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const onRefresh = () => {
    setRefresh(true);
    loadOrders();
  };

  const renderItem = ({ item }) => (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
    <Card style={[styles.card, { backgroundColor: '#FEFEFE' }]} elevation={2}>
      <Card.Title
        title={`Order #${item.number}`}            // use "number"
        subtitle={item.status}
        left={props => (
          <Avatar.Text
            {...props}
            label={`${item.currency} ${item.total}`}
            size={40}
          />
        )}
      />
      <Card.Content>
        <Text>
          {item.billing.first_name} {item.billing.last_name}
        </Text>
        <Text>
          {new Date(item.date_created).toLocaleDateString()}
        </Text>
      </Card.Content>
      <Divider />
      <Card.Actions>
       <Button onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}>
        Details
      </Button>
      </Card.Actions>
    </Card>
   </View> 
  );

  if (loading && orders.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating size="large" color={colors.primary} />
      </View>
    );
  }

  return (

    <>
    <CustomHeader navigation={navigation} />
    <FlatList
      data={orders}
      keyExtractor={o => String(o.id)}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
      ListEmptyComponent={
        !loading && (
          <View style={styles.empty}>
            <Text>No orders found.</Text>
            <Button onPress={onRefresh}>Reload</Button>
          </View>
        )
      }
    />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 30,
    paddingTop: 30,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    marginTop: 64,
    alignItems: 'center',
  },
  card: {
    marginBottom: 12,
    borderRadius:0,
  },
});
