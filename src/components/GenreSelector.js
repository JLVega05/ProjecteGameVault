import React, { useState, useEffect } from "react";
import axios from "../axios.js";

const GenreSelector = () => {
  const [genres, setGenres] = useState([]);  
  const [selectedGenre, setSelectedGenre] = useState("all");  

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get("https://api.rawg.io/api/genres", {
          params: {
            key: "88bc76460cbc47a5bad5317e0bae8846",  // Reemplaza esto con tu clave de API
          },
        });
        setGenres(response.data.results);  // Guarda los géneros en el estado
      } catch (error) {
        console.error("Error al obtener los géneros:", error);
      }
    };

    fetchGenres(); // Llama a la función para obtener los géneros cuando el componente se monta
  }, []);  // Solo se ejecuta una vez al montar el componente

  // Maneja el cambio de selección del género
  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  return (
    <div>
      {/* Mantener el formato HTML sin cambios importantes */}
      <h2>Selecciona un género</h2>
      <div>
        <select 
          value={selectedGenre} 
          onChange={handleGenreChange} 
          className="genre-selector"
        >
          <option value="all">Todos</option>  {/* Opción "Todos" */}
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
      {/* Mostrar el género seleccionado si es necesario */}
      <p>Género seleccionado: {selectedGenre === "all" ? "Todos" : genres.find(g => g.id === selectedGenre)?.name}</p>
    </div>
  );
};

export default GenreSelector;