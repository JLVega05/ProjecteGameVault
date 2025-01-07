import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Para obtener el ID de la URL
import axios from '../axios.jsx';
import "../styles/GameDetails.css";  // Asegúrate de que el archivo CSS esté presente y tenga estilos adecuados

const GameDetails = () => {
  const { id } = useParams();  // Obtiene el ID del juego de la URL
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`https://api.rawg.io/api/games/${id}`, {
          params: {
            key: "88bc76460cbc47a5bad5317e0bae8846",
          },
        });
        setGame(response.data);  // Establece los datos del juego
      } catch (err) {
        console.error("Error al cargar los detalles del juego:", err);
      } finally {
        setLoading(false);  // Termina la carga
      }
    };

    fetchGameDetails();
  }, [id]);  // Se vuelve a ejecutar si el ID cambia

  if (loading) {
    return <div>Cargando detalles del juego...</div>;
  }

  if (!game) {
    return <div>No se encontraron detalles para este juego.</div>;
  }

  return (
    <section className="game-details">
      <h1 className="game-title">{game.name}</h1>
      <div className="game-details-content">
        {/* Imagen del juego */}
        <img
          src={game.background_image || "https://via.placeholder.com/150"}
          alt={game.name}
          className="game-image"
        />
        {/* Texto de la descripción y demás */}
        <div className="game-text">
          <p><strong>Fecha de lanzamiento:</strong> {game.released}</p>
          {game.metacritic && game.metacritic_platforms[0]?.url && (
            <div>
              <strong>Metacritic:</strong> {game.metacritic} 
              <a href={game.metacritic_platforms[0].url} target="_blank" rel="noopener noreferrer">
                Ver en Metacritic
              </a>
            </div>
          )}
          <p><strong>Descripción:</strong> {game.description_raw}</p>
          <div className="game-genres">
            <strong>Géneros:</strong>
            {game.genres.map((genre) => (
              <span key={genre.id} className="genre">{genre.name}</span>
            ))}
          </div>
          <div className="game-platforms">
            <strong>Plataformas:</strong>
            {game.platforms.map((platform) => (
              <span key={platform.platform.id} className="platform">
                {platform.platform.name}
              </span>
            ))}
          </div>
          <div className="game-developers">
            <strong>Desarrollador:</strong> {game.developers[0]?.name}
          </div>
          <div className="game-publishers">
            <strong>Editor:</strong> {game.publishers[0]?.name}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GameDetails;
