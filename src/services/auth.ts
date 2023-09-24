// Serviço de autenticação de conta
import axios from 'axios';

export function SignIn(login, senha) {
    const endpointLogin = "http://10.0.2.2:8080/login";

    const data = {
        login: login,
        senha: senha,
    };

    return axios.post(endpointLogin, data)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw error;
        });
}


export function KeywordReset() {
    // setando chamada fake com promise. INTEGRAR COM O BACK
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                result: 200
            })
        }, 2000)
    }
    )
}