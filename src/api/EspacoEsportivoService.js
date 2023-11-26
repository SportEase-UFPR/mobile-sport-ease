import ApiClient from './ApiClient';

export const getComentarios = async (idEspaco) => {
    try {
        const response = await ApiClient.get(`/espacos-esportivos/comentarios/${idEspaco}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    getComentarios,
};