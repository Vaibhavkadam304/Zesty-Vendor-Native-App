import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://woocommerce-1468841-5547347.cloudwaysapps.com/wp-json',
  timeout: 10000,
});

// auto-attach JWT
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('@jwt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
