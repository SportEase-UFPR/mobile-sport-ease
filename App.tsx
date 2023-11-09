import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import registerNNPushToken from 'native-notify';


import AuthRoutes from './src/routes/auth.routes';
import AppRoutes from './src/routes/app.routes';

import { NativeBaseProvider, Text, Box } from "native-base";
import { NotificationProvider } from './src/contexts/NotificationContext';

const Stack = createStackNavigator();

export default function App() {
  registerNNPushToken(14520, 'vdk0Ur8ZprhkWw4MiubMKt');
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
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      ) : (
        <AuthRoutes />
      )}
    </NavigationContainer>
  );
}
