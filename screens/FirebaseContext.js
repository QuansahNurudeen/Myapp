import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

const FirebaseContext = createContext();

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is admin/owner
        const ownersRef = collection(db, 'owners');
        const q = query(ownersRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setUser({ ...user, role: 'owner' });
        } else {
          // Check if employee
          const employeesRef = collection(db, 'employees');
          const q = query(employeesRef, where('email', '==', user.email));
          const empSnapshot = await getDocs(q);
          
          if (!empSnapshot.empty) {
            const empData = empSnapshot.docs[0].data();
            setUser({ ...user, role: 'employee', businessType: empData.businessType });
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password, name, role, businessType) => {
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
      
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  return (
    <FirebaseContext.Provider value={{ auth, db, user, loading, signUp, login, logout }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}