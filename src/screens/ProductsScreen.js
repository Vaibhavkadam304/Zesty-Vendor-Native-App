// src/screens/ProductsScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const COLORS = {
  background: '#FFF3E0',
  text:       '#4A2C2A',
};

const dummyProducts = [
  { id: '1', name: 'Chocolate Cake' },
  { id: '2', name: 'Vanilla Cupcake' },
  { id: '3', name: 'Strawberry Tart' },
];

export default function ProductsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      <FlatList
        data={dummyProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>• {item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  item: {
    paddingVertical: 8,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.text,
  },
});
