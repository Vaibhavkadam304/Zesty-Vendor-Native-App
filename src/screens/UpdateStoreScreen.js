// src/screens/SettingsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Image,
} from 'react-native';
import {
  Appbar,
  TextInput,
  Button,
  Switch,
  ActivityIndicator,
  Text,
  Divider,
  useTheme,
  Avatar,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import CustomHeader from './components/CustomHeader';

import api from '../api/api';
import DietaryOptions from './components/DietaryOptions';
import ShippingOptions from './components/ShippingOptions';

const { width } = Dimensions.get('window');
const PADDING = 20;

export default function UpdateStoreScreen({ navigation }) {
  const { colors } = useTheme();
  const [store, setStore]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [story, setStory]     = useState('');

  // load & refresh store data
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('@store_cache');
      if (raw) {
        const data = JSON.parse(raw);
        setStore(data);
        setStory(data.vendor_biography || '');
        setLoading(false);
      }
      try {
        const userId = await AsyncStorage.getItem('@user_id');
        const { data } = await api.get(`/dokan/v1/stores/${userId}`);
        setStore(data);
        setStory(data.vendor_biography || '');
        await AsyncStorage.setItem('@store_cache', JSON.stringify(data));
      } catch (err) {
        if (!raw) {
          Alert.alert('Error', 'Failed to load store: ' + err.message);
          navigation.replace('Login');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [navigation]);

  // image picker helper
  const pickImage = async (field) => {
    try {
      const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
      if (res.assets?.length) {
        setStore(prev => ({ ...prev, [field]: res.assets[0].uri }));
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // input handlers
  const handleInputChange = (field, value) =>
    setStore(prev => ({ ...prev, [field]: value }));
  const handleNestedChange = (group, key, value) =>
    setStore(prev => ({ ...prev, [group]: { ...prev[group], [key]: value } }));

  // save settings
  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        store_name: store.store_name,
        phone: store.phone,
        banner: store.banner,
        gravatar: store.gravatar,
        vendor_biography: story,
        store_toc: store.store_toc,
        toc_enabled: store.toc_enabled ? 'yes' : 'no',
        social: store.social,
        diet_option1: store.diet_option1,
        diet_option2: store.diet_option2,
        diet_option3: store.diet_option3,
        diet_option4: store.diet_option4,
        diet_option5: store.diet_option5,
        shipping_options: store.shipping_options,
        show_support_btn: store.show_support_btn,
        show_support_btn_product: store.show_support_btn_product,
        certification_status: store.certification_status,
        cancellation_policy: store.cancellation_policy,
        catalog_mode: store.catalog_mode,
        store_pickup: store.store_pickup,
        home_delivery: store.home_delivery,
        delivery_blocked_buffer: store.delivery_blocked_buffer,
        time_slot_minutes: store.time_slot_minutes,
        order_per_slot: store.order_per_slot,
        location: store.location,
        address: store.address,
      };
      await api.patch(`/dokan/v1/stores/${store.id}`, payload);
      await AsyncStorage.setItem(
        '@store_cache',
        JSON.stringify({ ...store, vendor_biography: story })
      );
      Alert.alert('Success', 'Settings saved.');
    } catch (err) {
      Alert.alert('Error', 'Failed to save: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !store) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating size="large" color={colors.primary} />
      </View>
    );
  }

  return (
  <>
    {/* <CustomHeader title="Settings" navigation={navigation} /> */}
    <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
        <ScrollView contentContainerStyle={styles.cardContainer}>
        {/* Branding */}
        <View style={styles.brandingContainer}>
            {store.banner && (
            <Image source={{ uri: store.banner }} style={styles.banner} resizeMode="cover" />
            )}
            <Button
            mode="outlined"
            compact
            contentStyle={styles.smallButtonContent}
            style={[styles.smallButton, { backgroundColor: colors.primary }]}
            labelStyle={[styles.smallButtonLabel, { color: '#fff' }]}
            onPress={() => pickImage('banner')}
            >
            Change Banner
            </Button>
            <View style={styles.avatarRow}>
            {store.gravatar && (
                <Avatar.Image
                size={100}
                source={{ uri: store.gravatar }}
                style={{
                    backgroundColor: 'transparent',
                    marginRight: 20,
                    borderWidth: 0.5,
                    borderColor: colors.primary,
                    borderRadius: 50,
                }}
                />
            )}
            <Button
                mode="outlined"
                compact
                contentStyle={styles.smallButtonContent}
                style={[styles.smallButton, { backgroundColor: colors.primary }]}
                labelStyle={[styles.smallButtonLabel, { color: '#fff' }]}
                onPress={() => pickImage('gravatar')}
            >
                Change Pic
            </Button>
            </View>
        </View>

        {/* Your Story */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Your Story</Text>
            <TextInput
            mode="outlined"
            label="Vendor Biography"
            value={story}
            multiline
            onChangeText={setStory}
            style={styles.input}
            />
        </View>

        {/* Store Profile */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Store Profile</Text>
            <TextInput
            mode="outlined"
            label="Store Name"
            value={store.store_name}
            onChangeText={v => handleInputChange('store_name', v)}
            style={styles.input}
            />
            <TextInput
            mode="outlined"
            label="Phone"
            keyboardType="phone-pad"
            value={store.phone}
            onChangeText={v => handleInputChange('phone', v)}
            style={styles.input}
            />

            <Divider style={styles.divider} />
            <Text style={styles.subTitle}>Address</Text>
            <TextInput
            mode="outlined"
            label="Location Name"
            value={store.location.name}
            onChangeText={v => handleNestedChange('location', 'name', v)}
            style={styles.input}
            />
            <TextInput
            mode="outlined"
            label="Street 1"
            value={store.address.street_1}
            onChangeText={v => handleNestedChange('address', 'street_1', v)}
            style={styles.input}
            />
            <TextInput
            mode="outlined"
            label="Street 2"
            value={store.address.street_2}
            onChangeText={v => handleNestedChange('address', 'street_2', v)}
            style={styles.input}
            />
            <View style={styles.row}>
            <TextInput
                mode="outlined"
                label="City"
                value={store.address.city}
                onChangeText={v => handleNestedChange('address', 'city', v)}
                style={[styles.input, { flex: 1, marginRight: 8 }]}
            />
            <TextInput
                mode="outlined"
                label="Zip"
                keyboardType="number-pad"
                value={store.address.zip}
                onChangeText={v => handleNestedChange('address', 'zip', v)}
                style={[styles.input, { flex: 1 }]}
            />
            </View>

            <Text style={styles.subTitle}>Certification Status</Text>
            <View style={styles.pickerWrapper}>
            <Picker
                selectedValue={store.certification_status}
                onValueChange={val => handleInputChange('certification_status', val)}
                style={styles.picker}
            >
                <Picker.Item label="Select license…" value="" />
                <Picker.Item label="Commercial" value="commercial" />
                <Picker.Item label="Cottage Food" value="fully" />
                <Picker.Item label="Working on licenses" value="working" />
            </Picker>
            </View>
        </View>

        {/* Store Settings */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Store Settings</Text>
            <DietaryOptions store={store} onToggle={handleInputChange} />
            <Divider style={styles.divider} />
            <ShippingOptions store={store} onToggle={handleInputChange} />
        </View>

        {/* Support Buttons */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Support Buttons</Text>
            <View style={styles.switchRow}>
            <Switch
                value={store.show_support_btn}
                onValueChange={v => handleInputChange('show_support_btn', v)}
                color={colors.primary}
            />
            <Text style={styles.switchLabel}>Show Support (Store)</Text>
            </View>
            <View style={styles.switchRow}>
            <Switch
                value={store.show_support_btn_product}
                onValueChange={v => handleInputChange('show_support_btn_product', v)}
                color={colors.primary}
            />
            <Text style={styles.switchLabel}>Show Support (Product)</Text>
            </View>
        </View>

        {/* Cancellation Policy */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Cancellation Policy</Text>
            {Object.entries(store.cancellation_policy || {}).map(([key, val]) => (
            <View style={styles.inputGroup} key={key}>
                <Text style={styles.label}>{key.replace(/_/g, ' ')}</Text>
                <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={val}
                    onValueChange={v => handleNestedChange('cancellation_policy', key, v)}
                    style={styles.picker}
                >
                    {['100%', '75%', '50%', '25%', '0%'].map(opt => (
                    <Picker.Item label={opt} value={opt} key={opt} />
                    ))}
                </Picker>
                </View>
            </View>
            ))}
        </View>

        {/* Catalog Mode */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Catalog Mode</Text>
            {[
            ['hide_add_to_cart_button', 'Hide Add to Cart'],
            ['hide_product_price',     'Hide Product Price'],
            ].map(([k, lab]) => (
            <View style={styles.switchRow} key={k}>
                <Switch
                value={(store.catalog_mode || {})[k] === 'on'}
                onValueChange={v => handleNestedChange('catalog_mode', k, v ? 'on' : 'off')}
                color={colors.primary}
                />
                <Text style={styles.switchLabel}>{lab}</Text>
            </View>
            ))}
        </View>

        {/* Delivery Settings */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Delivery Settings</Text>
            <View style={styles.switchRow}>
            <Switch
                value={store.store_pickup === 'yes'}
                onValueChange={v => handleInputChange('store_pickup', v ? 'yes' : 'no')}
                color={colors.primary}
            />
            <Text style={styles.switchLabel}>Store Pickup</Text>
            </View>
            <View style={styles.switchRow}>
            <Switch
                value={store.home_delivery === 'yes'}
                onValueChange={v => handleInputChange('home_delivery', v ? 'yes' : 'no')}
                color={colors.primary}
            />
            <Text style={styles.switchLabel}>Home Delivery</Text>
            </View>
            <View style={styles.inputGroup}>
            <TextInput
                mode="outlined"
                label="Blocked Buffer (days)"
                keyboardType="numeric"
                value={String(store.delivery_blocked_buffer)}
                onChangeText={v =>
                handleInputChange('delivery_blocked_buffer', parseInt(v, 10) || 0)
                }
                style={styles.input}
            />
            </View>
            <View style={styles.inputGroup}>
            <TextInput
                mode="outlined"
                label="Slot Duration (mins)"
                keyboardType="numeric"
                value={String(store.time_slot_minutes)}
                onChangeText={v =>
                handleInputChange('time_slot_minutes', parseInt(v, 10) || 0)
                }
                style={styles.input}
            />
            </View>
            <View style={styles.inputGroup}>
            <TextInput
                mode="outlined"
                label="Orders per Slot"
                keyboardType="numeric"
                value={String(store.order_per_slot)}
                onChangeText={v =>
                handleInputChange('order_per_slot', parseInt(v, 10) || 0)
                }
                style={styles.input}
            />
            </View>
        </View>

        <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            contentStyle={styles.saveButton}
            style={{ margin: PADDING }}
        >
            Save Settings
        </Button>
        </ScrollView>
    </KeyboardAvoidingView>
   </> 
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#F8F6F4' },
  loader:            { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardContainer:     { padding: PADDING, paddingTop: 0 },
  card:              { marginBottom: 32, padding: 16, backgroundColor: '#fff' },
  input:             { marginBottom: 12 },
  row:               { flexDirection: 'row' },
  sectionTitle:      { marginBottom: 12, fontWeight: 'bold' },
  subTitle:          { marginTop: 12, fontSize: 16, fontWeight: '600' },
  switchRow:         { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  switchLabel:       { marginLeft: 8 },
  divider:           { marginVertical: 16 },
  inputGroup:        { marginBottom: 12 },
  label:             { marginBottom: 4 },
  pickerWrapper:     { borderWidth: 1, borderColor: '#ddd', borderRadius: 4, overflow: 'hidden' },
  picker:            { height: Platform.OS === 'android' ? 50 : undefined, width: '100%' },
  saveButton:        { paddingVertical: 12 },
  brandingContainer: {
    marginHorizontal: -PADDING,
    marginBottom: 32,
    alignItems: 'center',
  },
  banner:            { width, height: 180, marginBottom: 12 },
  smallButton:       { marginHorizontal: 10, alignSelf: 'flex-center' },
  smallButtonLabel:  { fontSize: 12 },
  smallButtonContent:{ paddingVertical: 0, paddingHorizontal: 0 },
  avatarRow:         { marginTop: 40, alignSelf: 'flex-end' },
});
