import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFirebase } from '../FirebaseContext';

export default function BusinessSelectorScreen({ navigation }) {
  const { user } = useFirebase();
  
  const businesses = [
    { id: '1', name: 'Boutique', color: '#FF6B6B' },
    { id: '2', name: 'Hardware', color: '#4ECDC4' },
    { id: '3', name: 'Cold Store', color: '#45B7D1' },
  ];

  const handleBusinessSelect = (business) => {
    // In a real app, you might save the selected business to context/state
    navigation.navigate('Admin');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Business</Text>
      <Text style={styles.subheader}>Welcome, {user?.email}</Text>
      
      <View style={styles.businessContainer}>
        {businesses.map((business) => (
          <TouchableOpacity
            key={business.id}
            style={[styles.businessCard, { backgroundColor: business.color }]}
            onPress={() => handleBusinessSelect(business)}
          >
            <Text style={styles.businessName}>{business.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {user?.role === 'owner' && (
        <TouchableOpacity 
          style={styles.adminButton}
          onPress={() => navigation.navigate('Admin')}
        >
          <Text style={styles.adminButtonText}>Admin Dashboard</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  businessContainer: {
    width: '100%',
    marginBottom: 20,
  },
  businessCard: {
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  adminButton: {
    width: '100%',
    backgroundColor: '#4D73FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});