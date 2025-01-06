import React, { useState, useEffect } from "react";
import axios from "../axios.jsx";
import { db } from "../firebase/firebaseConfig.jsx"; // Configuración de Firebase 
import { collection, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import "../styles/Coleccion.css";

const Coleccion = ({ userId }) => { // Asegúrate de pasar el ID del usuario
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [userCollection, setUserCollection] = useState([]);

  // Obtener juegos marcados por el usuario desde Firebase
  const fetchUserCollection = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, `users/${userId}/games`));
      const userGames = querySnapshot.docs.map((doc) => doc.data());
      setUserCollection(userGames.map((game) => game.id));
    } catch (error) {
      console.error("Error al obtener la colección del usuario:", error);
    }
  };

  // Obtener lista de juegos de la API RAWG
  const fetchGames = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await axios.get("https://api.rawg.io/api/games", {
        params: {
          page: page,
          page_size: 20,
          key: "88bc76460cbc47a5bad5317e0bae8846",
        },
      });

      const newGames = response.data.results;
      setGames((prevGames) => [...prevGames, ...newGames]);
      setHasMore(newGames.length > 0);
    } catch (err) {
      console.error("Error al cargar los juegos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
    fetchUserCollection();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 50
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleGameInCollection = async (game) => {
    const gameRef = doc(db, `users/${userId}/games`, game.id.toString());

    try {
      if (userCollection.includes(game.id)) {
        // Eliminar el juego de la colección
        await deleteDoc(gameRef);
        setUserCollection((prev) => prev.filter((id) => id !== game.id));
      } else {
        // Agregar el juego a la colección
        await setDoc(gameRef, {
          id: game.id,
          name: game.name,
          released: game.released,
          background_image: game.background_image || "https://via.placeholder.com/150",
        });
        setUserCollection((prev) => [...prev, game.id]);
      }
    } catch (error) {
      console.error("Error al actualizar la colección del usuario:", error);
    }
  };

  return (
    <div className="coleccion-page">
      <h1 className="title">Mi Colección</h1>
      <div className="game-list">
        {games.map((game) => (
          <div key={game.id} className="game-item">
            <img
              src={game.background_image || "https://via.placeholder.com/150"}
              alt={game.name}
              style={{ width: 150, height: 150 }}
            />
            <h3>{game.name}</h3>
            <p>{game.released}</p>
            <button
              className={`collection-button ${userCollection.includes(game.id) ? "added" : ""}`}
              onClick={() => toggleGameInCollection(game)}
            >
              {userCollection.includes(game.id) ? "En mi colección" : "Agregar a mi colección"}
            </button>
          </div>
        ))}
      </div>
      {loading && <div>Cargando más juegos...</div>}
      {!hasMore && <div>No hay más juegos para mostrar.</div>}
    </div>
  );
};

export default Coleccion;
