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
} from "react-native";

// Sample data for products
const products = [
  {
    id: 1,
    title: "Fresh Apples",
    farm: "Sunny Farm",
    image: require("../../assets/images/apple.jpg"),
    cost: 5.99,
    category: "Fruits",
    remaining: 25,
    description: "Freshly picked apples from Sunny Farm. Juicy and delicious!",
  },
  {
    id: 2,
    title: "Organic Carrots",
    farm: "Green Valley",
    image: require("../../assets/images/carrot.jpg"),
    cost: 3.49,
    category: "Vegetables",
    remaining: 30,
    description: "Crunchy organic carrots from Green Valley.",
  },
  {
    id: 3,
    title: "Free Range Eggs",
    farm: "Hilltop Farm",
    image: require("../../assets/images/eggs.jpg"),
    cost: 6.99,
    category: "Dairy",
    remaining: 15,
    description: "Fresh free-range eggs, straight from Hilltop Farm.",
  },
];

const categories = ["All", "Fruits", "Vegetables", "Dairy", "Bakery", "Meat"];

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1)); // Button animation

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farm.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert(`${product.title} added to cart!`);
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

  const renderProductCard = ({ item }) => (
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
            style={styles.addToCartButton}
            onPress={() => {
              animateButton();
              addToCart(item);
            }}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by title or farm"
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Category Filter Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          maxHeight: "fit-content",
          marginBottom: "7px",
        }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category &&
                  styles.selectedCategoryButtonText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductCard}
        contentContainerStyle={styles.productList}
      />

      {/* Product Details Modal */}
      {selectedProduct && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Image
                source={selectedProduct.image}
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
              <Text style={styles.modalFarm}>{selectedProduct.farm}</Text>
              <Text style={styles.modalCost}>
                ${selectedProduct.cost.toFixed(2)}
              </Text>
              <Text style={styles.modalRemaining}>
                Remaining: {selectedProduct.remaining}
              </Text>
              <Text style={styles.modalDescription}>
                {selectedProduct.description}
              </Text>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => {
                  addToCart(selectedProduct);
                  closeModal();
                }}
              >
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
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
});
