import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const businesses = ['Boutique', 'Cold Store', 'Hardware'];

export default function BusinessSelectorScreen({navigation}) {
  const handleSelect = (type) => {
    alert('You selected: ${type}');
    // Future: Navigate to dashboard for selected business
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome !</Text>
      <Text style={styles.subtitle}>Which business do you want to manage?</Text>

      {businesses.map((type) => (
        <TouchableOpacity key={type} style={styles.button} onPress={() => handleSelect(type)}>
          <Text style={styles.buttonText}>{type}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111',
  },
  subtitle: {
    fontSize: 16,
    color: '#4D73FF',
    marginBottom: 40,
  },
  button: {
    width: '100%',
    backgroundColor: '#EFEFEF',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 1,
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
});