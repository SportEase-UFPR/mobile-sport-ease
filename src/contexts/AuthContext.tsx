import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';
import AuthService from '../api/AuthService';
import ApiClient from '../api/ApiClient';
import { registerIndieID, unregisterIndieDevice } from 'native-notify';

interface UserData {
    nome: string;
    email: string;
    cpf: string;
    alunoUFPR: boolean;
    grr?: string;
    senha: string;
}

interface DecodedToken {
    exp: number;
    idPessoa: number;
    iss: string;
    sub: string;
    userProfile: string;
}

interface AuthProps {
    authState: {
        token: string | null;
        authenticated: boolean | null;
        id: number | null;
        // Inclua outras propriedades aqui se necessário
    };
    onCadastrar?: (userData: UserData) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt';

const AuthContext = createContext<AuthProps>({
    authState: {
        token: null,
        authenticated: null,
        id: null,
    }
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
        id: number | null;
    }>({
        token: null,
        authenticated: null,
        id: null,
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log('token guardado:', token);

            if (token) {
                try {
                    const decodedToken = jwtDecode<DecodedToken>(token);
                    console.log(decodedToken);
                    const expTimestamp = decodedToken.exp;
                    const id = decodedToken.idPessoa;
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
                        console.log('O token ainda é válido',);
                        ApiClient.defaults.headers.common['Authorization'] = `${token}`;
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


    const cadastrar = async (userData: UserData) => {
        try {
            const response = await AuthService.cadastrar(userData);
            return response;
        } catch (e) {
            return { error: true, msg: (e as any).response.data.message };
        }
    }


    const login = async (email: string, password: string) => {
        try {
            const result = await AuthService.login(email, password);
            const decodedToken = jwtDecode<DecodedToken>(result.data.token);
            const id = decodedToken.idPessoa;
            setAuthState({
                token: result.data.token,
                authenticated: true,
                id: id
            });
            ApiClient.defaults.headers.common['Authorization'] = `${result.data.token}`;
            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
            // Native Notify Indie Push Registration Code
            registerIndieID(`${id}`, 14520, 'vdk0Ur8ZprhkWw4MiubMKt');
            // End of Native Notify Code
            return result;
        } catch (e) {
            return { error: true, msg: (e as any).response.data.msg };
        }
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            // Native Notify Indie Push Registration Code
            unregisterIndieDevice(`${authState.id}`, 14520, 'vdk0Ur8ZprhkWw4MiubMKt');
            // End of Native Notify Code
            ApiClient.defaults.headers.common['Authorization'] = null;
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
        onCadastrar: cadastrar,
        onLogin: login,
        onLogout: logout,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}