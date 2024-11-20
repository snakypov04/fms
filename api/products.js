import apiClient from "./config";

const getProducts = async () => {
	try {
		const response = await apiClient.get("/products/");
		return response.data;
	} catch (e) {
		throw Error();
	}
};
