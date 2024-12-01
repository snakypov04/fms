import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { getOrdersFarmer, updateOrderStatus } from "../../api/orders";
import { useFocusEffect } from "@react-navigation/native";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, [])
  );

  const fetchOrders = async () => {
    try {
      const response = await getOrdersFarmer();
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      Alert.alert("Error", "Failed to fetch orders. Please try again.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      Alert.alert("Success", `Order status updated to ${newStatus}.`);
      fetchOrders(); // Refresh orders after updating status
    } catch (error) {
      console.error("Failed to update status:", error);
      Alert.alert("Error", "Failed to update order status. Please try again.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return styles.statusPending;
      case "processing":
        return styles.statusProcessing;
      case "completed":
        return styles.statusCompleted;
      case "cancelled":
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  const renderOrderItem = (item) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.product.name}</Text>
      <Text style={styles.itemCategory}>
        Category: {item.product.category.name}
      </Text>
      <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
      <Text style={styles.itemPrice}>
        Price: ${parseFloat(item.price).toFixed(2)}
      </Text>
    </View>
  );

  const renderOrder = ({ item }) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order ID: {item.id}</Text>
        <Text style={[styles.orderStatus, getStatusStyle(item.status)]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
      <Text style={styles.orderDate}>
        Date: {new Date(item.created_at).toLocaleString()}
      </Text>
      <Text style={styles.totalPrice}>
        Total Price: ${item.total_price.toFixed(2)}
      </Text>
      <Text style={styles.buyerName}>
        Buyer: {item.buyer.first_name} {item.buyer.last_name}
      </Text>
      <FlatList
        data={item.items}
        keyExtractor={(orderItem) => orderItem.id.toString()}
        renderItem={({ item }) => renderOrderItem(item)}
      />
      <View style={styles.statusButtonsContainer}>
        {["pending", "processing", "completed", "cancelled"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusButton,
              item.status === status && styles.selectedStatusButton,
            ]}
            onPress={() => updateStatus(item.id, status)}
            disabled={item.status === status}
          >
            <Text
              style={[
                styles.statusButtonText,
                item.status === status && styles.selectedStatusButtonText,
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFarm = ({ item: farm }) => (
    <View style={styles.farmContainer}>
      <Text style={styles.farmTitle}>{farm.name}</Text>
      <FlatList
        data={farm.orders}
        keyExtractor={(order) => order.id.toString()}
        renderItem={renderOrder}
      />
    </View>
  );

  const groupedOrders = Object.values(
    orders.reduce((groups, order) => {
      const farmId = order.farm.id;
      if (!groups[farmId]) {
        groups[farmId] = {
          ...order.farm,
          orders: [],
        };
      }
      groups[farmId].orders.push(order);
      return groups;
    }, {})
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      <FlatList
        data={groupedOrders}
        keyExtractor={(farm) => farm.id.toString()}
        renderItem={renderFarm}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders found for your farms.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  farmContainer: {
    marginBottom: 20,
  },
  farmTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    textTransform: "capitalize",
  },
  statusPending: {
    backgroundColor: "#FFEB3B",
    color: "#333",
  },
  statusProcessing: {
    backgroundColor: "#2196F3",
    color: "#fff",
  },
  statusCompleted: {
    backgroundColor: "#4CAF50",
    color: "#fff",
  },
  statusCancelled: {
    backgroundColor: "#F44336",
    color: "#fff",
  },
  statusDefault: {
    backgroundColor: "#ccc",
    color: "#333",
  },
  orderDate: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 5,
  },
  buyerName: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  itemCategory: {
    fontSize: 12,
    color: "#555",
  },
  itemQuantity: {
    fontSize: 12,
    color: "#555",
  },
  itemPrice: {
    fontSize: 12,
    color: "#4CAF50",
  },
  statusButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  statusButton: {
    backgroundColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 5,
  },
  selectedStatusButton: {
    backgroundColor: "#4CAF50",
  },
  statusButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  selectedStatusButtonText: {
    color: "#fff",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});
