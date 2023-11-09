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
        console.error('Erro na requisição getNotificacores:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export default {
    getInformacoesUsuario,
    getNotificacoes
};