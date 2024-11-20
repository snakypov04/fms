import axios from "axios";
import { getData, storeData } from "../utils/asyncStorage";

const apiUrl = "http://85.198.90.80:8000/api/v1";

const apiClient = axios.create({
	baseURL: apiUrl,
});

export const login = async (email, password) => {
	try {
		const response = await apiClient.post("/token/", {
			email: email,
			password: password,
		});
		const { refresh, access } = response.data;

		await storeData("refresh", refresh);
		await storeData("access", access);

		return { refresh, access };
	} catch (error) {
		console.error("Error fetching tokens:", error.message);
		throw error;
	}
};

export const register = async (data) => {
	try {
        console.log(data)
		const response = await apiClient.post("/register/", {
			email: data.email,
			first_name: data.first_name,
			last_name: data.last_name,
			password: data.password,
            phone: data.phone,
			role: data.role,
		});

		if (response.status !== 201) {
			alert("Could not register. Check your input!");
		}

		console.log(response.data);
	} catch (e) {
		throw Error(`Error occured in buyer registration: ${e}`);
	}
};

const refreshAccessToken = async () => {
	try {
		const refresh = await getData("refresh");
		if (!refresh) throw new Error("Refresh token is missing");

		const response = await apiClient.post("/token/refresh/", {
			refresh: refresh,
		});
		const { access } = response.data;

		await storeData("access", access);
		return access;
	} catch (error) {
		console.error("Error refreshing access token:", error.message);
		throw error;
	}
};

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (
			error.response &&
			error.response.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;

			try {
				const newAccessToken = await refreshAccessToken();

				originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

				return apiClient(originalRequest);
			} catch (refreshError) {
				console.error("Failed to refresh token", refreshError.message);
				throw refreshError;
			}
		}

		return Promise.reject(error);
	}
);

apiClient.interceptors.request.use(async (config) => {
	const access = await getData("access");
	if (access) {
		config.headers["Authorization"] = `Bearer ${access}`;
	}
	return config;
});

export const getProfile = async () => {
	try {
		const response = await apiClient.get("/profile/");
		return response.data;
	} catch (error) {
		console.error("Error fetching profile:", error.message);
		throw error;
	}
};

export const updateProfile = async (userData) => {
	try {
		const formData = new FormData();

		console.log(userData);

		formData.append("first_name", userData.first_name);
		formData.append("last_name", userData.last_name);
		formData.append("email", userData.email);
		formData.append("phone", userData.phone);
		formData.append("delivery_address", userData.delivery_address);
		formData.append("payment_method", userData.payment_method);

		const response = await apiClient.put("/profile/", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data;
	} catch (error) {
		console.error("Error updating profile:", error);
		throw error;
	}
};

export default apiClient;
