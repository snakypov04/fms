import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrdersPage = () => {
  // Example hardcoded orders data
  const exampleOrders = [
    {
      id: 1,
      buyer: {
        id: 101,
        email: "john.doe@example.com",
        first_name: "John",
        last_name: "Doe",
        phone: "+1234567890",
        avatar: "https://via.placeholder.com/50", // Replace with real URL for testing
        role: "Farmer",
        info: "Frequent buyer",
      },
      items: "Tomatoes, Carrots, Potatoes",
      total_price: "$35.00",
      created_at: "2024-11-28T15:30:00.000Z",
    },
    {
      id: 2,
      buyer: {
        id: 102,
        email: "jane.smith@example.com",
        first_name: "Jane",
        last_name: "Smith",
        phone: "+9876543210",
        avatar: "https://via.placeholder.com/50", // Replace with real URL for testing
        role: "Farmer",
        info: "New buyer",
      },
      items: "Lettuce, Spinach, Cucumbers",
      total_price: "$25.50",
      created_at: "2024-11-27T10:00:00.000Z",
    },
  ];

  const [orders] = useState(exampleOrders);

  const renderOrder = ({ item }) => (
    <View style={styles.orderContainer}>
      <View style={styles.buyerInfo}>
        <Image
          source={{ uri: item.buyer.avatar }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.buyerName}>
            {item.buyer.first_name} {item.buyer.last_name}
          </Text>
          <Text style={styles.buyerEmail}>{item.buyer.email}</Text>
          <Text style={styles.buyerPhone}>{item.buyer.phone}</Text>
        </View>
      </View>
      <Text style={styles.orderDetails}>Items: {item.items}</Text>
      <Text style={styles.orderDetails}>Total Price: {item.total_price}</Text>
      <Text style={styles.orderDate}>
        Ordered on: {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
        <FlatList
          data={orders}
          keyExtractor={(order) => order.id.toString()}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContainer}
        />
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  buyerInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  buyerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyerEmail: {
    fontSize: 14,
    color: '#6c757d',
  },
  buyerPhone: {
    fontSize: 14,
    color: '#6c757d',
  },
  orderDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 12,
    color: '#6c757d',
  },
});

export default OrdersPage;
