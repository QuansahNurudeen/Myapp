import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFirebase } from './FirebaseContext';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';

const businesses = ['Boutique', 'Cold Store', 'Hardware'];

export default function BusinessSelectorScreen() {
  const { auth, db } = useFirebase();
  const navigation = useNavigation();
  const [userRole, setUserRole] = useState(null);
  const [userBusiness, setUserBusiness] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (!user) {
        navigation.navigate('Login');
        return;
      }

      // Check if user is owner
      const ownerDoc = await getDoc(doc(db, 'owners', user.uid));
      if (ownerDoc.exists()) {
        setUserRole('owner');
        return;
      }

      // Check employee's business
      const employeeDoc = await getDoc(doc(db, 'employees', user.uid));
      if (employeeDoc.exists()) {
        setUserRole('employee');
        setUserBusiness(employeeDoc.data().businessType);
      }
    });

    return unsubscribe;
  }, []);

  const handleSelect = (business) => {
    if (userRole === 'employee' && business !== userBusiness) {
      Alert.alert("Access Denied", "You can only access your assigned business");
      return;
    }
    navigation.navigate('Dashboard', { business });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>
        {userRole === 'owner' 
          ? "Select a business to manage" 
          : `You are managing: ${userBusiness}`}
      </Text>

      {businesses.map((business) => (
        (userRole === 'owner' || business === userBusiness) && (
          <TouchableOpacity 
            key={business} 
            style={styles.button} 
            onPress={() => handleSelect(business)}
          >
            <Text style={styles.buttonText}>{business}</Text>
          </TouchableOpacity>
        )
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