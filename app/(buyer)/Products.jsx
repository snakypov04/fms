import React, { useState, useEffect } from "react";
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
  Alert,
  Picker,
} from "react-native";
import { getProducts, addProduct } from "../../api/products";

const categories = ["All", "Fruits", "Vegetables", "Dairy", "Bakery", "Meat"];
const sortOptions = [
  { label: "Price: Low to High", value: "priceAsc" },
  { label: "Price: High to Low", value: "priceDesc" },
];

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [selectedSort, setSelectedSort] = useState("priceAsc");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1)); // Button animation

  useEffect(() => {
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
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.farm.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesPrice =
        (!priceFilter.min || product.cost >= parseFloat(priceFilter.min)) &&
        (!priceFilter.max || product.cost <= parseFloat(priceFilter.max));
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (selectedSort === "priceAsc") return a.cost - b.cost;
      if (selectedSort === "priceDesc") return b.cost - a.cost;
      return 0;
    });

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

      {/* Price Filter and Sort Options */}
      <View style={styles.filterAndSortContainer}>
        <View style={styles.priceFilterContainer}>
          <TextInput
            style={styles.priceInput}
            placeholder="Min Price"
            keyboardType="numeric"
            value={priceFilter.min}
            onChangeText={(value) =>
              setPriceFilter((prev) => ({ ...prev, min: value }))
            }
          />
          <TextInput
            style={styles.priceInput}
            placeholder="Max Price"
            keyboardType="numeric"
            value={priceFilter.max}
            onChangeText={(value) =>
              setPriceFilter((prev) => ({ ...prev, max: value }))
            }
          />
        </View>
        <Picker
          selectedValue={selectedSort}
          style={styles.sortPicker}
          onValueChange={(value) => setSelectedSort(value)}
        >
          {sortOptions.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={item.image} style={styles.productImage} />
            <View style={styles.cardContent}>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productFarm}>{item.farm}</Text>
              <Text style={styles.productCategory}>{item.category}</Text>
              <Text style={styles.productCost}>${item.cost.toFixed(2)}</Text>
              <Text style={styles.productRemaining}>
                Remaining: {item.remaining}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
  filterAndSortContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  priceFilterContainer: {
    flex: 1,
    flexDirection: "row",
  },
  priceInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  sortPicker: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
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
});
