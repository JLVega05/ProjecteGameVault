import React, { useState, useEffect } from "react";
import axios from "../axios.js";
import { db } from "../firebase/firebaseConfig.js";
import { collection, doc, getDocs, deleteDoc } from "firebase/firestore";
import "../styles/Coleccion.css";
import { Alert, Spinner } from "react-bootstrap";

const Coleccion = ({ userId }) => {
  const [userCollection, setUserCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Para mostrar mensajes de feedback
  const [isLoadingAction, setIsLoadingAction] = useState(false); // Para mostrar spinner durante acciones

  // Obtener juegos de la colección del usuario desde Firebase
  const fetchUserCollection = async () => {
    setLoading(true); // Activar el estado de carga
    try {
      const querySnapshot = await getDocs(collection(db, `users/${userId}/games`));
      const userGames = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserCollection(userGames); // Almacenar los juegos en el estado
    } catch (error) {
      console.error("Error al obtener la colección del usuario:", error);
      setFeedbackMessage("Error al cargar tu colección.");
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  // Eliminar un juego de la colección
  const removeGameFromCollection = async (gameId) => {
    setIsLoadingAction(true); // Activar el spinner mientras se procesa la acción
    setFeedbackMessage(""); // Limpiar mensaje anterior

    try {
      // Eliminar el juego de Firebase
      await deleteDoc(doc(db, `users/${userId}/games`, gameId));
      setUserCollection((prev) => prev.filter((game) => game.id !== gameId)); // Actualizar el estado
      setFeedbackMessage("Juego eliminado de tu colección.");
    } catch (error) {
      console.error("Error al eliminar el juego:", error);
      setFeedbackMessage("Error al eliminar el juego de tu colección.");
    } finally {
      setIsLoadingAction(false); // Desactivar el spinner
    }
  };

  useEffect(() => {
    fetchUserCollection();
  }, []);

  return (
    <div className="coleccion-page">
      <h1 className="title">Mi Colección</h1>

      {/* Mostrar mensaje de feedback */}
      {feedbackMessage && (
        <Alert variant={feedbackMessage.includes("Error") ? "danger" : "success"}>
          {feedbackMessage}
        </Alert>
      )}

      <div className="game-list">
        {loading ? (
          <div> <Spinner animation="border" /> Cargando tu colección...</div> // Mostrar spinner mientras se cargan los juegos
        ) : (
          userCollection.length === 0 ? (
            <div>No tienes juegos en tu colección aún.</div> // Mensaje si la colección está vacía
          ) : (
            userCollection.map((game) => (
              <div key={game.id} className="game-item">
                <img
                  src={game.background_image || "https://via.placeholder.com/150"}
                  alt={game.name}
                  style={{ width: 150, height: 150 }}
                />
                <h3>{game.name}</h3>
                <p>{game.released}</p>
                <button
                  className="remove-button"
                  onClick={() => removeGameFromCollection(game.id)} // Llamar a la función para eliminar el juego
                  disabled={isLoadingAction} // Deshabilitar mientras se procesa la acción
                >
                  {isLoadingAction ? (
                    <Spinner animation="border" size="sm" /> // Spinner cuando se está procesando la acción
                  ) : (
                    "Eliminar de mi colección"
                  )}
                </button>
              </div>
            ))
          )
        )}
      </div>

    </div>
  );
};

export default Coleccion;
