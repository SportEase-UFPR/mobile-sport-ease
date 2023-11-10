import axios from 'axios';

const ApiClient = axios.create({
    baseURL: 'https://api-gateway-production-40a1.up.railway.app'
});

export default ApiClient;