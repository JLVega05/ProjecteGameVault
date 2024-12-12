import React, { useState } from "react";
import { useAuth } from "../components/AuthContext"; // Para obtener el usuario autenticado
import { addGameToCollection } from "../firebase/firebaseConfig"; // Importa las funciones de Firebase

const CollectionManagement = ({ game }) => {
  const { currentUser } = useAuth(); // Obtiene el usuario actual del contexto
  const [isAdded, setIsAdded] = useState(false); // Estado para verificar si el juego ya está en la colección

  // Función para agregar el juego a la colección del usuario
  const handleAddToCollection = async () => {
    if (currentUser) {
      try {
        await addGameToCollection(currentUser.uid, game); // Llama a la función de Firebase para agregar el juego
        setIsAdded(true); // Cambia el estado a "agregado"
      } catch (error) {
        console.error("Error al agregar juego:", error);
      }
    }
  };

  return (
    <div>
      {/* Mostrar un mensaje si el juego ya está en la colección */}
      {isAdded ? (
        <p>Este juego ya está en tu colección.</p>
      ) : (
        <button onClick={handleAddToCollection}>Añadir a mi colección</button>
      )}
    </div>
  );
};

export default CollectionManagement;
