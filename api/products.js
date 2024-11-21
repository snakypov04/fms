import { apiClient } from "./config";

export const getProducts = async () => {
	try {
		const response = await apiClient.get("/products/");
		return response;
	} catch (e) {
		throw Error(`Error listing products: ${e}`);
	}
};

export const addProduct = async (data) => {
	try {
		const response = await apiClient.post("/basket-items/", {
			product: data.product_id,
			quantity: data.quantity,
		});

		return response;
	} catch (e) {
		throw Error(`Error adding product to cart: ${e}`);
	}
};

export const getBasket = async () => {
	try {
		const response = await apiClient.get("/basket/");
		console.log("cart", response.data);
		return response;
	} catch (e) {
		throw Error(`Error getting basket: ${e}`);
	}
};
