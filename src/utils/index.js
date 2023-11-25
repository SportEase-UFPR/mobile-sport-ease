import { validate as validateCPFOriginal } from 'gerador-validador-cpf';

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
};

export const validateCPF = (cpf) => {
    if (!cpf.trim()) return false;
    return validateCPFOriginal(cpf);
};

export const validateSenha = (senha) => {
    if (senha.length < 6) {
        return false
    }
    return true
};

export const addGrrPrefix = (numero) => {
    if(numero) {
        let prefix = 'GRR';
        const grrCompleto = prefix + numero;
        console.log(grrCompleto);
        return grrCompleto;
    }
    return '';
};

export default {
    validateEmail,
    validateCPF,
    validateSenha,
    addGrrPrefix
};
