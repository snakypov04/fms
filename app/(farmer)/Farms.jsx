import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

const FarmsTab = () => {
  // Updated API response (single farm object)
  const farmData = {
    id: 2,
    name: "Green Meadows",
    address: "456 Farm Road",
    geo_loc: "40.56789, -90.56789",
    size: "100 acres",
    crop_types: "Rice, Soybean",
    is_verified: false,
    created_at: "2024-11-19T19:31:50.251523Z",
    updated_at: "2024-11-19T19:31:50.251889Z",
  };

  const [selectedFarm, setSelectedFarm] = useState(null);

  // Handle selecting a farm
  const handleSelectFarm = () => {
    setSelectedFarm(farmData);
    Alert.alert("Farm Selected", `You chose ${farmData.name} to work on.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farm Details</Text>
      <View style={styles.farmCard}>
        <Text style={styles.farmName}>{farmData.name}</Text>
        <Text style={styles.farmDetail}>Address: {farmData.address}</Text>
        <Text style={styles.farmDetail}>Size: {farmData.size}</Text>
        <Text style={styles.farmDetail}>Crops: {farmData.crop_types}</Text>
        <Text style={styles.farmDetail}>Geo Location: {farmData.geo_loc}</Text>
        <Text style={styles.farmDetail}>
          Verified: {farmData.is_verified ? "Yes" : "No"}
        </Text>
        <Text style={styles.farmDetail}>
          Created At: {new Date(farmData.created_at).toLocaleString()}
        </Text>
        <Text style={styles.farmDetail}>
          Updated At: {new Date(farmData.updated_at).toLocaleString()}
        </Text>
        <Button
          title="Work on this Farm"
          onPress={handleSelectFarm}
          color="#4CAF50"
        />
      </View>
      {selectedFarm && (
        <View style={styles.selectedFarm}>
          <Text style={styles.selectedFarmText}>
            Currently working on: {selectedFarm.name}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  farmCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  farmName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  farmDetail: {
    fontSize: 14,
    marginBottom: 5,
  },
  selectedFarm: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
  selectedFarmText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default FarmsTab;
