import axios from 'axios';

const BASE_URL = 'http://10.0.2.2:8080';

export const listarEspacosEsportivos = async (dadosEspaco) => {
    try {
        const response = await axios.get(`${BASE_URL}/espacos-esportivos/disponiveis`, dadosEspaco);
        return response.data;
    } catch (error) {

        throw error;
    }
};
