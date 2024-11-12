// AuthContext.js
import React, { useContext, useState, useEffect, createContext } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from "firebase/firestore";



// Crea el context de autenticación
const AuthContext = createContext();

// Exporta un hook personalizado para acceder al contexto de autenticación más fácilmente
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // useEffect para escuchar los cambios de autenticación cuando se monta el componente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  
    return unsubscribe;
  }, []);
  

  // Función para registrar un usuario
  const signup = (email, password, username) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Obtener el usuario recién creado
        const user = userCredential.user;
  
        // Actualizar el perfil del usuario con el nombre de usuario
        return updateProfile(user, { displayName: username }).then(() => {
          // Actualizar el estado de currentUser
          setCurrentUser({ ...user, displayName: username });
        });
      });
  };

  // Función para iniciar sesión
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Función para cerrar sesión
  const logout = () => {
    return signOut(auth);
  };

  // Pasa el estado y las funciones de autenticación por el contexto
  const value = { currentUser, signup, login, logout };

  const saveUserProfile = async (userId, username, email) => {
    try {
      const db = getFirestore();  // Accedemos a Firestore
  
      // Creamos o actualizamos el documento de usuario en la colección "users"
      const userRef = doc(db, "users", userId); // 'users' es la colección
      await setDoc(userRef, {
        username: username,
        email: email,
        createdAt: new Date(),  // Fecha de creación del perfil
      });
  
      console.log("Perfil de usuario guardado en Firestore");
    } catch (error) {
      console.error("Error al guardar el perfil de usuario en Firestore: ", error);
    }
  };
  

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
