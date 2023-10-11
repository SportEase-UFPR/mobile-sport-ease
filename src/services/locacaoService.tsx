import axios from 'axios';

const BASE_URL = 'http://10.0.2.2:8081';

export const solicitarLocacao = async (dadosDaLocacao) => {
    try {
        console.log(dadosDaLocacao);
        const response = await axios.post(`${BASE_URL}/locacoes/solicitar-locacao`, dadosDaLocacao);
        return response.data;
    } catch (error) {

        throw error;
    }
};

export const listarHorariosDisponiveis = async (requestData) => {
    try {
        const response = await axios.post(`${BASE_URL}/locacoes/horarios-disponiveis`, requestData);
        console.log('Dados da resposta da requisição: ', response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};



