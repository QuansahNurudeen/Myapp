import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "../screens/LoginScreen"
import SignupScreen from "../screens/SignUpScreen"
import BusinessSelectorScreen from "../screens/BusinessSelectorScreen"
import AdminDashboardScreen from "../screens/AdminDashboardScreen"
import EmployeeScreen from "../screens/EmployeeScreen"
import UserManagementScreen from "../screens/UserManagementScreen"
import ExpenseManagementScreen from "../screens/ExpenseManagementScreen"
import DatabaseManagementScreen from "../screens/DatabaseManagementScreen"
import SettingsScreen from "../screens/SettingsScreen"
import InventoryManagementScreen from "../screens/InventoryManagementScreen"

const Stack = createStackNavigator()

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="BusinessSelector" component={BusinessSelectorScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: "Admin Dashboard" }} />
        <Stack.Screen name="Employee" component={EmployeeScreen} options={{ title: "Employee Dashboard" }} />
        <Stack.Screen name="UserManagement" component={UserManagementScreen} options={{ title: "User Management" }} />
        <Stack.Screen
          name="ExpenseManagement"
          component={ExpenseManagementScreen}
          options={{ title: "Expense Management" }}
        />
        <Stack.Screen
          name="DatabaseManagement"
          component={DatabaseManagementScreen}
          options={{ title: "Database Management" }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
        <Stack.Screen
          name="InventoryManagement"
          component={InventoryManagementScreen}
          options={{ title: "Inventory Management" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
