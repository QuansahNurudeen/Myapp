import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TraceScreen from "../screens/Trace";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignUpScreen";
import BusinessSelectorScreen from "../screens/BusinessSelectorScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import EmployeeScreen from "../screens/EmployeeScreen";
import InventoryScreen from "../screens/InventoryScreen";

const RootStack = createNativeStackNavigator();
const AdminStack = createNativeStackNavigator();

// AdminStack is a nested navigator that holds the admin-only screens.
// InventoryScreen is only reachable through this nested AdminStack.
function AdminStackScreen() {
  return (
    <AdminStack.Navigator initialRouteName="AdminDashboard" screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <AdminStack.Screen name="Inventory" component={InventoryScreen} />
    </AdminStack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Trace" screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Trace" component={TraceScreen} />
        <RootStack.Screen name="Signup" component={SignupScreen} />
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="BusinessSelector" component={BusinessSelectorScreen} />
        {/* expose the admin area as a single entry point; Inventory is nested inside AdminStack */}
        <RootStack.Screen name="Admin" component={AdminStackScreen} />
        <RootStack.Screen name="Employee" component={EmployeeScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}