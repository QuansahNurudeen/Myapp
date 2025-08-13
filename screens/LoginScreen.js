"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Sample credentials for testing
  const adminCredentials = {
    email: "admin@business.com",
    password: "admin123",
  }

  const employeeCredentials = [
    { email: "employee@hardware.com", password: "emp123", business: "Hardware" },
    { email: "employee@boutique.com", password: "emp123", business: "Boutique" },
    { email: "employee@coldstore.com", password: "emp123", business: "Cold Store" },
  ]

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password")
      return
    }

    // Check if admin credentials
    if (email === adminCredentials.email && password === adminCredentials.password) {
      // Navigate to Admin Dashboard
      navigation.navigate("AdminDashboard")
      return
    }

    // Check if employee credentials
    const employee = employeeCredentials.find((cred) => cred.email === email && cred.password === password)

    if (employee) {
      navigation.navigate("Employee", { selectedBusiness: employee.business })
      return
    }

    // Invalid credentials
    Alert.alert("Error", "Invalid email or password")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Business Manager App</Text>
      <Text style={styles.subheader}>Log in</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.forgot}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Demo credentials info */}
      <View style={styles.demoInfo}>
        <Text style={styles.demoTitle}>Demo Credentials:</Text>
        <Text style={styles.demoText}>Admin: admin@business.com / admin123</Text>
        <Text style={styles.demoText}>Employee: employee@hardware.com / emp123</Text>
        <Text style={styles.demoText}>Employee: employee@boutique.com / emp123</Text>
        <Text style={styles.demoText}>Employee: employee@coldstore.com / emp123</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  subheader: {
    fontSize: 18,
    marginVertical: 15,
    textAlign: "center",
    color: "#666",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  forgot: {
    color: "#007bff",
    marginTop: 12,
    textAlign: "center",
    fontSize: 14,
  },
  demoInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  demoTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#495057",
  },
  demoText: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 2,
  },
})
