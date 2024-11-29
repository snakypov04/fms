import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	ActivityIndicator,
	ScrollView,
	Modal,
	TextInput,
	TouchableOpacity,
	FlatList,
	Alert,
} from "react-native";
import { getFarm } from "../../api/farms";
import {
	getProductsFromInventory,
	addProductToInventory,
	getCategories,
} from "../../api/inventory";
import RNPickerSelect from "react-native-picker-select";
import { useLocalSearchParams } from "expo-router";

const FarmDetails = () => {
	const { farm_id } = useLocalSearchParams; // Get the farm_id from navigation parameters
	const [farm, setFarm] = useState(null);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState([]);
	const [loadingCategories, setLoadingCategories] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);
	const [productData, setProductData] = useState({
		name: "",
		description: "",
		price: "",
		stock_quantity: "",
		category: 0,
		farm: farm_id,
	});

	// Fetch farm details
	useEffect(() => {
		const fetchFarmDetails = async () => {
			try {
				const farmData = await getFarm(farm_id);
				setFarm(farmData);
				await fetchProducts(); // Fetch products related to the farm
			} catch (error) {
				console.error("Error fetching farm details:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchFarmDetails();
	}, [farm_id]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const categoriesData = await getCategories();
				setCategories(categoriesData);
			} catch (error) {
				Alert.alert("Error", "Failed to load categories.");
			} finally {
				setLoadingCategories(false);
			}
		};

		fetchCategories();
	}, []);

	// Fetch products related to the farm
	const fetchProducts = async () => {
		try {
			const productsData = await getProductsFromInventory(farm_id);
			console.log(productData);
			setProducts(productsData);
		} catch (error) {
			Alert.alert("Error", "Failed to fetch products.");
		}
	};

	// Handle product creation
	const handleAddProduct = async () => {
		if (!productData.category) {
			Alert.alert("Error", "Please select a category.");
			return;
		}

		try {
			await addProductToInventory({ ...productData, farm_id });
			Alert.alert("Success", "Product added successfully!");
			setModalVisible(false);
			setProductData({
				name: "",
				description: "",
				price: "",
				stock_quantity: "",
				category: "", // Reset category
				farm: farm_id,
			});
			await fetchProducts();
		} catch (error) {
			Alert.alert("Error", "Failed to add the product.");
		}
	};

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
					<Text style={styles.label}>Verified:</Text>{" "}
					{farm.is_verified ? "Yes" : "No"}
				</Text>
			</View>

			<View style={styles.detailsCard}>
				<Text style={styles.sectionTitle}>Farmer Information</Text>
				<Text style={styles.detail}>
					<Text style={styles.label}>Name:</Text> {farm.farmer.first_name}{" "}
					{farm.farmer.last_name}
				</Text>
				<Text style={styles.detail}>
					<Text style={styles.label}>Email:</Text> {farm.farmer.email}
				</Text>
				<Text style={styles.detail}>
					<Text style={styles.label}>Phone:</Text> {farm.farmer.phone}
				</Text>
				<Text style={styles.detail}>
					<Text style={styles.label}>Experience:</Text>{" "}
					{farm.farmer.info.experience || "N/A"} years
				</Text>
				<Text style={styles.detail}>
					<Text style={styles.label}>Rating:</Text>{" "}
					{farm.farmer.info.rating || "Not rated"}
				</Text>
			</View>

			{/* Create Product Button */}
			<TouchableOpacity
				style={styles.addButton}
				onPress={() => setModalVisible(true)}
			>
				<Text style={styles.addButtonText}>Create Product</Text>
			</TouchableOpacity>

			{/* List of Products */}
			<View style={styles.detailsCard}>
				<Text style={styles.sectionTitle}>Products</Text>
				<FlatList
					data={products}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => (
						<View style={styles.productCard}>
							<Text style={styles.productName}>Name: {item.name}</Text>
							<Text>Description: {item.description}</Text>
							<Text>Price: ${item.price}</Text>
							<Text>Stock: {item.stock_quantity}</Text>
							<Text>Category: {item.category?.name || "N/A"}</Text>
						</View>
					)}
					ListEmptyComponent={
						<Text style={styles.emptyText}>
							No products available for this farm.
						</Text>
					}
				/>
			</View>

			{/* Modal for Creating Product */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Create Product</Text>

						{/* Name Input */}
						<TextInput
							style={styles.input}
							placeholder="Product Name"
							value={productData.name}
							onChangeText={(text) =>
								setProductData((prev) => ({ ...prev, name: text }))
							}
						/>

						{/* Description Input */}
						<TextInput
							style={styles.input}
							placeholder="Description"
							value={productData.description}
							onChangeText={(text) =>
								setProductData((prev) => ({ ...prev, description: text }))
							}
						/>

						{/* Price Input */}
						<TextInput
							style={styles.input}
							placeholder="Price"
							value={productData.price}
							onChangeText={(text) =>
								setProductData((prev) => ({ ...prev, price: text }))
							}
							keyboardType="numeric"
						/>

						{/* Stock Quantity Input */}
						<TextInput
							style={styles.input}
							placeholder="Stock Quantity"
							value={productData.stock_quantity}
							onChangeText={(text) =>
								setProductData((prev) => ({ ...prev, stock_quantity: text }))
							}
							keyboardType="numeric"
						/>

						{/* Category Picker */}
						{loadingCategories ? (
							<ActivityIndicator size="small" color="#2d6a4f" />
						) : (
							<RNPickerSelect
								onValueChange={(value) =>
									setProductData((prev) => ({ ...prev, category: value }))
								}
								value={productData.category || ""}
								items={categories.map((category) => ({
									label: category.name,
									value: category.id,
								}))}
								placeholder={{
									label: "Select Category...",
									value: "",
								}}
								style={{
									inputIOS: styles.pickerInput,
									inputAndroid: styles.pickerInput,
									placeholder: styles.pickerPlaceholder,
									iconContainer: styles.pickerIconContainer,
								}}
							/>
						)}

						{/* Save Button */}
						<TouchableOpacity
							style={styles.saveButton}
							onPress={handleAddProduct}
						>
							<Text style={styles.saveButtonText}>Save</Text>
						</TouchableOpacity>

						{/* Cancel Button */}
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
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
	},
	modalContent: {
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 10,
		width: "80%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 6,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#2d6a4f",
		textAlign: "center",
	},
	input: {
		height: 45,
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 8,
		paddingLeft: 10,
		marginBottom: 15,
		fontSize: 16,
		color: "#333",
	},
	saveButton: {
		backgroundColor: "#2d6a4f",
		paddingVertical: 12,
		borderRadius: 8,
		marginBottom: 10,
	},
	saveButtonText: {
		color: "#fff",
		fontSize: 16,
		textAlign: "center",
		fontWeight: "bold",
	},
	cancelButton: {
		backgroundColor: "#f0f0f0",
		paddingVertical: 12,
		borderRadius: 8,
	},
	cancelButtonText: {
		color: "#2d6a4f",
		fontSize: 16,
		textAlign: "center",
		fontWeight: "bold",
	},
	addButton: {
		backgroundColor: "#2d6a4f",
		paddingVertical: 12,
		paddingHorizontal: 25,
		borderRadius: 8,
		alignItems: "center",
		margin: 15,
	},
	addButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	productCard: {
		backgroundColor: "#fff",
		padding: 15,
		marginBottom: 10,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	productName: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2d6a4f",
		marginBottom: 5,
	},
	emptyText: {
		fontSize: 16,
		color: "#555",
		textAlign: "center",
		marginVertical: 20,
	},
	pickerContainer: {
		marginBottom: 15,
	},
	pickerInput: {
		height: 45,
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 8,
		paddingLeft: 10,
		fontSize: 16,
		backgroundColor: "#fff",
		color: "#333",
	},
	pickerPlaceholder: {
		color: "#888",
		fontSize: 16,
	},
	pickerIconContainer: {
		top: 10,
		right: 10,
	},
});

export default FarmDetails;
