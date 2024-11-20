import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Farms() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Farms</Text>
      <Text style={styles.text}>Add, edit, or delete your farms.</Text>
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
