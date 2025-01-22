import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../styles/BuscarUsuario.css";

const BuscarUsuario = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", ">=", searchTerm), where("username", "<=", searchTerm + "\uf8ff"));
    const querySnapshot = await getDocs(q);

    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setSearchResults(results);
  };

  const handleUserClick = (userId) => {
    navigate(`/perfil-usuario/${userId}`);
  };

  return (
    <div className="buscar-usuario-page">
      <h2>Buscar Usuario</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
      <div className="search-results">
        {searchResults.map((user) => (
          <div
            key={user.id}
            className="search-result-item"
            onClick={() => handleUserClick(user.id)}
          >
            {user.username}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuscarUsuario;
