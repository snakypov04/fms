import axios from "axios";

export const apiUrl = "http://localhost:8000/api/v1";
export const apiClient = axios.create({
	baseURL: apiUrl,
});
