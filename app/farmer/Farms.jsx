import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	TextInput,
	Alert,
	RefreshControl,
	SafeAreaView,
} from "react-native";
import { Link } from "expo-router";
import { getFarms, createFarm } from "../../api/farms"; // Assuming API functions are correctly implemented
import { Modal } from "react-native-web";

const FarmsTab = () => {
	const [farms, setFarms] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		address: "",
		geo_loc: "",
		size: "",
		crop_types: "",
	});
	const [refreshing, setRefreshing] = useState(false);

	// Fetch farms data
	const fetchFarms = async () => {
		try {
			const farmsData = await getFarms();
			setFarms(farmsData);
		} catch (error) {
			console.error("Error fetching farms:", error);
		}
	};

	// Fetch farms on component mount
	useEffect(() => {
		fetchFarms();
	}, []);

	// Pull-to-refresh handler
	const onRefresh = async () => {
		setRefreshing(true);
		await fetchFarms(); // Fetch new data
		setRefreshing(false);
	};

	// Create a new farm
	const handleCreateFarm = async () => {
		try {
			await createFarm(formData);
			Alert.alert("Success", "Farm created successfully!");

			// Close modal and reset form
			setModalVisible(false);
			setFormData({
				name: "",
				address: "",
				geo_loc: "",
				size: "",
				crop_types: "",
			});

			await fetchFarms(); // Refresh farms after creation
		} catch (error) {
			Alert.alert("Error", "Failed to create the farm.");
		}
	};

	return (
		<SafeAreaView style={styles.container}>
		<ScrollView
			style={styles.container}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			<Text style={styles.title}>Farm Overview</Text>

			<TouchableOpacity
				style={styles.createButton}
				onPress={() => setModalVisible(true)}
			>
				<Text style={styles.createButtonText}>Create Farm</Text>
			</TouchableOpacity>

			{/* List of Farms */}
			{farms.map((farm) => (
				<View key={farm.id} style={styles.farmCard}>
					<Text style={styles.farmName}>{farm.name}</Text>
					<Text style={styles.farmDetail}>Address: {farm.address}</Text>
					<Text style={styles.farmDetail}>Crops: {farm.crop_types}</Text>
					<Text style={styles.farmDetail}>
						Verified: {farm.is_verified ? "Yes" : "No"}
					</Text>

					{/* View Details Link */}
					<TouchableOpacity style={styles.viewDetailsButton}>
						<Link
							href={`/farmdetails/${farm.id}`}
							style={styles.viewDetailsButtonText}
						>
							View Details
						</Link>
					</TouchableOpacity>
				</View>
			))}

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Create Farm</Text>

						{["name", "address", "geo_loc", "size", "crop_types"].map(
							(field) => (
								<TextInput
									key={field}
									style={styles.input}
									placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
									value={formData[field]}
									onChangeText={(text) =>
										setFormData((prev) => ({ ...prev, [field]: text }))
									}
								/>
							)
						)}

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
			</Modal>
		</ScrollView>
		</SafeAreaView>
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
	createButton: {
		backgroundColor: "#2d6a4f",
		padding: 10,
		borderRadius: 8,
		alignItems: "center",
		marginBottom: 20,
	},
	createButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
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
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 10,
		width: "90%",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 15,
		color: "#2d6a4f",
	},
	input: {
		height: 40,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 5,
		marginBottom: 10,
		paddingHorizontal: 10,
	},
	saveButton: {
		backgroundColor: "#2d6a4f",
		padding: 10,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 10,
	},
	saveButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	cancelButton: {
		marginTop: 10,
		alignItems: "center",
	},
	cancelButtonText: {
		color: "#2d6a4f",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default FarmsTab;
