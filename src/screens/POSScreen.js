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
  Platform,
} from 'react-native';
import { useStripeTerminal } from '@stripe/stripe-terminal-react-native';

const POSScreen = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [readers, setReaders] = useState([]);

  const {
    initialize,
    registerReader,
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
        console.log("✅ Stripe Terminal Initialized");

        // 🔑 Register this device as a Tap to Pay reader
        const { reader, error } = await registerReader({
          location: 'tml_GEv5yQX1NQSw8p',
        });

        if (error) {
          console.error('❌ RegisterReader error:', error);
          Alert.alert('Register Error', error.message);
        } else {
          console.log('✅ Reader registered:', reader);
        }
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
      const { error: discErr } = await discoverReaders({
        discoveryMethod: 'internet',
        simulated: false,
      });
      if (discErr) throw new Error(discErr.message);

      await new Promise((r) => setTimeout(r, 1000));
      if (!readers.length) throw new Error('No readers found');
      const reader = readers[0];

      const { error: connErr } = await connectReader(reader);
      if (connErr) throw new Error(connErr.message);
      console.log(`🔌 Connected to ${reader.serialNumber}`);

      const res = await fetch('https://zestybakers.com/wp-json/zesty-terminal/v1/create_payment_intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account: 'acct_1QSwkKEFbZzG2qIK',
          amount: Math.round(parseFloat(amount) * 100),
          locationId: 'tml_GEv5yQX1NQSw8p'
        }),
      });

      const { paymentIntent } = await res.json();
      if (!paymentIntent?.client_secret) {
        throw new Error('Failed to create PaymentIntent');
      }

      const { error: collectErr } = await collectPaymentMethod({
        paymentIntent: { client_secret: paymentIntent.client_secret },
      });
      if (collectErr) throw new Error(collectErr.message);

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