// src/screens/POSScreen.jsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useStripeTerminal } from '@stripe/stripe-terminal-react-native';
// import { NfcManager } from 'react-native-nfc-manager';
// NfcManager.isSupported().then(supported => console.log('NFC Supported:', supported));
async function requestBluetoothPermissions() {
  if (Platform.OS === 'android') {
    const fine = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission Required',
        message:
          'Stripe Terminal needs location permission to scan for Bluetooth readers.',
        buttonPositive: 'OK',
      }
    );
    if (fine !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('Location permission not granted');
    }

    if (Platform.Version >= 31) {
      const scan = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: 'Bluetooth Scan Permission',
          message: 'Required to discover Bluetooth readers.',
          buttonPositive: 'OK',
        }
      );
      if (scan !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Bluetooth Scan permission not granted');
      }

      const connect = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: 'Bluetooth Connect Permission',
          message: 'Required to connect to Bluetooth readers.',
          buttonPositive: 'OK',
        }
      );
      if (connect !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Bluetooth Connect permission not granted');
      }
    }
  }
}

const POSScreen = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [readers, setReaders] = useState([]);

  const {
    initialize,
    discoverReaders,
    connectReader,
    createPaymentIntent,
    collectPaymentMethod,
    processPayment,
  } = useStripeTerminal({
    onUpdateDiscoveredReaders: (discovered) => {
      console.log('Discovered readers:', discovered);
      setReaders(discovered);
    },
  });

  useEffect(() => {
    const init = async () => {
      try {
        await initialize();
        setIsInitialized(true);
      } catch (err) {
        console.error('❌ Init error:', err);
        Alert.alert('Init Error', err.message);
      }
    };
    init();
  }, [initialize]);

  const handleTapToPay = async () => {
  if (!isInitialized) {
    Alert.alert('Stripe Terminal not initialized yet. Please wait...');
    return;
  }

  if (!amount || isNaN(amount)) {
    Alert.alert('Please enter a valid amount');
    return;
  }

  setLoading(true);
  try {
    await requestBluetoothPermissions();

    const { error: discErr } = await discoverReaders({
      discoveryMethod: 'bluetoothScan',
      simulated: true,
    });
    if (discErr) throw new Error(discErr.message);

    await new Promise((r) => setTimeout(r, 1000));
    if (!readers.length) throw new Error('No readers found');
    const reader = readers[0];

    const { error: connErr } = await connectReader(reader);
    if (connErr) throw new Error(connErr.message);
    console.log(`🔌 Connected to ${reader.serialNumber}`);

    // ✅ Get PaymentIntent from your backend
    const res = await fetch('http://192.168.1.6:3000/create_payment_intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(parseFloat(amount) * 100),
        locationId: 'tml_simulated',
      }),
    });
    const { paymentIntent } = await res.json();
    if (!paymentIntent?.client_secret) {
      throw new Error('Failed to create PaymentIntent');
    }

    // ✅ Collect card details
    const { error: collectErr } = await collectPaymentMethod({
      paymentIntent: { client_secret: paymentIntent.client_secret },
    });
    if (collectErr) throw new Error(collectErr.message);

    // ✅ Confirm the payment
    const { paymentIntent: result, error: procErr } = await processPayment({
      paymentIntent: { id: paymentIntent.id },
    });
    if (procErr) throw new Error(procErr.message);

    if (result.status === 'succeeded') {
      Alert.alert('Payment Success', `$${(result.amount / 100).toFixed(2)} charged.`);
    } else {
      throw new Error(`Payment failed with status: ${result.status}`);
    }
  } catch (err) {
    console.error('Tap to Pay Error:', err);
    Alert.alert('Error', err.message || 'Unknown error occurred');
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Amount (USD)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 19.99"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Tap to Pay" onPress={handleTapToPay} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
});

export default POSScreen;
