import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
	Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { getProducts, addProductToCart, getBasket } from "../../api/products";
import { getCategories } from "../../api/inventory";

export default function Products() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [sortOption, setSortOption] = useState("priceAsc");
	const [products, setProducts] = useState([]);
	const [cartItems, setCartItems] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [categories, setCategories] = useState([]);
	const [location, setLocation] = useState({
		latitude: null,
		longitude: null,
	});

	useFocusEffect(
		React.useCallback(() => {
			const fetchData = async () => {
				const { latitude, longitude } = await getCurrentLocation();
				console.log(latitude, longitude);
				await fetchProducts(latitude, longitude);
				await fetchCartItems();
				await fetchCategories();
			};
			fetchData();
		}, [])
	);

	const fetchProducts = async (latitude, longitude) => {
		try {
			const response = await getProducts(latitude, longitude);
			const formattedProducts = response.data.map((product) => {
				const distance = product.farm.distance != null ? parseFloat(product.farm.distance) : Infinity; // Default to Infinity if distance is missing
				console.log(`Product ID: ${product.id}, Distance: ${distance}`);
				return {
					id: product.id,
					title: product.name,
					farm: product.farm.name,
					image: "", // Replace with a proper image URL or placeholder
					cost: parseFloat(product.price),
					category: product.category.name,
					remaining: product.stock_quantity,
					distance: distance,
				};
			});
			setProducts(formattedProducts);
		} catch (error) {
			console.error("Failed to fetch products:", error);
			Alert.alert("Error", "Failed to fetch products.");
		}
	};


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

	const fetchCartItems = async () => {
		try {
			const response = await getBasket();
			const cartProductIds = response.data.items.map((item) => item.product.id);
			setCartItems(cartProductIds);
		} catch (error) {
			console.error("Failed to fetch cart items:", error);
			Alert.alert("Error", "Failed to fetch cart items.");
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
			Alert.alert("Error", "Failed to fetch categories.");
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
			Alert.alert("Already in Cart", `${product.title} is already in the cart.`);
			return;
		}

		try {
			await addProductToCart({
				product_id: product.id,
				quantity: 1,
			});
			setCartItems((prev) => [...prev, product.id]);
			Alert.alert("Added to Cart", `${product.title} has been added to the cart.`);
		} catch (error) {
			console.error("Failed to add product to cart:", error);
			Alert.alert("Error", "Failed to add product to cart.");
		}
	};

	const sortProducts = (products) => {
		return products.sort((a, b) => {
			switch (sortOption) {
				case "priceAsc":
					return a.cost - b.cost;
				case "priceDesc":
					return b.cost - a.cost;
				case "quantityAsc":
					return a.remaining - b.remaining;
				case "quantityDesc":
					return b.remaining - a.remaining;
				case "distanceAsc":
					return (a.distance || Infinity) - (b.distance || Infinity); // Handle missing distances
				case "distanceDesc":
					return (b.distance || -Infinity) - (a.distance || -Infinity); // Handle missing distances
				default:
					return 0;
			}
		});
	};

	const displayedProducts = sortProducts(
		products.filter((product) => {
			const matchesSearch =
				product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.farm.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory =
				selectedCategory === "All" || product.category === selectedCategory;
			return matchesSearch && matchesCategory;
		})
	);

	const renderProductCard = ({ item }) => (
		<View style={styles.card}>
			<View style={styles.cardImageContainer}>
				<Text style={styles.cardImagePlaceholder}>Image</Text>
			</View>
			<View style={styles.cardContent}>
				<Text style={styles.productTitle}>{item.title}</Text>
				<Text style={styles.productFarm}>{item.farm}</Text>
				{item.distance !== Infinity && (
					<Text style={styles.productFarm}>Distance: {item.distance} km</Text>
				)}
				<Text style={styles.productCost}>${item.cost.toFixed(2)}</Text>
				<Text style={styles.productRemaining}>Stock: {item.remaining}</Text>
				<TouchableOpacity
					style={[
						styles.addToCartButton,
						cartItems.includes(item.id) && styles.alreadyAddedButton,
					]}
					onPress={() => addToCart(item)}
					disabled={cartItems.includes(item.id)}
				>
					<Text
						style={[
							styles.addToCartText,
							cartItems.includes(item.id) && styles.alreadyAddedText,
						]}
					>
						{cartItems.includes(item.id) ? "Added to Cart" : "Add to Cart"}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.header}>Products</Text>
			<TextInput
				style={styles.searchBar}
				placeholder="Search by product or farm"
				value={searchQuery}
				onChangeText={setSearchQuery}
			/>

			<View style={styles.filters}>
				<View style={styles.filter}>
					<Text style={styles.filterLabel}>Category:</Text>
					<Picker
						selectedValue={selectedCategory}
						style={styles.picker}
						onValueChange={(itemValue) => setSelectedCategory(itemValue)}
					>
						{categories.map((category) => (
							<Picker.Item
								key={category.id}
								label={category.name}
								value={category.name}
							/>
						))}
					</Picker>
				</View>

				<View style={styles.filter}>
					<Text style={styles.filterLabel}>Sort By:</Text>
					<Picker
						selectedValue={sortOption}
						style={styles.picker}
						onValueChange={(itemValue) => setSortOption(itemValue)}
					>
						<Picker.Item label="Price: Low to High" value="priceAsc" />
						<Picker.Item label="Price: High to Low" value="priceDesc" />
						<Picker.Item label="Stock: Low to High" value="quantityAsc" />
						<Picker.Item label="Stock: High to Low" value="quantityDesc" />
						<Picker.Item label="Distance: Nearest First" value="distanceAsc" />
						<Picker.Item label="Distance: Farthest First" value="distanceDesc" />
					</Picker>
				</View>
			</View>

			<FlatList
				data={displayedProducts}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderProductCard}
				contentContainerStyle={styles.productList}
				refreshing={refreshing}
				onRefresh={onRefresh}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 15, backgroundColor: "#f9f9f9" },
	header: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#333" },
	searchBar: {
		height: 50,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 10,
		paddingHorizontal: 15,
		marginBottom: 15,
		backgroundColor: "#fff",
		fontSize: 16,
	},
	filters: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
	filter: { flex: 1, marginHorizontal: 5 },
	filterLabel: { fontSize: 14, color: "#555", marginBottom: 5 },
	picker: { height: 50, backgroundColor: "#fff", borderRadius: 10 },
	card: {
		flexDirection: "row",
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 15,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 2,
	},
	cardImageContainer: {
		width: 80,
		height: 80,
		borderRadius: 10,
		backgroundColor: "#f0f0f0",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15,
	},
	cardImagePlaceholder: { fontSize: 12, color: "#bbb" },
	cardContent: { flex: 1, justifyContent: "space-between" },
	productTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
	productFarm: { fontSize: 14, color: "#555" },
	productCost: { fontSize: 14, fontWeight: "bold", color: "#4CAF50" },
	productRemaining: { fontSize: 12, color: "#999" },
	addToCartButton: {
		backgroundColor: "#4CAF50",
		borderRadius: 10,
		padding: 10,
		alignItems: "center",
		marginTop: 10,
	},
	addToCartText: { color: "#fff", fontWeight: "bold" },
	alreadyAddedButton: { backgroundColor: "#ccc" },
	alreadyAddedText: { color: "#555" },
});
