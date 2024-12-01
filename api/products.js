import { apiClient } from "./config";

export const getProducts = async () => {
	try {
		const response = await apiClient.get("/products/");
		return response;
	} catch (e) {
		throw Error(`Error listing products: ${e}`);
	}
};

export const addProductToCart = async (data) => {
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

export const updateCartQuantities = async (updates) => {
  try {
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error("Invalid updates. Provide a non-empty array of updates.");
    }

    const response = await apiClient.patch("/basket-items/", {
      updates,
    });

    return response.data;
  } catch (e) {
    throw new Error(`Error updating cart quantities: ${e.message}`);
  }
};


export const apiPlaceOrder = async () => {
	try {
		const response = await apiClient.post("/orders/");
		return response;
	} catch (e) {
		throw Error(`Error placing order: ${e}`);
	}
}
