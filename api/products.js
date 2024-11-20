import apiClient from "./config";

export const getProducts = async () => {
	try {
		const response = await apiClient.get("/products/");
		return response;
	} catch (e) {
		throw Error();
	}
};
