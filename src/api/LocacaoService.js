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

export const getHorariosDisponiveis = async (requestData) => {
    try {
        const response = await ApiClient.post('/locacoes/horarios-disponiveis', requestData);
        console.log('Dados da resposta da requisição: ', response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getInformacoesEspacoEsportivo = async (requestData) => {
    try {
        const response = await ApiClient.get(`/espacos-esportivos/${requestData}`);
        console.log('Dados da resposta da requisição: ', response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    getEspacosEsportivos,
    getEspacosEsportivosDisponiveis,
    getHorariosDisponiveis
};