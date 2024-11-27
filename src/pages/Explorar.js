import React, { useState, useEffect } from "react";
import GameList from "../components/GameList"; // Asegúrate de tener este componente
import axios from "../axios.js"; // Suponiendo que ya tienes un archivo de configuración de axios
import "../styles/Explorar.css"; // Estilos de la página

const Explorar = () => {
  const [genres, setGenres] = useState([]); // Guardar los géneros obtenidos de la API
  const [genre, setGenre] = useState("all"); // El género seleccionado, "all" por defecto
  const [page, setPage] = useState(1); // Página actual para la paginación

  useEffect(() => {
    // Función para obtener todos los géneros disponibles
    const fetchGenres = async () => {
      try {
        const response = await axios.get("https://api.rawg.io/api/genres", {
          params: {
            key: "88bc76460cbc47a5bad5317e0bae8846", // Tu clave de API
          },
        });
        setGenres(response.data.results); // Almacena los géneros en el estado
      } catch (error) {
        console.error("Error al obtener los géneros:", error);
      }
    };

    fetchGenres();
  }, []); // Solo se ejecuta una vez al cargar la página

  return (
    <div className="explorar-page">
      <h1 className="title">Explorar</h1>

      <div className="menu-container">
        <div className="menu">
          <h3>Selecciona un género</h3>
          <select
            className="genre-select"
            value={genre}
            onChange={(e) => setGenre(e.target.value)} // Actualiza el género seleccionado
          >
            <option value="all">Todos</option> {/* Opción para mostrar todos los géneros */}
            {genres.map((g) => (
              <option key={g.id} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pasa el género seleccionado y la página a GameList */}
      <GameList genre={genre} page={page} />
    </div>
  );
};

export default Explorar;
