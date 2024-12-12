import React, { useContext, useState, useEffect, createContext } from "react";
import { auth, db } from "../firebase/firebaseConfig"; // Usar db y auth correctamente
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Importar desde Firestore

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const saveUserProfile = async (userId, username, email) => {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        username: username,
        email: email,
        createdAt: new Date(),
      });
      console.log("Perfil de usuario guardado en Firestore");
    } catch (error) {
      console.error("Error al guardar el perfil en Firestore: ", error);
    }
  };

  const signup = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });
      await saveUserProfile(user.uid, username, email);
      setCurrentUser({ ...user, displayName: username });
    } catch (error) {
      console.error("Error al registrar el usuario: ", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error al iniciar sesión: ", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    saveUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
