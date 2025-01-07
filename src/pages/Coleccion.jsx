import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { db } from "../firebase/firebaseConfig.jsx"; // Configuración de Firebase
import { collection, getDocs } from "firebase/firestore";
import "../styles/Coleccion.css"; // Estilos para la página
import { Link } from 'react-router-dom';

const Coleccion = () => {
  const [games, setGames] = useState([]); // Almacena los juegos del usuario
  const { currentUser } = useAuth(); // Obtiene el usuario autenticado desde el contexto
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Almacena errores si ocurren

  // Función para obtener la colección de juegos del usuario autenticado
  const fetchUserCollection = async () => {
    if (!currentUser) {
      alert("Debes iniciar sesión para ver tu colección.");
      return;
    }

    try {
      // Referencia a la subcolección 'games' del usuario autenticado
      const userGamesRef = collection(db, "users", currentUser.uid, "games");
      
      const querySnapshot = await getDocs(userGamesRef);
      const userGames = querySnapshot.docs.map((doc) => doc.data()); // Extraemos los datos de los juegos

      setGames(userGames); // Guardamos los juegos en el estado
    } catch (err) {
      console.error("Error al obtener la colección del usuario:", err);
      setError("Hubo un problema al cargar tu colección. Inténtalo nuevamente.");
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  // Efecto para cargar la colección de juegos cuando el usuario se autentica
  useEffect(() => {
    if (currentUser) {
      fetchUserCollection(); // Llama a la función para cargar los juegos del usuario
    }
  }, [currentUser]); // Reacciona a los cambios en el usuario autenticado

  return (
    <div className="coleccion-page">
      <h1 className="title">Tu Colección de Juegos</h1>
      
      {loading && <p>Cargando tu colección...</p>} {/* Mensaje de carga */}
      {error && <p className="error">{error}</p>} {/* Mensaje de error si ocurre */}
      
      <div className="game-list">
        {games.length > 0 ? (
          games.map((game, index) => (
            <div key={`${game.gameId}-${index}`} className="game-item">
              <Link to={`/game/${game.gameId}`}>  {/* Aquí se envuelve todo con Link */}
                <img
                  src={game.background_image || "https://via.placeholder.com/150"}
                  alt={game.name}
                  style={{ width: 150, height: 150 }}
                />
                <h3>{game.name}</h3>
                <p>{game.released}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No tienes juegos en tu colección.</p> // Mensaje si no hay juegos
        )}
      </div>
    </div>
  );
};

export default Coleccion;
