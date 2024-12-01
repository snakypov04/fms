import { getData, storeData } from "../utils/asyncStorage";
import { apiClient } from "./config";

export const login = async (email, password) => {
	try {
		const response = await apiClient.post("/token/", {
			email: email,
			password: password,
		});
		const { refresh, access } = response.data;

		await storeData("refresh", refresh);
		await storeData("access", access);
		await storeData("user_email", email);

		return { refresh, access };
	} catch (error) {
		console.error("Error fetching tokens:", error.message);
		throw error;
	}
};

export const register = async (data) => {
	try {
		console.log(data);
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
		throw Error(`Error occured in registration: ${e}`);
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

export const updateBuyerProfile = async (userData) => {
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

export const updateFarmerProfile = async (userData) => {
	try {
		// Prepare the data as JSON
		const updatedData = {
			first_name: userData.first_name,
			last_name: userData.last_name,
			email: userData.email,
			phone: userData.phone,
			delivery_address: "dome",
			payment_method: "Card",
			info: {
				rating: userData.info.rating,
				experience: userData.info.experience,
				bio: userData.info.bio,
			},
			socials: userData.socials,
		};

		// Handle avatar upload if it's present

		// Send the updated data as JSON in the PUT request
		const response = await apiClient.put("/profile/", updatedData, {
			headers: {
				"Content-Type": "application/json", // Set content type to JSON
			},
		});

		return response.data;
	} catch (error) {
		console.error("Error updating profile:", error);
		throw error;
	}
};

export const addSocials = async ({ platform, url }) => {
	try {
		const response = await apiClient.post("/socials/", {
			platform,
			url,
		});

		if (response.status !== 201) {
			throw Error("Some error occurred when adding socials: " + response.data);
		}
	} catch (e) {
		throw Error(`Error when adding socials: ${e}`);
	}
};

export default apiClient;
