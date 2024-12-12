import React, { useState, useEffect } from "react";
import GameList from "../components/GameList";
import axios from "../axios.js"; 
import "../styles/Explorar.css"; 

const Explorar = () => {
  const [genres, setGenres] = useState([]); 
  const [genre, setGenre] = useState("all"); 
  const [page, setPage] = useState(1); 

  useEffect(() => {
   
    const fetchGenres = async () => {
      try {
        const response = await axios.get("https://api.rawg.io/api/genres", {
          params: {
            key: "88bc76460cbc47a5bad5317e0bae8846", 
          },
        });
        setGenres(response.data.results); 
      } catch (error) {
        console.error("Error al obtener los géneros:", error);
      }
    };

    fetchGenres();
  }, []); 

  return (
    <div className="explorar-page">
      <h1 className="title">Explorar</h1>

      <div className="menu-container">
        <div className="menu">
          <h3>Selecciona un género</h3>
          <select
            className="genre-select"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="all">Todos</option> {}
            {genres.map((g) => (
              <option key={g.id} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {}
      <GameList genre={genre} page={page} />
    </div>
  );
};

export default Explorar;
