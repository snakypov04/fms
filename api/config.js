import axios from 'axios';

const apiUrl = "http://85.198.90.80:8000/api/v1";
const apiClient = axios.create({
	baseURL: apiUrl,
});

export default apiClient;
