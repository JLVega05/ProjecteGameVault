// src/services/firebaseService.js
import { db } from "../firebase/firebaseConfig"; 
import { doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore";


export const addGameToCollection = async (uid, game) => {
  try {
    const userRef = doc(db, "users", uid); 
  
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();


    if (!userData.user_games) {
      await setDoc(userRef, { user_games: [] }, { merge: true });
    }

    const userGamesRef = collection(userRef, "user_games");

 
    await addDoc(userGamesRef, {
      game_id: game.id,
      name: game.name,
      background_image: game.background_image,
      added_at: new Date(), 
    });

    console.log("Juego agregado a la colección del usuario.");
  } catch (error) {
    console.error("Error al agregar el juego:", error);
  }
};
