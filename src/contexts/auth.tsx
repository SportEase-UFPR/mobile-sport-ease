import React, { createContext, useState } from "react";
import * as auth from "../services/auth";

interface AuthContextData {
    token: string;
    signed: boolean;
    email: string;
    signIn(login: string, senha: string): Promise<void>;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [signed, setSigned] = useState(false);
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');

    async function signIn(login, senha) {
        try {
            const response = await auth.SignIn(login, senha);
            setSigned(true);
            setEmail(login);
            setToken(response['token']);
        } catch (error) {
            console.log('Erro ao fazer login:', error);
            setSigned(false);
        }
    }

    return (
        <AuthContext.Provider value={{ token, signed, email, signIn }}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContext;
