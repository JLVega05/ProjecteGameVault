    // src/services/firebaseService.js
import { db, auth } from "../firebase/firebaseConfig"; // Importa la configuración de Firebase
import { doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore";

// Función para agregar un juego a la colección del usuario
export const addGameToCollection = async (uid, game) => {
  try {
    const userRef = doc(db, "users", uid); // Referencia al documento del usuario

    // Obtener los juegos actuales del usuario
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    // Si no hay una subcolección de juegos, se crea automáticamente
    if (!userData.user_games) {
      await setDoc(userRef, { user_games: [] }, { merge: true }); // Crear la subcolección si no existe
    }

    const userGamesRef = collection(userRef, "user_games"); // Referencia a la subcolección de juegos

    // Agregar el juego a la subcolección
    await addDoc(userGamesRef, {
      game_id: game.id,
      name: game.name,
      background_image: game.background_image,
      added_at: new Date(), // Fecha de adición
    });

    console.log("Juego agregado a la colección del usuario.");
  } catch (error) {
    console.error("Error al agregar el juego:", error);
  }
};
