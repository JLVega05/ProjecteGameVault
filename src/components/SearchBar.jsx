import React from 'react';

const SearchBar = ({ searchTerm, handleSearchChange }) => (
  <div className="search-container">
    <p className="search-label">EXPLORAR</p>
    <input
      type="text"
      placeholder="Escribe el título del juego"
      value={searchTerm}
      onChange={handleSearchChange}
    />
  </div>
);

export default SearchBar;
