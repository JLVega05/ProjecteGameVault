import React, { useState, useEffect } from "react";
import axios from "../axios.jsx"; // Axios configurado para realizar solicitudes a la API RAWG

const Explorar = () => {
  const [games, setGames] = useState([]);  // Almacena los juegos que vamos a mostrar
  const [page, setPage] = useState(1);  // Controla la página de la paginación
  const [loading, setLoading] = useState(false);  // Estado de carga
  const [hasMore, setHasMore] = useState(true);  // Controla si hay más juegos para mostrar

  // Función que obtiene los juegos de la API RAWG
  const fetchGames = async () => {
    if (loading || !hasMore) return; // Si estamos cargando o no hay más juegos, no hace nada
    setLoading(true);  // Inicia la carga de juegos

    try {
      const response = await axios.get("https://api.rawg.io/api/games", {
        params: {
          page: page,  // Paginación
          page_size: 20,  // Número de juegos por página
          key: "88bc76460cbc47a5bad5317e0bae8846",  // Tu clave de API RAWG
        },
      });

      const newGames = response.data.results;  // Nuevos juegos obtenidos
      setGames((prevGames) => [...prevGames, ...newGames]);  // Agrega los nuevos juegos a la lista
      setHasMore(newGames.length > 0);  // Si la longitud de los juegos es mayor a 0, significa que hay más juegos
    } catch (err) {
      console.error("Error al cargar los juegos:", err);
    } finally {
      setLoading(false);  // Termina la carga
    }
  };

  // Efecto para cargar los juegos cuando la página cambia
  useEffect(() => {
    fetchGames();  // Llama a la función para cargar los juegos cada vez que cambie la página
  }, [page]);

  // Función para manejar el scroll y cargar más juegos cuando se llega al final
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 50
    ) {
      setPage((prevPage) => prevPage + 1);  // Incrementa la página para cargar más juegos
    }
  };

  // Agrega un event listener para detectar el scroll y cargar más juegos
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);  // Limpia el event listener cuando el componente se desmonta
  }, []);

  return (
    <div className="explorar-page">
      <h1 className="title">Explorar Juegos</h1>
      <div className="game-list">
        {games.map((game) => (
          <div key={game.id} className="game-item">
            <img
              src={game.background_image || "https://via.placeholder.com/150"}  // Muestra una imagen por defecto si no hay imagen
              alt={game.name}
              style={{ width: 150, height: 150 }}  // Tamaño de las imágenes de los juegos
            />
            <h3>{game.name}</h3>
            <p>{game.released}</p>  {/* Muestra la fecha de lanzamiento del juego */}
          </div>
        ))}
      </div>
      {loading && <div>Cargando más juegos...</div>}  {/* Muestra un mensaje mientras se cargan más juegos */}
      {!hasMore && <div>No hay más juegos para mostrar.</div>}  {/* Muestra un mensaje si no hay más juegos */}
    </div>
  );
};

export default Explorar;
