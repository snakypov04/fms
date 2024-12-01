import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	Alert,
	ScrollView,
	RefreshControl,
	SafeAreaView,
} from "react-native";
import { getFarms, createFarm } from "../../api/farms";
import { useRouter } from "expo-router";
// import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const FarmsTab = () => {
	const router = useRouter();
	const [farms, setFarms] = useState([]); // Farm data
	const [formData, setFormData] = useState({
		name: "",
		address: "",
		latitude: "",
		longitude: "",
		size: "",
		crop_types: "",
	}); // Form data
	const [refreshing, setRefreshing] = useState(false); // Refresh state
	const [modalVisible, setModalVisible] = useState(false); // Modal visibility
	const [location, setLocation] = useState({
		latitude: null,
		longitude: null,
	});

	// Fetch farms from API
	const fetchFarms = async (latitude, longitude) => {
		try {
			const farmsData = await getFarms(latitude, longitude);
			setFarms(farmsData);
		} catch (error) {
			console.error("Error fetching farms:", error);
			Alert.alert("Error", "Failed to load farms.");
		}
	};

	useEffect(() => {
		fetchingEvents();
	}, []);


	const fetchingEvents = async () => {
		const { latitude, longitude } = await getCurrentLocation();
		console.log(latitude, longitude);
		await fetchFarms(latitude, longitude);
	}



	const getCurrentLocation = async () => {
		return new Promise((resolve, reject) => {
			if ("geolocation" in navigator) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const { latitude, longitude } = position.coords;
						setLocation({ latitude, longitude });
						console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
						resolve({ latitude, longitude });
					},
					(error) => {
						console.error(error);
						console.log("Failed to get location. Make sure location services are enabled.");
						reject(error);
					}
				);
			} else {
				console.log("Geolocation is not supported by your browser.");
				reject(new Error("Geolocation not supported"));
			}
		});
	};

	// Handle form submission to create a farm
	const handleCreateFarm = async () => {
		const { name, address, latitude, longitude } = formData;

		if (!name || !address || !latitude || !longitude) {
			Alert.alert("Validation Error", "All fields are required.");
			return;
		}

		if (isNaN(latitude) || isNaN(longitude)) {
			Alert.alert("Validation Error", "Latitude and Longitude must be numbers.");
			return;
		}

		try {
			await createFarm({
				...formData,
				latitude: parseFloat(latitude),
				longitude: parseFloat(longitude),
			});
			Alert.alert("Success", "Farm created successfully!");
			setModalVisible(false);
			setFormData({
				name: "",
				address: "",
				latitude: "",
				longitude: "",
				size: "",
				crop_types: "",
			});
			await fetchFarms();
		} catch (error) {
			console.error("Error creating farm:", error);
			Alert.alert("Error", "Failed to create farm.");
		}
	};

	// Refresh handler
	const onRefresh = async () => {
		setRefreshing(true);
		await fetchFarms();
		setRefreshing(false);
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			>
				<Text style={styles.title}>Farm Overview</Text>
				<TouchableOpacity
					style={styles.createButton}
					onPress={() => setModalVisible(true)}
				>
					<Text style={styles.createButtonText}>Create Farm</Text>
				</TouchableOpacity>

				{farms.map((farm) => (
					<View key={farm.id} style={styles.farmCard}>
						<Text style={styles.farmName}>{farm.name}</Text>
						<Text style={styles.farmDetail}>Address: {farm.address}</Text>
						<Text style={styles.farmDetail}>Crops: {farm.crop_types}</Text>
						<Text style={styles.farmDetail}>
							Distance to the farm: {farm.distance !== null ? `${farm.distance} km` : "Not available"}
						</Text>
						<Text style={styles.farmDetail}>
							Verified: {farm.is_verified ? "Yes" : "No"}
						</Text>
						<TouchableOpacity
							style={styles.viewDetailsButton}
							onPress={() => router.push(`/farmdetails/${farm.id}`)}
						>
							<Text style={styles.viewDetailsButtonText}>View Details</Text>
						</TouchableOpacity>
					</View>
				))}

				{modalVisible && (
					<View style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>Create Farm</Text>
							<TextInput
								style={styles.input}
								placeholder="Name"
								value={formData.name}
								onChangeText={(text) =>
									setFormData((prev) => ({ ...prev, name: text }))
								}
							/>
							<TextInput
								style={styles.input}
								placeholder="Address"
								value={formData.address}
								onChangeText={(text) =>
									setFormData((prev) => ({ ...prev, address: text }))
								}
							/>
							<TextInput
								style={styles.input}
								placeholder="Latitude"
								value={formData.latitude}
								onChangeText={(text) =>
									setFormData((prev) => ({ ...prev, latitude: text }))
								}
								keyboardType="numeric"
							/>
							<TextInput
								style={styles.input}
								placeholder="Longitude"
								value={formData.longitude}
								onChangeText={(text) =>
									setFormData((prev) => ({ ...prev, longitude: text }))
								}
								keyboardType="numeric"
							/>
							<TextInput
								style={styles.input}
								placeholder="Size"
								value={formData.size}
								onChangeText={(text) =>
									setFormData((prev) => ({ ...prev, size: text }))
								}
							/>
							<TextInput
								style={styles.input}
								placeholder="Crop Types"
								value={formData.crop_types}
								onChangeText={(text) =>
									setFormData((prev) => ({ ...prev, crop_types: text }))
								}
							/>
							<TouchableOpacity
								style={styles.saveButton}
								onPress={handleCreateFarm}
							>
								<Text style={styles.saveButtonText}>Save</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.cancelButton}
								onPress={() => setModalVisible(false)}
							>
								<Text style={styles.cancelButtonText}>Cancel</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 15, backgroundColor: "#f4f4f4" },
	title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
	createButton: {
		backgroundColor: "#2d6a4f",
		padding: 10,
		borderRadius: 8,
		alignItems: "center",
		marginBottom: 20,
	},
	createButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
	farmCard: { backgroundColor: "#fff", borderRadius: 10, padding: 20, marginBottom: 15 },
	farmName: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
	farmDetail: { fontSize: 16, marginBottom: 8 },
	viewDetailsButton: {
		marginTop: 10,
		backgroundColor: "#2d6a4f",
		padding: 10,
		borderRadius: 8,
		alignItems: "center",
	},
	viewDetailsButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
	modalContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "90%" },
	modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
	input: {
		height: 40,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 5,
		marginBottom: 10,
		paddingHorizontal: 10,
	},
	saveButton: { backgroundColor: "#2d6a4f", padding: 10, borderRadius: 8, alignItems: "center" },
	saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
	cancelButton: { marginTop: 10, alignItems: "center" },
	cancelButtonText: { color: "#2d6a4f", fontSize: 16, fontWeight: "bold" },
});

export default FarmsTab;
