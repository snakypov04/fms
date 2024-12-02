import axios from "axios";

export const apiUrl = "http://85.198.90.80:8000/api/v1";
export const wsUrl = "ws://85.198.90.80:8000"
export const apiClient = axios.create({
	baseURL: apiUrl,
});
