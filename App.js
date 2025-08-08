import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { BusinessProvider } from './src/contexts/BusinessContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'react-native-paper';

const theme = {
  colors: {
    primary: '#4D73FF',
    accent: '#4CAF50',
  },
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BusinessProvider>
          <StatusBar backgroundColor="#4D73FF" barStyle="light-content" />
          <AppNavigator />
        </BusinessProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}