import { apiClient } from "./config";


export const getOrdersBuyer = async () => {
    try {
        const response = await apiClient.get("/orders/");
        return response;
    } catch (e) {
        throw Error(`Error listing orders: ${e}`);
    }
}

export const getOrdersFarmer = async () => {
    try {
        const response = await apiClient.get("/farmer-orders/");
        return response;
    } catch (e) {
        throw Error(`Error listing orders: ${e}`);
    }
}

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await apiClient.patch(`/farmer-orders/${orderId}/`, {
            status,
        });
        return response;
    } catch (e) {
        throw Error(`Error updating order status: ${e}`);
    }
}