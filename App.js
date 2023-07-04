import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importando telas
import LoginComponent from './src/components/LoginComponent';

// Variáveis
const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Login" 
          component={LoginComponent} 
          options={{
            headerShown: false
          }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}