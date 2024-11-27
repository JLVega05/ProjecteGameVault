// src/components/GameList.jsx

import React, { useState, useEffect } from "react";
import axios from "../axios.js";

const GameList = ({ genre, page }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Función para obtener los juegos de la API
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/games", {
          params: { genre, page },
        });
        setGames(response.data.results);  // Asegúrate de que la respuesta contenga la clave 'results'
        setLoading(false);
      } catch (err) {
        setError("No se pudieron cargar los juegos.");
        setLoading(false);
      }
    };

    fetchGames();
  }, [genre, page]); // Se vuelve a ejecutar cuando cambian el genre o el page

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Lista de Juegos</h2>
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
    </div>
  );
};

export default GameList;
