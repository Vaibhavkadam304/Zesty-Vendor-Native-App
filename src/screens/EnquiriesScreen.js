import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function EnquiriesScreen() {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Enquiries</Text>
      <Text variant="bodyMedium">Your Enquiries Information is in here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF', // Optional: set your preferred static color
  },
});
