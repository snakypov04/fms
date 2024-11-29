import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { getProductsFromInventory } from "../../api/inventory"; // Adjust the path

export default function Inventory() {
	const [products, setProducts] = useState([]);

	// Fetch products and update state
	const fetchProducts = async () => {
		try {
			const data = await getProductsFromInventory();
			setProducts(data); // Store products in state
		} catch (error) {
			Alert.alert("Error", "Failed to fetch products.");
		}
	};

	useEffect(() => {
		fetchProducts(); // Fetch products on component mount
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Inventory</Text>

			{/* List of Products */}
			<FlatList
				data={products}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<View style={styles.productCard}>
						<Text style={styles.productName}>Name: {item.name}</Text>
						<Text style={styles.productDescription}>
							Description: {item.description}
						</Text>
						<Text style={styles.productDetail}>Price: ${item.price}</Text>
						<Text style={styles.productDetail}>
							Stock: {item.stock_quantity}
						</Text>
						<Text style={styles.productDetail}>
							Category: {item.category?.name || "N/A"}
						</Text>
					</View>
				)}
				ListEmptyComponent={
					<Text style={styles.emptyText}>No products available.</Text>
				}
			/>
		</View>
	);
}

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
	// Create Product Button
	addButton: {
		backgroundColor: "#4CAF50",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		marginHorizontal: 20,
		marginBottom: 10,
	},
	addButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	// Product Card
	productCard: {
		backgroundColor: "#f9f9f9",
		padding: 15,
		marginBottom: 10,
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	productName: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 5,
	},
	emptyText: {
		textAlign: "center",
		color: "#777",
		marginTop: 20,
	},
	// Modal Styling
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		width: "90%",
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 10,
		elevation: 5,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 15,
		textAlign: "center",
		color: "#2d6a4f",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		marginVertical: 10,
		fontSize: 16,
	},
	saveButton: {
		backgroundColor: "#4CAF50",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
		marginVertical: 5,
	},
	saveButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	cancelButton: {
		backgroundColor: "#f44336",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
		marginVertical: 5,
	},
	cancelButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});
