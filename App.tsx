import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Tela
import Routes from './src/routes';

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}