import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user is admin or employee
        const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
        const employeeDoc = await getDoc(doc(db, 'employees', firebaseUser.uid));
        
        if (adminDoc.exists()) {
          setUser({ ...firebaseUser, role: 'admin' });
        } else if (employeeDoc.exists()) {
          setUser({ 
            ...firebaseUser, 
            role: 'employee',
            businessType: employeeDoc.data().businessType 
          });
        } else {
          // User doesn't have proper role assignment
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      let role = 'employee';
      let businessType = null;
      
      if (email.includes('@ad.')) {
        role = 'admin';
        await setDoc(doc(db, 'admins', userCredential.user.uid), {
          name,
          email,
          role,
          createdAt: new Date()
        });
      } else {
        if (email.includes('@bq.')) businessType = 'Boutique';
        else if (email.includes('@hd.')) businessType = 'Hardware';
        else if (email.includes('@cd.')) businessType = 'Cold Store';
        
        await setDoc(doc(db, 'employees', userCredential.user.uid), {
          name,
          email,
          role,
          businessType,
          createdAt: new Date()
        });
      }
      
      return { uid: userCredential.user.uid, email, role, businessType };
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signUp, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};