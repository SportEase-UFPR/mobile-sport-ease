import React, { createContext } from "react";
import * as auth from "../services/auth";

interface AuthContextData {
    signed: boolean;
    user: object;
    signIn(): Promise<void>;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    async function signIn() {
        const response = await auth.SignIn()

        console.log(response)
    }

    return (
        <AuthContext.Provider value={{ signed: false, user: {}, signIn }}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContext;