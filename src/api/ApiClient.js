import axios from 'axios';

const ApiClient = axios.create({
    baseURL: 'https://api-gateway-production-75aa.up.railway.app'
});

export default ApiClient;