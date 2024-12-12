import React, { useState, useEffect } from "react";
import axios from "../axios.js";
import { useAuth } from "../components/AuthContext"; // Importa el contexto de autenticación

const GameList = ({ genre }) => {
  const { currentUser } = useAuth(); // Verifica si el usuario está logueado
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1); 
  const [loading, setLoading] = useState(false); 
  const [hasMore, setHasMore] = useState(true); 
  const [showMessage, setShowMessage] = useState(true); // Estado para controlar la visibilidad del mensaje

  const fetchGames = async () => {
    if (loading || !hasMore) return; 
    setLoading(true);

    try {
      const response = await axios.get("https://api.rawg.io/api/games", {
        params: {
          genres: genre !== "all" ? genre : "", 
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
    setGames([]); 
    setPage(1); 
    setHasMore(true); 
  }, [genre]);

  useEffect(() => {
    fetchGames();
  }, [page, genre]);

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

  const handleProceedWithoutAuth = () => {
    setShowMessage(false); // Oculta el mensaje al hacer clic en el botón
  };

  return (
    <div>
      {/* Mostrar el mensaje de advertencia si el usuario no está logueado */}
      {showMessage && !currentUser && (
        <div className="notification">
          <p>Para añadir juegos a tu colección, debes iniciar sesión.</p>
          <div className="buttons-container">
            <button onClick={() => window.location.href = '/login'}>Ir a Iniciar sesión</button>
            <button className="proceed-button" onClick={handleProceedWithoutAuth}>
              Proceder sin autenticarse
            </button>
          </div>
        </div>
      )}

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

            {/* Mostrar el botón de "Añadir a la colección" solo si el usuario está logueado */}
            {currentUser && (
              <button>Guardar en mi colección</button>
            )}
          </div>
        ))}
      </div>

      {loading && <div>Cargando más juegos...</div>}
      {!hasMore && <div>No hay más juegos para mostrar.</div>}
    </div>
  );
};

export default GameList;
