import React, { useState, useEffect } from "react";
import axios from "../axios.jsx";

const GameList = ({ genre }) => {
  const [games, setGames] = useState([]); // Lista de juegos
  const [page, setPage] = useState(1); // Paginación
  const [loading, setLoading] = useState(false); // Indicador de carga
  const [hasMore, setHasMore] = useState(true); // ¿Hay más juegos para cargar?

  // Función para obtener juegos desde la API
  const fetchGames = async () => {
    if (loading || !hasMore) return; // Evita hacer más peticiones si ya está cargando o no hay más juegos
    setLoading(true);

    try {
      const response = await axios.get("https://api.rawg.io/api/games", {
        params: {
          genres: genre !== "all" ? genre : "", // Filtra por género si es necesario
          page: page,
          page_size: 20, // Número de juegos por página
          key: "88bc76460cbc47a5bad5317e0bae8846", // API key
        },
      });

      const newGames = response.data.results;
      setGames((prevGames) => [...prevGames, ...newGames]); // Agrega los nuevos juegos a la lista
      setHasMore(newGames.length > 0); // Si no hay juegos nuevos, no habrá más para cargar
    } catch (err) {
      console.error("Error al cargar los juegos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reinicia la carga de juegos al cambiar el género
  useEffect(() => {
    setGames([]); // Limpiar juegos actuales
    setPage(1); // Reiniciar página
    setHasMore(true); // Asegurarse de que haya más juegos
  }, [genre]);

  // Cargar juegos cuando la página o el género cambian
  useEffect(() => {
    fetchGames();
  }, [page, genre]);

  // Maneja el scroll para cargar más juegos cuando el usuario llegue al final
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 50
    ) {
      setPage((prevPage) => prevPage + 1); // Aumenta la página para cargar más juegos
    }
  };

  // Configura el evento de scroll al montar el componente
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
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
          </div>
        ))}
      </div>

      {loading && <div>Cargando más juegos...</div>}
      {!hasMore && <div>No hay más juegos para mostrar.</div>}
    </div>
  );
};

export default GameList;
