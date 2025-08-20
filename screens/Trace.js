import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Trace({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trace</Text>
      <Text style={styles.subtitle}>
        Enter personal details to your employee account
      </Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.signIn]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signUp]}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={[styles.buttonText, { color: '#4D73FF' }]}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf0ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#4D73FF',
    marginBottom: 60,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
    backgroundColor: '#fff',
    elevation: 2,
  },
  signIn: {
    backgroundColor: '#4D73FF',
  },
  signUp: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4D73FF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});