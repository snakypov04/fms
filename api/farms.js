import { apiClient } from "./config";

export const getFarms = async () => {
	try {
		const response = await apiClient.get("/farms/my-farms");
		console.log(response.data);
		return response.data;
	} catch (e) {
		throw Error(`Error getting farms: ${e}`);
	}
};

export const getFarm = async (farmId) => {
	try {
		const response = await apiClient.get(`/farms/${farmId}`);
		return response.data;
	} catch (e) {
		throw Error(`Error getting farm: ${e}`);
	}
};

export const createFarm = async (data) => {
	try {
		const response = await apiClient.post("/farms/", {
			name: data.name,
			address: data.address,
			geo_loc: data.geo_loc,
			size: data.size,
			crop_types: data.crop_types,
		});

		if (response.status === 403) {
			throw Error(`could not create error: ${response.data}`);
		}
	} catch (e) {
		throw Error(`Error creating farm: ${e}`);
	}
};
