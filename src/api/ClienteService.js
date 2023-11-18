import ApiClient from './ApiClient';

export const getInformacoesUsuario = async () => {
    try {
        const response = await ApiClient.get('/clientes/cliente-logado');
        return response.data;
    } catch (error) {
        console.error('Erro na requisição getInformacoesUsuario:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getNotificacoes = async () => {
    try {
        const response = await ApiClient.get('/notificacoes');
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        } else {
            console.error('Erro na requisição getNotificacoes:', error.response ? error.response.data : error.message);
        }
    }
}

export const readNotifications = async () => {
    try {
        const response = await ApiClient.put('/notificacoes/marcar-como-lida');
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        } else {
            console.error('Erro na requisição readNotifications:', error.response ? error.response.data : error.message);
        }
    }
}

export const editarDadosCliente = async (requestData) => {
    try {
        const response = await ApiClient.put('/clientes', requestData);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        } else {
            console.error('Erro na requisição editarDadosCliente:', error.response ? error.response.data : error.message);
        }
    }
}

export default {
    getInformacoesUsuario,
    getNotificacoes,
    readNotifications,
    editarDadosCliente
};