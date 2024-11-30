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


