import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';

import Routes from './src/routes';
import AuthRoutes from './src/routes/auth.routes';
import AppRoutes from './src/routes/app.routes';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
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
