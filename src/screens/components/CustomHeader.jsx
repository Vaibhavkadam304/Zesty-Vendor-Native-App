import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CustomHeader({ title, navigation }) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
        <MaterialCommunityIcons name="menu" size={28} color="#33006F" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    // backgroundColor: '#fff',
    justifyContent:'flex-end',
  },
  menuButton: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    color: '#33006F',
    fontWeight: '600',
    marginLeft: 10,
  },
});
