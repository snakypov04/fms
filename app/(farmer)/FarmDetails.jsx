import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView } from "react-native";
import { getFarm } from "../../api/farms";

const FarmDetails = ({ route }) => {
  const { farm_id } = route.params; // Get the farm_id from navigation parameters
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmDetails = async () => {
      try {
        const farmData = await getFarm(farm_id); // Fetch farm details using the API function
        setFarm(farmData);
      } catch (error) {
        console.error("Error fetching farm details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmDetails();
  }, [farm_id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2d6a4f" />
        <Text style={styles.loadingText}>Loading Farm Details...</Text>
      </View>
    );
  }

  if (!farm) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load farm details.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: farm.farmer.avatar || "https://via.placeholder.com/100",
          }}
          style={styles.avatar}
        />
        <Text style={styles.headerTitle}>{farm.name}</Text>
        <Text style={styles.headerSubtitle}>{farm.address}</Text>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Farm Information</Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Geo Location:</Text> {farm.geo_loc}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Size:</Text> {farm.size}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Crops:</Text> {farm.crop_types}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Verified:</Text> {farm.is_verified ? "Yes" : "No"}
        </Text>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Farmer Information</Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Name:</Text> {farm.farmer.first_name} {farm.farmer.last_name}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Email:</Text> {farm.farmer.email}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Phone:</Text> {farm.farmer.phone}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Experience:</Text> {farm.farmer.info.experience || "N/A"} years
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Rating:</Text> {farm.farmer.info.rating || "Not rated"}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  header: {
    backgroundColor: "#2d6a4f",
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#f0f0f0",
  },
  detailsCard: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2d6a4f",
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
});

export default FarmDetails;
