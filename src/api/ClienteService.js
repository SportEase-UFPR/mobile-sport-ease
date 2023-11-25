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
            throw error;
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
            throw error;
        }
    }
}

export const editarDadosCliente = async (requestData) => {
    try {
        const response = await ApiClient.put('/clientes', requestData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const recuperarSenha = async (requestData) => {
    try {
        const response = await ApiClient.post('/usuarios/email-recuperacao-senha', requestData);
        console.log('dados da requisição:', response.data, response.status);
        return response.status;
    } catch (error) {
        //console.error('Erro na requisição recuperarSenha:', error.response ? error.response.data : error.message);
        if (error.response.data.status==400) {
            throw "Por gentileza, revise o e-mail enviado";
        } else {
            throw "Por gentileza, tente novamente mais tarde";
        }
    }
}

export default {
    getInformacoesUsuario,
    getNotificacoes,
    readNotifications,
    editarDadosCliente,
    recuperarSenha,
};