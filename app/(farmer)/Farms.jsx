import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getFarms } from "../../api/farms";

const FarmsTab = () => {
  const [farms, setFarms] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFarms = async () => {
      const farmsData = await getFarms();
      console.log(farmsData);
      setFarms(farmsData);
    };
    fetchFarms();
  }, []);

  const handleViewDetails = (farmId) => {
    navigation.navigate("FarmDetails", { farm_id: farmId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farm Overview</Text>
      {farms.map((farm) => (
        <View key={farm.id} style={styles.farmCard}>
          <Text style={styles.farmName}>{farm.name}</Text>
          <Text style={styles.farmDetail}>Address: {farm.address}</Text>
          <Text style={styles.farmDetail}>Crops: {farm.crop_types}</Text>
          <Text style={styles.farmDetail}>
            Verified: {farm.is_verified ? "Yes" : "No"}
          </Text>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => handleViewDetails(farm.id)}
          >
            <Text style={styles.viewDetailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      ))}
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
    marginBottom: 15,
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
