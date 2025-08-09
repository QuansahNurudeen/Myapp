import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FirebaseProvider, useFirebase } from './screens/FirebaseContext';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

// Import all screens
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import BusinessSelectorScreen from './screens/BusinessSelectorScreen';
import AdminDashboard from './screens/AdminDashboard';
import EmployeeScreen from './screens/EmployeeScreen';
import InventoryScreen from './screens/InventoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import DatabaseScreen from './screens/DatabaseScreen';
import UserAccessScreen from './screens/UserAccessScreen';
import ExpensesScreen from './screens/ExpensesScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Admin Navigation Stack
function AdminStack() {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Dashboard" component={AdminDashboard} />
      <Drawer.Screen name="Inventory" component={InventoryScreen} />
      <Drawer.Screen name="Expenses" component={ExpensesScreen} />
      <Drawer.Screen name="User Access" component={UserAccessScreen} />
      <Drawer.Screen name="Database" component={DatabaseScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

// Employee Navigation Stack
function EmployeeStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Sales Entry" component={EmployeeScreen} />
      <Tab.Screen name="Sales History" component={SalesHistoryScreen} />
      <Tab.Screen name="Business Info" component={BusinessInfoScreen} />
    </Tab.Navigator>
  );
}

function MainNavigation() {
  const { user } = useFirebase();
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="SignUp" 
              component={SignUpScreen} 
              options={{ headerShown: false }} 
            />
          </>
        ) : user.role === 'owner' ? (
          <>
            <Stack.Screen 
              name="BusinessSelector" 
              component={BusinessSelectorScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Admin" 
              component={AdminStack} 
              options={{ headerShown: false }} 
            />
          </>
        ) : (
          <Stack.Screen 
            name="Employee" 
            component={EmployeeStack} 
            options={{ headerShown: false }} 
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <MainNavigation />
    </FirebaseProvider>
  );
}