import { apiClient } from "./config";

export const getChatRooms = async () => {
    try {
        const response = await apiClient.get("/chat/rooms/");
        return response.data;
    } catch (error) {
        console.error("Error fetching chat rooms:", error.message);
        throw error;
    }
}

export const getMessages = async (roomName) => {
    try {
        const response = await apiClient.get(`/chat/history/${roomName}/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching messages:", error.message);
        throw error;
    }
}


