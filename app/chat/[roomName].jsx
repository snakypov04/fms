import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { getMessages } from "../../api/chat";  // Assuming this function fetches messages from API

const Chat = () => {
    const { roomName } = useLocalSearchParams(); // Get the room_name from navigation parameters
    console.log(roomName); // Log the room_name to the console

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [companionName, setCompanionName] = useState(""); // Companion's name from API
    const [companionEmail, setCompanionEmail] = useState(""); // Companion's email, if you want to display

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        const messagesData = await getMessages(roomName);
        if (messagesData && messagesData.companion) {
            setCompanionName(messagesData.companion.full_name); // Set companion name from API
            setCompanionEmail(messagesData.companion.email); // Optional: If you need the companion's email
            setMessages(messagesData.messages); // Set messages from API
        }
    };

    const handleSend = () => {
        if (input.trim()) {
            setMessages([
                ...messages,
                { sender_id: 4, message: input, timestamp: new Date().toISOString(), who: "me" }, // New message from "me"
            ]);
            setInput("");
        }
    };

    const renderMessage = ({ item }) => (
        <View
            style={[
                styles.messageContainer,
                item.who === "me" ? styles.myMessage : styles.companionMessage,
            ]}
        >
            <Text style={styles.messageText}>{item.message}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Companion's Name at the Top */}
            <View style={styles.header}>
                <Text style={styles.companionName}>{companionName}</Text>
            </View>

            {/* Chat Messages */}
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => index.toString()} // Use index as key for dynamic messages
                style={styles.messageList}
                inverted // Invert to show latest message at the bottom
            />

            {/* Input Area */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={input}
                    onChangeText={setInput}
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Ionicons name="send-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        padding: 10,
        backgroundColor: "#4caf50",
        alignItems: "center",
    },
    companionName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    messageList: {
        flex: 1,
        padding: 10,
    },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: "80%",
    },
    myMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#4caf50",
    },
    companionMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#e0e0e0",
    },
    messageText: {
        color: "#fff",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 20,
        paddingHorizontal: 10,
        backgroundColor: "#f9f9f9",
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: "#4caf50",
        padding: 10,
        borderRadius: 20,
    },
});

export default Chat;
