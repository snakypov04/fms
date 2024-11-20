import apiClient from "./config";

export const getFarms = async () => {
    try {
        const response = await apiClient.get("/farms/");
        return response.data;
    } catch (e) {
        throw Error();
    }
};

export const getFarm = async (farmId) => {
    try {
        const response = await apiClient.get(`/farms/${farmId}`);
        return response.data;
    } catch (e) {
        throw Error();
    }
}

