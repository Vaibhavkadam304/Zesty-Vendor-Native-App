import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import api from '../api/api';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-paper';
import CustomHeader from './components/CustomHeader';
import { useNavigation } from '@react-navigation/native';

export default function OrderDetailsScreen() {
  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  const loadOrderDetails = async (id) => {
    setLoading(true);
    
    try {
      const cached = await AsyncStorage.getItem(`@order_cache_${id}`);
      if (cached) {
        const cachedOrder = JSON.parse(cached);
        setOrder(cachedOrder);
        setSelectedStatus(cachedOrder.status || ''); // <-- HERE for cached
        setLoading(false);
      }

      const token = await AsyncStorage.getItem('@jwt_token');
      const { data } = await api.get(`/dokan/v1/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrder(data);
      setSelectedStatus(data.status || ''); // ✅ FIX: set the picker
      await AsyncStorage.setItem(`@order_cache_${id}`, JSON.stringify(data));
    } catch (err) {
      console.warn('Failed to fetch order details:', err);
      if (!order) {
        Alert.alert('Error', 'Could not load order details');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async () => {
    if (!orderId || !selectedStatus) return;
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('@jwt_token');
      await api.patch(`/dokan/v1/orders/${orderId}`, {
        status: selectedStatus,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Directly update local order state instead of re-fetching everything
      setOrder((prev) => ({
        ...prev,
        status: selectedStatus,
      }));

      Alert.alert('Success', `Order updated to "${selectedStatus}"`);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    const { orderId } = route.params || {};
    if (!orderId) {
      Alert.alert('Error', 'No order ID found');
      setLoading(false);
      return;
    }
    async function loadStatus() {
      const cached = await AsyncStorage.getItem('order');
      if (cached) {
        setSelectedStatus(cached.status || '');
      }
      const fresh = await fetchOrder();
      setSelectedStatus(fresh.status || '');
      setLoaded(true);
    }
    loadStatus();
    setOrderId(orderId);
    loadOrderDetails(orderId);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, fontSize: 16 }}>Loading Order...</Text>
      </View>
    );
  }

  if (!order) return null;

  return (
   <>
    {/* <CustomHeader title="Settings" navigation={navigation} /> */}
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Order #{order.number} → Order Items</Text>

      {order.line_items.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.row}>
            <Image
                source={{ uri: item.image || 'https://via.placeholder.com/60' }}
                style={styles.productImage}
             />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>Cost: ${item.price}</Text>
                <Text style={styles.priceText}>Qty: {item.quantity}</Text>
                <Text style={styles.priceText}>Total: ${item.total}</Text>
                <Text style={styles.priceText}>Tax: ${item.total_tax}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}

      {/* Shipping Method */}
      {order.shipping_lines.length > 0 && (
        <View style={styles.pickup}>
          <Text>
            <Text>🚚 Shipping:</Text>
            <Text style={{ fontWeight: 'bold' }}> Method Title</Text>
          </Text>
        </View>
      )}

      {/* Refund Section */}
      {order.refunds.length > 0 &&
        order.refunds.map((refund, index) => (
          <View key={index} style={styles.refund}>
            <Text>
              <Text>💵 Refund #{refund.id} - by </Text>
              <Text style={styles.link}>Admin</Text>
            </Text>
            <Text style={styles.negative}>-${refund.total}</Text>
          </View>
        ))}

      {/* Summary */}
      <View style={styles.summary}>
        <Text>Discount: <Text style={styles.negative}>-${order.discount_total}</Text></Text>
        <Text>Subtotal: ${order.subtotal}</Text>
        <Text>Shipping: ${order.shipping_total}</Text>
        <Text>Tax: ${order.total_tax}</Text>
        <Text style={styles.grandTotal}>Total: ${order.total}</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Update Order Status:</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedStatus}
             onValueChange={(value, index) => setSelectedStatus(value)}
            style={styles.picker}
          >
            <Picker.Item label="– Select status –" value={null} enabled={false} />
            <Picker.Item label="Processing" value="wc-processing" />
            <Picker.Item label="On Hold" value="wc-on-hold" />
            <Picker.Item label="Completed" value="wc-completed" />
            <Picker.Item label="Cancelled" value="wc-cancelled" />
            <Picker.Item label="Refunded" value="wc-refunded" />
            <Picker.Item label="Failed" value="wc-failed" />
            <Picker.Item label="Draft" value="wc-draft" />
          </Picker>
        </View>

        <Button
          mode="contained"
          onPress={updateOrderStatus}
          disabled={loading || !selectedStatus}
          style={[
            styles.updateButton,
            (loading || !selectedStatus) && { backgroundColor: '#ccc', opacity: 0.7 }
          ]}
          labelStyle={styles.buttonLabel}
        >
          {loading ? 'Updating...' : 'Update Status'}
        </Button>
      </View>

      <View style={styles.addressBox}>
        <Text style={styles.addressHeader}>Billing Address</Text>
        <Text>{order.billing.first_name} {order.billing.last_name}</Text>
        <Text>{order.billing.address_1}</Text>
        {!!order.billing.address_2 && <Text>{order.billing.address_2}</Text>}
        <Text>{order.billing.city}, {order.billing.state} {order.billing.postcode}</Text>
        <Text>{order.billing.country}</Text>
        <Text>Email: {order.billing.email}</Text>
        <Text>Phone: {order.billing.phone}</Text>
      </View>

      <View style={styles.addressBox}>
        <Text style={styles.addressHeader}>Shipping Address</Text>
        <Text>{order.shipping.first_name} {order.shipping.last_name}</Text>
        <Text>{order.shipping.address_1}</Text>
        {!!order.shipping.address_2 && <Text>{order.shipping.address_2}</Text>}
        <Text>{order.shipping.city}, {order.shipping.state} {order.shipping.postcode}</Text>
        <Text>{order.shipping.country}</Text>
        {!!order.shipping.phone && <Text>Phone: {order.shipping.phone}</Text>}
      </View>
    </ScrollView>
   </> 
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  priceRow: {
    gap: 4,
  },
  priceText: {
    fontSize: 14,
    color: '#333',
  },
  pickup: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  refund: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  link: {
    color: '#1976D2',
    textDecorationLine: 'underline',
  },
  negative: {
    color: '#C62828',
    fontWeight: 'bold',
  },
  summary: {
    backgroundColor: '#F1F8E9',
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 32,
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
   // Address Container
  addressBox: {
    backgroundColor: '#f7f7f7',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },

  addressHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },

  addressText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },

  // Optional: Header title for whole screen
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  statusContainer: {
    marginTop: 30,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  statusLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  updateButton: {
    marginTop: 16,
    height: 48,                    // Standard medium height
    paddingHorizontal: 24,        // Medium width
    borderRadius: 10,
    backgroundColor: '#33006F',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignSelf: 'center',          // Center the button
    justifyContent: 'center',     // Center text vertically
  },

  buttonLabel: {
    color: '#fff',
    fontSize: 16,                 // Medium font size
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    fontFamily: 'System',         // Default font; can be updated
  },

});
