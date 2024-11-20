import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Inventory() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      <Text style={styles.text}>Manage the products you are selling.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
