import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TraceScreen from '../screens/Trace';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignUpScreen';
import BusinessSelectorScreen from '../screens/BusinessSelectorScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import EmployeeScreen from '../screens/EmployeeScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Trace" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Trace" component={TraceScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="BusinessSelector" component={BusinessSelectorScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="Employee" component={EmployeeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}