import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    RefreshControl,
    Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getOrdersBuyer } from "../../api/orders"; // Assuming this function exists and fetches orders

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch orders when the component is mounted
    useFocusEffect(
        React.useCallback(() => {
            fetchOrders(); // Fetch orders on focus
        }, [])
    );

    // Fetch orders from the API
    const fetchOrders = async () => {
        try {
            const response = await getOrdersBuyer();
            setOrders(response.data); // Assuming the API returns a "data" field
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            Alert.alert("Error", "Failed to fetch orders. Please try again.");
        }
    };

    // Refresh control for pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
    };

    // Determine status styling
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

    // Render each item in an order
    const renderOrderItem = (item) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.product.name}</Text>
            <Text style={styles.itemCategory}>Category: {item.product.category.name}</Text>
            <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
            <Text style={styles.itemPrice}>
                Price: ${parseFloat(item.price).toFixed(2)}
            </Text>
            <Text style={styles.itemFarm}>Farm: {item.product.farm.name}</Text>
        </View>
    );

    // Render each order
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
            <Text style={styles.totalPrice}>Total Price: ${item.total_price.toFixed(2)}</Text>
            <Text style={styles.delivery}>
                Delivery Address: {item.buyer.info.delivery_address}
            </Text>
            <Text style={styles.payment}>
                Payment Method: {item.buyer.info.payment_method}
            </Text>
            <ScrollView style={styles.itemsList}>
                {item.items.map((orderItem) => renderOrderItem(orderItem))}
            </ScrollView>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Your Orders</Text>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderOrder}
                contentContainerStyle={styles.ordersList}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>You have no orders yet.</Text>
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
    ordersList: {
        paddingBottom: 20,
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
    delivery: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#324ca8",
        marginBottom: 5,
    },
    payment: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#e32d20",
        marginBottom: 5,
    },
    buyerName: {
        fontSize: 14,
        color: "#777",
        marginBottom: 10,
    },
    itemsList: {
        marginTop: 10,
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
    itemFarm: {
        fontSize: 12,
        color: "#777",
    },
    emptyText: {
        textAlign: "center",
        color: "#999",
        marginTop: 20,
    },
});
