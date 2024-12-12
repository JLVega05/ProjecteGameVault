// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";            
import { getAnalytics } from "firebase/analytics";  

const firebaseConfig = {
  apiKey: "AIzaSyCvAxfziu-SumtUS21YmQV3mfKojgoKBSk",
  authDomain: "gamevault-c4cf0.firebaseapp.com",
  projectId: "gamevault-c4cf0",
  storageBucket: "gamevault-c4cf0.appspot.com",
  messagingSenderId: "833893891870",
  appId: "1:833893891870:web:c757f99da0dff624f8d30f",
  measurementId: "G-QLXEFSX7KH"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  
const auth = getAuth(app);     
const analytics = getAnalytics(app);

// Función para agregar un juego a la colección del usuario
const addGameToCollection = async (userId, game) => {
  try {
    // Referencia a la colección 'user_games' del usuario
    const userGamesRef = collection(db, 'users', userId, 'user_games');
    // Agregar el juego a la colección del usuario
    await addDoc(userGamesRef, {
      game_id: game.id,
      name: game.name,
      background_image: game.background_image,
    });
    console.log("Juego agregado a la colección");
  } catch (error) {
    console.error("Error al agregar juego a la colección:", error);
  }
};

// Función para obtener los juegos de la colección de un usuario
const getUserGames = async (userId) => {
  try {
    const userGamesRef = collection(db, 'users', userId, 'user_games');
    const q = query(userGamesRef);
    const querySnapshot = await getDocs(q);
    const games = [];
    querySnapshot.forEach((doc) => {
      games.push(doc.data());
    });
    return games;
  } catch (error) {
    console.error("Error al obtener los juegos del usuario:", error);
    return [];
  }
};

export { app, db, auth, addGameToCollection, getUserGames };
