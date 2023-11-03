// implementar requisições de solicitação de dados de requisição
import ApiClient from './ApiClient';

const getInformacoesUsuario = async () => {
    try {
        const response = await ApiClient.get('/clientes/cliente-logado');
        return response.data;
    } catch (error) {
        console.error('Erro na requisição getInformacoesUsuario:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export default {
    getInformacoesUsuario,
};