import ApiClient from './ApiClient';

const getEspacosEsportivos = async () => {
    try {
        const response = await ApiClient.get('/espacos-esportivos');
        return response.data;
    } catch (error) {
        console.error('Erro na requisição getEspacosEsportivos:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const getEspacosEsportivosDisponiveis = async () => {
    try {
        const response = await ApiClient.get('/espacos-esportivos/disponiveis');
        return response.data;
    } catch (error) {
        console.error('Erro na requisição getEspacosEsportivosDisponiveis:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export default {
    getEspacosEsportivos,
    getEspacosEsportivosDisponiveis
};