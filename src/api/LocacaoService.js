import ApiClient from './ApiClient';
import axios from 'axios';

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
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 412) {
                return {
                    isSuccess: false,
                    message: error.response.data.message || "Erro desconhecido"
                };
            } else {
                return {
                    isSuccess: false,
                    message: error.response ? error.response.data.message : error.message
                };
            }
        } else {
            return {
                isSuccess: false,
                message: error.message || "Erro desconhecido"
            };
        }
    }
};

export const getSolicitacoesEmAndamento = async () => {
    try {
        const response = await ApiClient.get('/locacoes/listar-reservas-em-andamento');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const serverResponse = error.response;
            throw new Error(`Request failed with status code ${serverResponse?.status}: ${serverResponse?.data.message}`);
        } else {
            throw new Error(error.message);
        }
    }
};

export const getAllSolicitacoes = () => {
    return ApiClient.get('/locacoes/listar-historico-reservas')
        .then(response => {
            return response.data;
        })
        .catch(error => {

            throw error;
        });
};


export const confirmarUsoLocacao = async (idLocacao) => {
    try {
        const response = await ApiClient.put(`/locacoes/confirmar-uso/${idLocacao}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const cancelarUsoLocacao = async (idLocacao) => {
    try {
        const response = await ApiClient.put(`/locacoes/cancelar-reserva/${idLocacao}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const avaliarLocacao = async (idLocacao, requestData) => {
    try {
        const response = await ApiClient.post(`/locacoes/avaliar-reserva/${idLocacao}`, requestData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export default {
    getEspacosEsportivos,
    getEspacosEsportivosDisponiveis,
    getHorariosDisponiveis,
    createSolicitacaoLocacao,
    getSolicitacoesEmAndamento,
    getAllSolicitacoes,
    confirmarUsoLocacao,
    cancelarUsoLocacao,
    avaliarLocacao
};