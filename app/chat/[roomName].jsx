import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { getMessages } from "../../api/chat";
import { getData } from "../../utils/asyncStorage";

const Chat = () => {
    const { roomName } = useLocalSearchParams();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null); // Store user's email
    const ws = useRef(null);
    const flatListRef = useRef();

    useEffect(() => {
        fetchMessages();
        fetchUserId();
        connectWebSocket();
        return () => {
            if (ws.current) ws.current.close();
        };
    }, []);

    const fetchUserId = async () => {
        const userIdFromStorage = await getData("user_id");
        const userEmailFromStorage = await getData("user_email"); // Assuming email is stored
        setUserId(userIdFromStorage);
        setUserEmail(userEmailFromStorage);
    };

    const fetchMessages = async () => {
        try {
            const messagesData = await getMessages(roomName);
            setMessages(messagesData.messages);
        } catch (error) {
            console.error("Error fetching messages:", error.message);
        }
    };

    const connectWebSocket = async () => {
        const token = await getData("access");
        const url = `ws://localhost:8000/ws/chat/${roomName}/?token=${token}`;
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Message received from WebSocket:", data);
            if (data.sender !== userEmail) { // Prevent sending the message back to the sender
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        message: data.message,
                        sender: data.sender,
                        who: data.sender === userEmail ? "me" : "companion",
                    },
                ]);
            }
        };

        ws.current.onerror = (error) => console.log("WebSocket error: ", error);

        ws.current.onclose = () => console.log("WebSocket connection closed");
    };

    const handleSend = () => {
        if (input.trim()) {
            const messageData = {
                message: input,
                sender_id: userId,
                sender: userEmail, // Send email to identify the sender
            };

            if (ws.current) {
                ws.current.send(JSON.stringify(messageData));
            }

            // Don't add the message to the state here, let WebSocket handle it
            setInput(""); // Clear the input field
        }
    };

    const renderMessage = ({ item }) => (
        <View style={[styles.messageContainer, item.who === "me" ? styles.myMessage : styles.companionMessage]}>
            <Text style={styles.messageText}>{item.message}</Text>
        </View>
    );

    const scrollToBottom = () => {
        flatListRef.current.scrollToEnd({ animated: true });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.companionName}>Companion</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => index.toString()}
                style={styles.messageList}
            />

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
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    header: { padding: 10, backgroundColor: "#4caf50", alignItems: "center" },
    companionName: { fontSize: 18, fontWeight: "bold", color: "white" },
    messageList: { flex: 1, padding: 10 },
    messageContainer: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: "80%" },
    myMessage: { alignSelf: "flex-end", backgroundColor: "#4caf50" },
    companionMessage: { alignSelf: "flex-start", backgroundColor: "#e0e0e0" },
    messageText: { color: "#fff" },
    inputContainer: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#ffffff" },
    input: { flex: 1, height: 40, borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 20, paddingHorizontal: 10, backgroundColor: "#f9f9f9" },
    sendButton: { marginLeft: 10, backgroundColor: "#4caf50", padding: 10, borderRadius: 20 },
});

export default Chat;
