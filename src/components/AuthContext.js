// AuthContext.js
import React, { useContext, useState, useEffect, createContext } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
 
// Crea el context d'autenticació
const AuthContext = createContext();
 
// Exporta un hook personalitzat per accedir al context d'autenticació més fàcilment
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
   
    // useEffect per escoltar els canvis d'autenticació quan es munta el component
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
   
      // Cancel·la la subscripció quan el component es desmunta
      return unsubscribe;
    }, []);
   
    // Funció per registrar un usuari
    const signup = (email, password) => {
      return createUserWithEmailAndPassword(auth, email, password);
    };
   
    // Funció per iniciar sessió
    const login = (email, password) => {
      return signInWithEmailAndPassword(auth, email, password);
    };
   
    // Funció per tancar sessió
    const logout = () => {
      return signOut(auth);
    };
   
    // Passa l'estat i funcions d'autenticació pel context
    const value = { currentUser, signup, login, logout };
   
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
  