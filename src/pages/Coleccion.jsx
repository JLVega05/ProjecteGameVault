import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { db } from "../firebase/firebaseConfig.jsx";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import "../styles/Coleccion.css";
import { Link } from 'react-router-dom';

const Coleccion = () => {
  const [games, setGames] = useState([]);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtiene la colección de juegos del usuario autenticado
  const fetchUserCollection = async () => {
    if (!currentUser) {
      alert("Debes iniciar sesión para ver tu colección.");
      return;
    }

    try {
      const userGamesRef = collection(db, "users", currentUser.uid, "games");
      const querySnapshot = await getDocs(userGamesRef);
      const userGames = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        gameId: doc.data().gameId // Usamos la gameId almacenada en el documento
      }));

      setGames(userGames);
    } catch (err) {
      console.error("Error al obtener la colección del usuario:", err);
      setError("Hubo un problema al cargar tu colección.");
    } finally {
      setLoading(false);
    }
  };

  // Elimina un juego de la colección
  const handleDelete = async (gameId) => {
    if (!currentUser) {
      alert("Debes iniciar sesión para eliminar juegos.");
      return;
    }

    try {
      const gameRef = doc(db, "users", currentUser.uid, "games", gameId);
      await deleteDoc(gameRef);
      setGames(games.filter(game => game.gameId !== gameId));
    } catch (err) {
      console.error("Error al eliminar el juego:", err);
      setError("Hubo un problema al eliminar el juego.");
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserCollection();
    }
  }, [currentUser]);

  return (
    <div className="coleccion-page">
      <h1 className="title">Tu Colección de Juegos</h1>

      {loading && <p>Cargando tu colección...</p>}
      {error && <p className="error">{error}</p>}

      <div className="game-list">
        {games.length > 0 ? (
          games.map((game) => (
            <div key={game.gameId} className="game-item">
              <Link to={`/game/${game.gameId}`}>
                <img
                  src={game.background_image || "https://via.placeholder.com/150"}
                  alt={game.name}
                  style={{ width: 150, height: 150 }}
                />
                <h3>{game.name}</h3>
                <p>{game.released}</p>
              </Link>
              <button
                className="delete-btn"
                onClick={() => handleDelete(game.gameId)}
              >
                Eliminar de la colección
              </button>
            </div>
          ))
        ) : (
          <p>No tienes juegos en tu colección.</p>
        )}
      </div>
    </div>
  );
};

export default Coleccion;
