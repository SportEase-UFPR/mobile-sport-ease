import ApiClient from './ApiClient';

export const getComentarios = async (idEspaco) => {
    try {
        const response = await ApiClient.get(`/espacos-esportivos/comentarios/${idEspaco}`);
        return response.data;
    } catch (error) {
        console.error('Erro na requisição getComentarios:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export default {
    getComentarios,
};