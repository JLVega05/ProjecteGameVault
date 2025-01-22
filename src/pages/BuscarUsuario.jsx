import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, startAt, endAt, getDocs } from "firebase/firestore";
import "../styles/BuscarUsuario.css";

const BuscarUsuario = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;

    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        orderBy("username"),
        startAt(searchTerm),
        endAt(searchTerm + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);

      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log("Search term:", searchTerm); // Log para depuración
      console.log("Query snapshot size:", querySnapshot.size); // Log para depuración
      console.log("Search results:", results); // Log para depuración
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
    }
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre de usuario"
        />
        <button type="submit">Buscar</button>
      </form>
      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map(user => (
            <div key={user.id} className="search-result-item" onClick={() => handleUserClick(user.id)}>
              {user.username}
            </div>
          ))
        ) : (
          <p>No se encontraron usuarios.</p>
        )}
      </div>
    </div>
  );
};

export default BuscarUsuario;