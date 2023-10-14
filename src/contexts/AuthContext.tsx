import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null; userId: number | null; };
    onRegister?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt';


export const API_URL = 'http://10.0.2.2:8080';

const AuthContext = createContext<AuthProps>({});
const expToken = 'data-exp-token'

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
        id: number | null;
    }>({
        token: null,
        authenticated: false,
        id: null,
    });


    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log('token guardado:', token);

            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    console.log(decodedToken);
                    const expTimestamp = decodedToken.exp;
                    const id = decodedToken.idPessoa;
                    console.log(id)
                    const currentTime = Math.floor(Date.now() / 1000);

                    if (expTimestamp < currentTime) {
                        // O token está expirado
                        console.log('O token está expirado');
                        setAuthState({
                            token: null,
                            authenticated: null,
                            id: null
                        });
                    } else {
                        // O token ainda é válido
                        console.log('O token ainda é válido');
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        setAuthState({
                            token: token,
                            authenticated: true,
                            id: id
                        });
                    }
                } catch (error) {
                    console.error('Erro ao decodificar o token:', error);
                }
            }
        }
        loadToken();
    }, [])


    const register = async (email: string, password: string) => {
        try {
            return await axios.post(`${API_URL}/INTEGRAR-COM-BACK`, { email, password });
        } catch (e) {
            return { error: true, msg: (e as any).response.data.msg };
        }
    }

    const login = async (email: string, password: string) => {
        try {
            console.log('email:', email);
            console.log('senha', password);
            const result = await axios.post(`${API_URL}/login`, { login: email, senha: password });
            const decodedToken = jwtDecode(result.data.token); 
            const id = decodedToken.idPessoa;
            setAuthState({
                token: result.data.token,
                authenticated: true,
                id: id
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
            return result;
        } catch (e) {
            return { error: true, msg: (e as any).response.data.msg };
        }
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            axios.defaults.headers.common['Authorization'] = null;
            setAuthState({
                token: null,
                authenticated: false,
                id: null
            });
        } catch (e) {
            console.error("Erro durante o logout:", e);
        }
    };


    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


