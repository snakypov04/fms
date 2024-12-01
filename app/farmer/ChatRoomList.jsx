import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Button, TextInput, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";  // Import Ionicons
import { getChatRooms } from "../../api/chat";  // Assuming this function fetches chat rooms

const ChatRoomsList = () => {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // For search query
    const users = [
        { id: 1, name: "John Doe", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
        { id: 2, name: "Jane Doe", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
        { id: 3, name: "Alice", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
        { id: 4, name: "Bob", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    ];
    const [filteredUsers, setFilteredUsers] = useState(users); // Filtered users based on search
    const [rooms, setRoomsD] = useState([]);

    // Function to fetch chat rooms
    const fetchRooms = async () => {
        const data = await getChatRooms();
        setRoomsD(data);
        console.log("fetching rooms...");

    };

    useEffect(() => {
        // Initial fetch on component mount
        fetchRooms();

        // Set up polling every 10 seconds (10000 ms)
        // const intervalId = setInterval(fetchRooms, 30000);

        // Clear interval on component unmount
        // return () => clearInterval(intervalId);
    }, []);  // Empty dependency array to run on mount and unmount

    const handleRoomPress = (roomName) => {
        router.push(`chat/${roomName}`);
    };

    const handleNewChatPress = (userId) => {
        const roomName = `1-${userId}`; // For simplicity, using user ID to create room name
        router.push(`chat/${roomName}`);
        setModalVisible(false); // Close the modal after selecting the user
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = users.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const renderRoomItem = ({ item }) => {
        const { room_name, companion, last_message } = item;

        // Format the timestamp to a readable time
        const formattedTimestamp = new Date(last_message.timestamp).toLocaleTimeString();

        return (
            <TouchableOpacity
                style={styles.roomItem}
                onPress={() => handleRoomPress(room_name)} // use room_name for navigation
                key={room_name} // Add the unique key prop
            >
                <View style={styles.roomHeader}>
                    {/* Displaying the avatar */}
                    <Image source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }} style={styles.roomAvatar} />
                    <Text style={styles.roomText}>
                        {companion.full_name || "John Doe"}
                    </Text>
                </View>
                <Text style={styles.lastMessage}>{last_message.message}</Text>
                <Text style={styles.timestamp}>{formattedTimestamp}</Text>
            </TouchableOpacity>
        );
    };

    const renderUserItem = ({ item }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => handleNewChatPress(item.id)}
            key={item.id} // Use user.id for the unique key
        >
            <Text style={styles.userText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.myChatsHeader}>My Chats</Text>
            </View>

            {/* List of existing chat rooms */}
            <FlatList
                data={rooms}
                renderItem={renderRoomItem}
                keyExtractor={(item) => item.room_name} // Use room_name for unique key
                style={styles.roomList}
            />

            {/* Modal to show all users */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select a User</Text>

                        {/* Search Input */}
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search users..."
                            value={searchQuery}
                            onChangeText={handleSearch} // Trigger search on text change
                        />

                        {/* List of filtered users */}
                        <FlatList
                            data={filteredUsers}
                            renderItem={renderUserItem}
                            keyExtractor={(item) => item.id.toString()}
                            style={styles.userList}
                        />

                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>

            {/* New Chat Button with Icon (Positioned at Bottom-Right) */}
            <TouchableOpacity
                style={styles.newChatButton}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="search" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 10,
    },
    roomList: {
        flex: 1,
    },
    roomItem: {
        backgroundColor: "#ffffff",
        marginBottom: 10,
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    roomHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    roomAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    roomText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    lastMessage: {
        fontSize: 14,
        color: "#777",
    },
    timestamp: {
        fontSize: 12,
        color: "#999",
        marginTop: 5,
    },
    myChatsHeader: {
        fontSize: 24, // Increased size for better visibility
        backgroundColor: "#4caf50",
        fontWeight: "bold",
        color: "#fff",
        paddingTop: 10, // Added padding for spacing
        paddingBottom: 15, // Added padding to separate from list
        textAlign: "center",
    },
    newChatButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#4caf50",
        padding: 15,
        borderRadius: 50,
        elevation: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        width: "80%",
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    searchInput: {
        width: "100%",
        height: 40,
        borderRadius: 25,
        paddingHorizontal: 15,
        backgroundColor: "#e0e0e0",
        marginBottom: 20,
        fontSize: 16,
        color: "#333",
    },
    userList: {
        width: "100%",
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#ffffff",
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userText: {
        fontSize: 16,
        color: "#333",
    },
});

export default ChatRoomsList;
