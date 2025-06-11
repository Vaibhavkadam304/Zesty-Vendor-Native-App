import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Linking, ScrollView } from 'react-native';

export default function DefaultLogin({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Zesty</Text>

      {/* Illustration Image */}
      <Image
        source={require('./assets/illustration_logo.png')} // Replace with your actual image
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Sign In Button */}
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>

      {/* Google Button */}
      <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Google Login')}>
        <Image
          source={{ uri: 'https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png' }}
          style={styles.icon}
        />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Facebook Button */}
      <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Facebook Login')}>
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' }}
          style={styles.icon}
        />
        <Text style={styles.socialText}>Continue with Facebook</Text>
      </TouchableOpacity>

      {/* Footer Disclaimer */}
      <Text style={styles.footerText}>
        By clicking Sign in or Continue with Google, Facebook, or Apple, you agree to Zesty's{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://zestybakers.com/terms-of-service/')}>
          App Terms, Terms of Use
        </Text>{' '}
        and{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://zestybakers.com/terms-of-service/')}>
          Privacy Policy
        </Text>
        . Zesty may send you communications; you may change your preferences in your account settings. We'll never post
        without your permission.
      </Text>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#33006F',
    marginBottom: 20,
  },
  illustration: {
    width: 250,
    height: 200,
    marginBottom: 30,
  },
  signInButton: {
    backgroundColor: '#000',
    width: '100%',
    padding: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',  // ⭐️ Add this
    borderWidth: 1,
    borderColor: '#000',
    padding: 14,
    borderRadius: 50,
    width: '100%',
    marginBottom: 15,
    },
  icon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  socialText: {
    fontSize: 15,
    fontWeight: '500',
  },
  footerText: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  link: {
    color: '#005eb8',
    textDecorationLine: 'underline',
  },
});
