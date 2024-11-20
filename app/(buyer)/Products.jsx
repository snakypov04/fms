import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';

// Sample data for products
const products = [
  {
    id: 1,
    title: 'Fresh Apples',
    farm: 'Sunny Farm',
    image: require('../../assets/images/apple.jpg'),
    cost: 5.99,
    category: 'Fruits',
  },
  {
    id: 2,
    title: 'Organic Carrots',
    farm: 'Green Valley',
    image: require('../../assets/images/carrot.jpg'),
    cost: 3.49,
    category: 'Vegetables',
  },
  {
    id: 3,
    title: 'Free Range Eggs',
    farm: 'Hilltop Farm',
    image: require('../../assets/images/eggs.jpg'),
    cost: 6.99,
    category: 'Dairy',
  },
  {
    id: 4,
    title: 'Fresh Milk',
    farm: 'Dairy Delight',
    image: require('../../assets/images/milk.jpg'),
    cost: 4.99,
    category: 'Dairy',
  },
  {
    id: 5,
    title: 'Juicy Oranges',
    farm: 'Citrus Grove',
    image: require('../../assets/images/orange.jpg'),
    cost: 4.49,
    category: 'Fruits',
  },
];

const categories = ['All', 'Fruits', 'Vegetables', 'Dairy'];

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter products by search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farm.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProductCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.cardContent}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productFarm}>{item.farm}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productCost}>${item.cost.toFixed(2)}</Text>
      </View>
    </View>
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
        showsHorizontalScrollIndicator
        contentContainerStyle={styles.categoryRow}
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
                selectedCategory === category && styles.selectedCategoryButtonText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product List */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductCard}
          contentContainerStyle={styles.productList}
        />
      ) : (
        <Text style={styles.emptyMessage}>No products match your filters.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f7f7f7',
  },
  searchBar: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  categoryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
  },
  selectedCategoryButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productList: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 3, // Add shadow for Android
  },
  productImage: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productFarm: {
    fontSize: 14,
    color: '#555',
  },
  productCategory: {
    fontSize: 12,
    color: '#999',
  },
  productCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});
