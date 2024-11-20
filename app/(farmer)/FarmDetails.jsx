import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FarmDetails = ({ route }) => {
  const { farm } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>hello word</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default FarmDetails;
