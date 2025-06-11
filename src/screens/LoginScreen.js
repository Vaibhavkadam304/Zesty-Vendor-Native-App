import React, { useState ,useEffect} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import { decode as atob } from 'base-64';
import {
  TextInput,
  Button,
  ActivityIndicator,
  Text,
  useTheme,
} from 'react-native-paper';

function decodeJwt(token) {
  const [, payload] = token.split('.');
  const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  return JSON.parse(atob(padded));
}

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const loadRememberedCredentials = async () => {
      const savedEmail = await AsyncStorage.getItem('@remember_email');
      const savedPassword = await AsyncStorage.getItem('@remember_password');

      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    };

    loadRememberedCredentials();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Email and password are required.');
    }
    setLoading(true);

    try {
      const { data } = await api.post('/jwt-auth/v1/token', {
        username: email,
        password,
      });

      const token = data.token;
      const payload = decodeJwt(token);
      const userId = payload.data.user.id;

     if (rememberMe) {
          await AsyncStorage.multiSet([
            ['@jwt_token', token],
            ['@user_id', String(userId)],
            ['@remember_email', email],
            ['@remember_password', password],
          ]);
        } else {
          await AsyncStorage.multiRemove([
            '@jwt_token',
            '@user_id',
            '@remember_email',
            '@remember_password',
          ]);
        }

      api.get(`/dokan/v1/stores/${userId}`)
        .then(resp => AsyncStorage.setItem('@store_cache', JSON.stringify(resp.data)))
        .catch(() => {});

      navigation.replace('Home');
    } catch (err) {
      Alert.alert(
        'Login Failed',
        err.response?.data?.message || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Vendor Login</Text>

        <TextInput
          mode="outlined"
          label="Username or Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <View style={styles.rememberMeContainer}>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            thumbColor={rememberMe ? colors.primary : '#ccc'}
            trackColor={{ false: '#767577', true: colors.primary + '88' }}
          />
          <Text style={styles.rememberMeText}>Remember Me</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            animating
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        ) : (
          <>
            <Button
              mode="contained"
              onPress={handleLogin}
              contentStyle={styles.buttonContent}
              style={styles.button}
            >
              Login
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Signup')}
              labelStyle={styles.signupText}
            >
              Don’t have an account? Sign Up
            </Button>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
   rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMeText: {
    marginLeft: 8,
    fontSize: 16,
  },
  loader: {
    marginVertical: 24,
  },
  button: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
});
