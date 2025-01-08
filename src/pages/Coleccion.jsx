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
        gameId: doc.data().gameId,  
        documentId: doc.id, 
      }));

      setGames(userGames);
    } catch (err) {
      console.error("Error al obtener la colección del usuario:", err);
      setError("Hubo un problema al cargar tu colección.");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (documentId) => {
    if (!currentUser) {
      alert("Debes iniciar sesión para eliminar juegos.");
      return;
    }

    try {
      
      const gameRef = doc(db, "users", currentUser.uid, "games", documentId);
      await deleteDoc(gameRef);

     
      setGames(games.filter(game => game.documentId !== documentId));
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
            <div key={game.documentId} className="game-item">
              <Link to={`/game/${game.gameId}`}>
                <img
                  src={game.background_image || "https://via.placeholder.com/150"}
                  alt={game.name}
                  style={{ width: 150, height: 150 }}
                />
                <h3>{game.name}</h3>
              </Link>
              <button
                className="delete-btn"
                onClick={() => handleDelete(game.documentId)} 
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
