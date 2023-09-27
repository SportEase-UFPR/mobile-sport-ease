import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PageHomescreen from '../pages/pageHomescreen';

// importar telas que o usuário poderá acessar depois de login

const AppStack = createStackNavigator();

const AppRoutes: React.FC = () => (
    <AppStack.Navigator>
        <AppStack.Screen name="Homescreen" component={PageHomescreen}
            options={{
                headerShown: false
            }} />
    </AppStack.Navigator>
)

export default AppRoutes;