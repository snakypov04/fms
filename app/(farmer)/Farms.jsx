import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from "react-native";
import { router, useRouter } from 'expo-router';


const FarmsTab = ({ navigation }) => {
  const router = useRouter();

  const farmData = {
    id: 2,
    name: "Green Meadows",
    address: "456 Farm Road",
    crop_types: "Rice, Soybean",
    is_verified: false,
  };

  // Handle navigating to the Farm Details page
  const handleViewDetails = () => {
    console.log("Hello")
    router.push("/FarmDetails", { farm: farmData });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farm Overview</Text>
      <View style={styles.farmCard}>
        <Text style={styles.farmName}>{farmData.name}</Text>
        <Text style={styles.farmDetail}>Address: {farmData.address}</Text>
        <Text style={styles.farmDetail}>Crops: {farmData.crop_types}</Text>
        <Text style={styles.farmDetail}>
          Verified: {farmData.is_verified ? "Yes" : "No"}
        </Text>
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={handleViewDetails}
        >
          <Text style={styles.viewDetailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  farmCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  farmName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2d6a4f",
  },
  farmDetail: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  viewDetailsButton: {
    marginTop: 15,
    backgroundColor: "#2d6a4f",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  viewDetailsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FarmsTab;
