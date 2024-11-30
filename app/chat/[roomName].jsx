import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";


const Chat = () => {
    const { farm_id } = useLocalSearchParams(); // Get the farm_id from navigation parameters

    const [messages, setMessages] = useState([
        { id: "1", sender: "me", text: "Hi there!" },
        { id: "2", sender: "companion", text: "Hello!" },
        { id: "3", sender: "me", text: "How are you?" },
    ]);
    const [input, setInput] = useState("");
    const [companionName, setCompanionName] = useState("John Doe"); // This could come from the room

    const handleSend = () => {
        if (input.trim()) {
            setMessages([
                ...messages,
                { id: (messages.length + 1).toString(), sender: "me", text: input },
            ]);
            setInput("");
        }
    };

    const renderMessage = ({ item }) => (
        <View
            style={[
                styles.messageContainer,
                item.sender === "me" ? styles.myMessage : styles.companionMessage,
            ]}
        >
            <Text style={styles.messageText}>{item.text}</Text>
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
                keyExtractor={(item) => item.id}
                style={styles.messageList}
                inverted
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
