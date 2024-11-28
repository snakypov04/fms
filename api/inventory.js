import { apiClient } from "./config";

export const addProductToInventory = async (data) => {
	try {
		const response = await apiClient.post("/products/", {
			name: data.name,
			description: data.description,
			price: data.price,
			stock_quantity: data.stock_quantity,
			category: data.category,
			farm: data.farm_id,
		});

		if (response.status === 403) {
			throw Error(`You are not owner`);
		}
	} catch (e) {
		throw Error(`Error adding product to inventory: ${e}`);
	}
};

export const getProductsFromInventory = async (farm_id) => {
	try {
		const response = await apiClient.get(`/farms/${farm_id}/products`);

		if (response.status === 403) {
			throw Error(`You not owner`);
		}

		return response.data;
	} catch (e) {
		throw Error(`Error getting products: ${e}`);
	}
};

export const getCategories = async () => {
	try {
		const response = await apiClient.get("/categories/");

		return response.data;
	} catch (e) {
		throw Error(`Error getting categories: ${e}`);
	}
};
