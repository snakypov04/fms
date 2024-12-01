import { apiClient } from "./config";


export const getOrdersBuyer = async () => {
    try {
        const response = await apiClient.get("/orders/");
        return response;
    } catch (e) {
        throw Error(`Error listing orders: ${e}`);
    }
}