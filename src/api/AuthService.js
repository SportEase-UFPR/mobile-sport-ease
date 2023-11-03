import ApiClient from './ApiClient';

const login = (email, password) => {
    return ApiClient.post('/login', { login: email, senha: password });
};

const cadastrar = (userData) => {
    return ApiClient.post('/clientes', userData);
};

export default {
    login,
    cadastrar
};