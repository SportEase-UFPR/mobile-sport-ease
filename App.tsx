import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

import AuthRoutes from './src/routes/auth.routes';
import AppRoutes from './src/routes/app.routes';

import { NativeBaseProvider, Text, Box } from "native-base";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NativeBaseProvider>
        <InnerApp />
      </NativeBaseProvider>
    </AuthProvider>
  );
}

function InnerApp() {
  const { authState, onLogout, onLogin } = useAuth();

  return (
    <NavigationContainer>
      {authState?.authenticated ? (
        <AppRoutes />
      ) : (
        <AuthRoutes />
      )}
    </NavigationContainer>
  );
}
