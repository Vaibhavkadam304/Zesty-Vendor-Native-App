import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import api from '../api/api';

export default function SignupScreen({ navigation }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    shop_name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSignup = async () => {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      shop_name,
      phone,
    } = form;

    if (!username || !email || !password || !shop_name) {
      return Alert.alert('Error', 'Please fill all required fields.');
    }

    setLoading(true);

    try {
      const { data } = await api.post(
        '/custom/v1/register', // Make sure this matches your endpoint
        {
          ...form,
        },
        {
          headers: {
            'x-app-origin': 'react-native',
          },
        }
      );

      if (data.success) {
        Alert.alert('Success', 'Vendor registered successfully.');
        navigation.replace('Login');
      } else {
        Alert.alert('Signup Failed', data.message || 'Something went wrong.');
      }
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Vendor Signup</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={form.username}
        onChangeText={val => handleChange('username', val)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={form.email}
        onChangeText={val => handleChange('email', val)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={val => handleChange('password', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={form.first_name}
        onChangeText={val => handleChange('first_name', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={form.last_name}
        onChangeText={val => handleChange('last_name', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Shop Name"
        value={form.shop_name}
        onChangeText={val => handleChange('shop_name', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={val => handleChange('phone', val)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#4a90e2" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ marginTop: 16, color: '#4a90e2', textAlign: 'center' }}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
