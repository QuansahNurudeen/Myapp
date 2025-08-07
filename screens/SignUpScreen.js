import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFirebase } from './FirebaseContext';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { auth, db } = useFirebase();

  const handleSignUp = async () => {
    // Email pattern validation
    const emailPatterns = {
      'Boutique': /@bq\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
      'Hardware': /@hd\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
      'Cold Store': /@cd\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
      'Admin': /@ad\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
    };

    let role = 'employee';
    let businessType = null;

    if (email.match(emailPatterns.Admin)) {
      role = 'owner';
    } else {
      for (const [type, pattern] of Object.entries(emailPatterns)) {
        if (email.match(pattern) && type !== 'Admin') {
          businessType = type;
          break;
        }
      }
    }

    if (!businessType && role !== 'owner') {
      Alert.alert("Error", "Invalid email pattern. Use:\n@bq.domain for Boutique\n@hd.domain for Hardware\n@cd.domain for Cold Store\n@ad.domain for Admin");
      return;
    }

    if (password.length !== 8) {
      Alert.alert("Error", "Password must be exactly 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (role === 'owner') {
        await setDoc(doc(db, 'owners', userCredential.user.uid), {
          name,
          email,
          role: 'owner',
          createdAt: new Date()
        });
      } else {
        await setDoc(doc(db, 'employees', userCredential.user.uid), {
          name,
          email,
          role: 'employee',
          businessType,
          createdAt: new Date()
        });
      }

      Alert.alert("Success", "Account created successfully");
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Business Manager App</Text>
      <Text style={styles.subheader}>Sign Up</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Full Name" 
        value={name}
        onChangeText={setName}
      />

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
        maxLength={8}
      />

      <TextInput 
        style={styles.input} 
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        maxLength={8}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 18,
    marginVertical: 15,
    textAlign: 'center',
    color: '#555',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4D73FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#4D73FF',
    textAlign: 'center',
    marginTop: 15,
  },
});