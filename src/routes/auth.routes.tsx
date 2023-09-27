import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// importar telas que o usuário poderá acessar antes de realizar login
import PageLogin from '../pages/AuthRoutes/PageLogin';
import PageKeywordReset from '../pages/AuthRoutes/PageKeywordReset';
import PageKeywordResetConfirmation from '../pages/AuthRoutes/PageKeywordResetConfirmation';
import PageAutocadastro from '../pages/AuthRoutes/PageAutocadastro';

const AuthStack = createStackNavigator();

const AuthRoutes: React.FC = () => (
    <AuthStack.Navigator>
        <AuthStack.Screen name="Login" component={PageLogin}
            options={{
                headerShown: false
            }} />
        <AuthStack.Screen name="Autocadastro" component={PageAutocadastro}
            options={{
                headerShown: false
            }} />
        <AuthStack.Screen name="Recuperar Senha" component={PageKeywordReset}
            options={{
                headerShown: false
            }} />
        <AuthStack.Screen name="Nova Senha" component={PageKeywordResetConfirmation}
            options={{
                headerShown: false
            }} />
    </AuthStack.Navigator>
)

export default AuthRoutes;