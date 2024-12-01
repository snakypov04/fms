import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	FlatList,
	TouchableOpacity,
	Image,
	StyleSheet,
	ScrollView,
	Modal,
	Animated,
	SafeAreaView,
	RefreshControl,
	Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
	getProducts,
	addProductToCart,
	getBasket,
} from "../../api/products";
import { getCategories } from "../../api/inventory";

export default function Products() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [products, setProducts] = useState([]);
	const [cartItems, setCartItems] = useState([]); // Track products already in cart
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [buttonScale] = useState(new Animated.Value(1)); // Button animation
	const [refreshing, setRefreshing] = useState(false);
	const [categories, setCategories] = useState([]);

	// Fetch all data when the screen is focused
	useFocusEffect(
		React.useCallback(() => {
			const fetchData = async () => {
				await fetchProducts();
				await fetchCartItems();
				await fetchCategories();
			};

			fetchData(); // Call the function to fetch data
		}, [])
	);

	const fetchProducts = async () => {
		try {
			const response = await getProducts();
			const formattedProducts = response.data.map((product) => ({
				id: product.id,
				title: product.name,
				farm: product.farm.name,
				image: "", // Replace with a proper image URL or placeholder
				cost: parseFloat(product.price),
				category: product.category.name,
				remaining: product.stock_quantity,
				description: product.description || "No description available.",
			}));
			setProducts(formattedProducts);
		} catch (error) {
			console.error("Failed to fetch products:", error);
			Alert.alert("Error", "Failed to fetch products.");
		}
	};

	const fetchCategories = async () => {
		try {
			const categoryData = await getCategories();
			const fetchedCategories = categoryData.map((category) => ({
				id: category.id,
				name: category.name,
			}));
			setCategories([{ id: 0, name: "All" }, ...fetchedCategories]);
		} catch (error) {
			console.error("Failed to fetch categories:", error);
			Alert.alert("Error", "Failed to fetch categories. Please try again.");
		}
	};

	const fetchCartItems = async () => {
		try {
			const response = await getBasket();
			const cartData = response.data;

			// Extract product IDs from the cart's items
			const cartProductIds = cartData.items.map((item) => item.product.id);

			setCartItems(cartProductIds); // Store product IDs in the cart
		} catch (error) {
			console.error("Failed to fetch cart items:", error);
			Alert.alert("Error", "Failed to fetch cart items.");
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchProducts();
		await fetchCartItems();
		await fetchCategories();
		setRefreshing(false);
	};

	const addToCart = async (product) => {
		if (cartItems.includes(product.id)) {
			Alert.alert(
				"Already Added",
				`${product.title} is already in the cart.`,
				[
					{
						text: "Cancel",
						style: "cancel",
					},
				]
			);
			return;
		}

		try {
			await addProductToCart({
				product_id: product.id,
				quantity: 1,
			});
			setCartItems((prev) => [...prev, product.id]); // Update cart items locally
			Alert.alert("Success", `${product.title} added to cart!`);
		} catch (error) {
			console.error("Failed to add product to cart:", error);
			Alert.alert("Error", "Failed to add product to cart. Please try again.");
		}
	};

	const openProductDetails = (product) => {
		setSelectedProduct(product);
		setModalVisible(true);
	};

	const closeModal = () => {
		setModalVisible(false);
		setSelectedProduct(null);
	};

	const animateButton = () => {
		Animated.sequence([
			Animated.timing(buttonScale, {
				toValue: 0.95,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(buttonScale, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start();
	};

	const filteredProducts = products.filter((product) => {
		const matchesSearch =
			product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.farm.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory =
			selectedCategory === "All" || product.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const renderProductCard = ({ item }) => {
		const isInCart = cartItems.includes(item.id); // Check if product is already in the cart

		return (
			<TouchableOpacity
				style={styles.card}
				onPress={() => openProductDetails(item)}
			>
				<Image source={item.image} style={styles.productImage} />
				<View style={styles.cardContent}>
					<Text style={styles.productTitle}>{item.title}</Text>
					<Text style={styles.productFarm}>{item.farm}</Text>
					<Text style={styles.productCategory}>{item.category}</Text>
					<Text style={styles.productCost}>${item.cost.toFixed(2)}</Text>
					<Text style={styles.productRemaining}>Remaining: {item.remaining}</Text>
					<Animated.View style={{ transform: [{ scale: buttonScale }] }}>
						<TouchableOpacity
							style={[
								styles.addToCartButton,
								isInCart && styles.alreadyAddedButton,
							]}
							onPress={() => {
								animateButton();
								addToCart(item);
							}}
							disabled={isInCart} // Disable if already in cart
						>
							<Text
								style={[
									styles.addToCartText,
									isInCart && styles.alreadyAddedText,
								]}
							>
								{isInCart ? "Already Added" : "Add to Cart"}
							</Text>
						</TouchableOpacity>
					</Animated.View>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<TextInput
				style={styles.searchBar}
				placeholder="Search by title or farm"
				placeholderTextColor="#999"
				value={searchQuery}
				onChangeText={setSearchQuery}
			/>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.categoryRow}
			>
				{categories.map((category) => (
					<TouchableOpacity
						key={category.id}
						style={[
							styles.categoryButton,
							selectedCategory === category.name && styles.selectedCategoryButton,
						]}
						onPress={() => setSelectedCategory(category.name)}
					>
						<Text
							style={[
								styles.categoryButtonText,
								selectedCategory === category.name &&
								styles.selectedCategoryButtonText,
							]}
						>
							{category.name}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>

			<FlatList
				data={filteredProducts}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderProductCard}
				contentContainerStyle={styles.productList}
				refreshing={refreshing}
				onRefresh={onRefresh}
			/>

			{/* Add your modal for product details here */}
		</SafeAreaView>
	);
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		backgroundColor: "#f7f7f7",
	},
	searchBar: {
		height: 50,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#ccc",
		paddingHorizontal: 10,
		marginBottom: 10,
		backgroundColor: "#fff",
		fontSize: 16,
	},
	categoryButton: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 20,
		paddingVertical: 8,
		paddingHorizontal: 16,
		marginRight: 10,
	},
	selectedCategoryButton: {
		backgroundColor: "#4CAF50",
		borderColor: "#4CAF50",
	},
	categoryButtonText: {
		fontSize: 14,
		color: "#333",
	},
	selectedCategoryButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	productList: {
		paddingBottom: 20,
	},
	card: {
		flexDirection: "row",
		backgroundColor: "#fff",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#ccc",
		marginBottom: 10,
		overflow: "hidden",
		elevation: 3,
	},
	productImage: {
		width: 100,
		height: 100,
	},
	cardContent: {
		flex: 1,
		padding: 10,
		justifyContent: "space-between",
	},
	productTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
	},
	productFarm: {
		fontSize: 14,
		color: "#555",
	},
	productCategory: {
		fontSize: 12,
		color: "#999",
	},
	productCost: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#4CAF50",
	},
	productRemaining: {
		fontSize: 12,
		color: "#777",
	},
	addToCartButton: {
		backgroundColor: "#4CAF50",
		borderRadius: 8,
		padding: 8,
		marginTop: 5,
		alignItems: "center",
	},
	addToCartText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "bold",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "90%",
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
		maxHeight: "80%",
	},
	modalImage: {
		width: 150,
		height: 150,
		marginBottom: 10,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 5,
	},
	modalFarm: {
		fontSize: 16,
		color: "#555",
		marginBottom: 5,
	},
	modalCost: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#4CAF50",
		marginBottom: 10,
	},
	modalRemaining: {
		fontSize: 14,
		color: "#777",
		marginBottom: 10,
	},
	modalDescription: {
		fontSize: 14,
		textAlign: "center",
		color: "#555",
		marginBottom: 10,
	},
	closeButton: {
		position: "absolute",
		top: 10,
		right: 10,
		backgroundColor: "#e0e0e0",
		borderRadius: 15,
		padding: 8,
	},
	closeButtonText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
	},
	alreadyAddedButton: {
		backgroundColor: "#4287f5", // Light salmon color for "Already Added"
		borderRadius: 8,
		padding: 8,
		marginTop: 5,
		alignItems: "center",
	},
	alreadyAddedText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "bold",
	},

});
