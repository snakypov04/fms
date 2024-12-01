import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import { getBasket, updateCartQuantities } from "../../api/products"; // Batch update API
import { SafeAreaView } from "react-native";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({}); // Track pending changes

  const fetchCartItems = async () => {
    try {
      const response = await getBasket();
      const cartData = response.data;
      const formattedCartItems = cartData.items.map((item) => ({
        id: item.id,
        title: item.product.name,
        image: "https://via.placeholder.com/150",
        cost: parseFloat(item.product.price),
        quantity: item.quantity,
      }));
      setCartItems(formattedCartItems);
      setTotalPrice(parseFloat(cartData.total_price));
    } catch (error) {
      console.error("Error fetching cart items:", error);
      Alert.alert("Error", "Failed to fetch cart items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCartItems();
    setRefreshing(false);
  };

  const trackPendingChange = (id, newQuantity) => {
    setPendingChanges((prev) => ({
      ...prev,
      [id]: newQuantity, // Store the latest quantity for the item
    }));
  };

  const syncPendingChanges = async () => {
    const changes = Object.entries(pendingChanges).map(([id, quantity]) => ({
      id: parseInt(id),
      quantity,
    }));

    if (changes.length === 0) return; // No pending changes to sync

    try {
      await updateCartQuantities(changes); // Batch API call
      setPendingChanges({}); // Clear pending changes on success
    } catch (error) {
      console.error("Failed to sync pending changes:", error);
      Alert.alert("Error", "Failed to sync changes. Try again.");
    }
  };

  const updateQuantity = (id, newQuantity, adjustmentCost) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    setTotalPrice((prevTotal) => prevTotal + adjustmentCost);
    trackPendingChange(id, newQuantity); // Track pending changes locally
  };

  const increaseQuantity = (id) => {
    const currentItem = cartItems.find((item) => item.id === id);
    if (currentItem) {
      const newQuantity = currentItem.quantity + 1;
      updateQuantity(id, newQuantity, currentItem.cost);
    }
  };

  const decreaseQuantity = (id) => {
    const currentItem = cartItems.find((item) => item.id === id);
    if (currentItem && currentItem.quantity > 1) {
      const newQuantity = currentItem.quantity - 1;
      updateQuantity(id, newQuantity, -currentItem.cost);
    }
  };

  const removeItem = (id) => {
    const currentItem = cartItems.find((item) => item.id === id);
    if (currentItem) {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      setTotalPrice((prevTotal) => prevTotal - currentItem.cost * currentItem.quantity);
      trackPendingChange(id, 0); // Set quantity to 0 for the removed item
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemCost}>${item.cost.toFixed(2)}</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => decreaseQuantity(item.id)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => increaseQuantity(item.id)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeItem(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleCheckout = async () => {
    await syncPendingChanges();
    Alert.alert("Checkout", "Proceeding to checkout...");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={styles.cartList}
        ListHeaderComponent={<Text style={styles.title}>Your Cart</Text>}
        ListFooterComponent={
          cartItems.length > 0 && (
            <View style={styles.checkoutSection}>
              <Text style={styles.totalCost}>Total: ${totalPrice.toFixed(2)}</Text>
              <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyCartText}>Your cart is empty.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  cartList: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    overflow: "hidden",
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemDetails: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemCost: {
    fontSize: 14,
    color: "#555",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  quantityButton: {
    backgroundColor: "#4CAF50",
    padding: 5,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    color: "#333",
  },
  removeButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FF5722",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  checkoutSection: {
    marginTop: 20,
    alignItems: "center",
  },
  totalCost: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyCartText: {
    textAlign: "center",
    fontSize: 18,
    color: "#555",
    marginTop: 50,
  },
});
