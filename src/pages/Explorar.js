import React, { useState, useEffect } from "react";
import GameList from "../components/GameList"; // Asegúrate de tener este componente
import "../styles/Explorar.css"; // Estilos de la página

const Explorar = () => {
  const [genre, setGenre] = useState(""); // Puedes agregar más géneros si lo deseas
  const [page, setPage] = useState(1);

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
            <option value="">Todos</option>
            <option value="action">Acción</option>
            <option value="adventure">Aventura</option>
            <option value="rpg">RPG</option>
            {/* Agrega más géneros según sea necesario */}
          </select>
        </div>
      </div>

      <GameList genre={genre} page={page} />
    </div>
  );
};

export default Explorar;
