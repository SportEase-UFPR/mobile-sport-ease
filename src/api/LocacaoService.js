import ApiClient from './ApiClient';

export const getEspacosEsportivos = async () => {
    try {
        const response = await ApiClient.get('/espacos-esportivos');
        return response.data;
    } catch (error) {
        console.error('Erro na requisição getEspacosEsportivos:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getEspacosEsportivosDisponiveis = async () => {
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
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getInformacoesEspacoEsportivo = async (requestData) => {
    try {
        const response = await ApiClient.get(`/espacos-esportivos/${requestData}`);
        console.log('Dados da resposta da requisição: ', response.data.maxLocacaoDia);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createSolicitacaoLocacao = async (requestData) => {
    try {
        const response = await ApiClient.post('/locacoes/solicitar-locacao', requestData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSolicitacoesEmAndamento = async () => {
    try {
        const response = await ApiClient.get('/locacoes/listar-reservas-em-andamento');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllSolicitacoes = async () => {
    try {
        const response = await ApiClient.get('/locacoes/listar-historico-reservas');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    getEspacosEsportivos,
    getEspacosEsportivosDisponiveis,
    getHorariosDisponiveis,
    createSolicitacaoLocacao,
    getSolicitacoesEmAndamento,
    getAllSolicitacoes
};