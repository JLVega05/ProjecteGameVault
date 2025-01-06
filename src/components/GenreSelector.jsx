import React, { useState, useEffect } from "react";
import axios from "../axios.jsx";

const GenreSelector = () => {
  const [genres, setGenres] = useState([]);  
  const [selectedGenre, setSelectedGenre] = useState("all");  

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

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  return (
    <div>
      {}
      <h2>Selecciona un género</h2>
      <div>
        <select 
          value={selectedGenre} 
          onChange={handleGenreChange} 
          className="genre-selector"
        >
          <option value="all">Todos</option>  {}
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
      {}
      <p>Género seleccionado: {selectedGenre === "all" ? "Todos" : genres.find(g => g.id === selectedGenre)?.name}</p>
    </div>
  );
};

export default GenreSelector;
