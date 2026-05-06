import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DesktopAuthShell } from '../components/DesktopAuthShell';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { MaestroLoginScreen } from '../screens/auth/MaestroLoginScreen';
import { RecoverPasswordScreen } from '../screens/auth/RecoverPasswordScreen';
import { ClienteEntryScreen } from '../screens/auth/ClienteEntryScreen';
import { CatalogScreen } from '../screens/catalog/CatalogScreen';
import { MaestroDetailScreen } from '../screens/catalog/MaestroDetailScreen';
import { PublishFormScreen } from '../screens/publish/PublishFormScreen';
import { ClienteRecoverScreen } from '../screens/auth/ClienteRecoverScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  // Maestro auth
  MaestroLogin: { mode: 'register' | 'login' };
  RecoverPassword: undefined;
  // Cliente flow (sin auth)
  ClienteEntry: undefined;
  ClienteCatalog: undefined;
  ClientePublish: undefined;
  ClienteRecover: undefined;
  ClienteMaestroDetail: { id: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <DesktopAuthShell>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />

        {/* Maestro auth */}
        <Stack.Screen name="MaestroLogin" component={MaestroLoginScreen} />
        <Stack.Screen name="RecoverPassword" component={RecoverPasswordScreen} />

        {/* Cliente sin cuenta */}
        <Stack.Screen name="ClienteEntry" component={ClienteEntryScreen} />
        <Stack.Screen name="ClienteCatalog" component={CatalogScreen} />
        <Stack.Screen name="ClientePublish" component={PublishFormScreen} />
        <Stack.Screen name="ClienteRecover" component={ClienteRecoverScreen} />
        <Stack.Screen name="ClienteMaestroDetail" component={MaestroDetailScreen} />
      </Stack.Navigator>
    </DesktopAuthShell>
  );
}
