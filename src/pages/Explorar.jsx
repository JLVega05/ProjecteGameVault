import React, { useState, useEffect } from "react";
import axios from "../axios.jsx";
import "../styles/Explorar.css";
import { useAuth } from "../components/AuthContext";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore"; 
import { db } from "../firebase/firebaseConfig.jsx";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Explorar = () => {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { currentUser } = useAuth(); 

  const fetchGenres = async () => {
    try {
      const response = await axios.get("https://api.rawg.io/api/genres", {
        params: { key: "88bc76460cbc47a5bad5317e0bae8846" },
      });
      setGenres(response.data.results);
    } catch (err) {
      console.error("Error al cargar los géneros:", err);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const response = await axios.get("https://api.rawg.io/api/platforms", {
        params: { key: "88bc76460cbc47a5bad5317e0bae8846" },
      });
      setPlatforms(response.data.results);
    } catch (err) {
      console.error("Error al cargar las plataformas:", err);
    }
  };

  const fetchGames = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const params = { page, page_size: 20, key: "88bc76460cbc47a5bad5317e0bae8846" };
      if (selectedGenre) params.genres = selectedGenre;
      if (selectedPlatform) params.platforms = selectedPlatform;
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get("https://api.rawg.io/api/games", { params });
      const newGames = response.data.results;
      setGames((prevGames) => [...prevGames, ...newGames]);
      setHasMore(newGames.length > 0);
    } catch (err) {
      console.error("Error al cargar los juegos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
    fetchPlatforms();
  }, []);

  useEffect(() => {
    fetchGames();
  }, [page, selectedGenre, selectedPlatform, searchTerm]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
    setPage(1);
    setGames([]);
  };

  const handlePlatformChange = (event) => {
    setSelectedPlatform(event.target.value);
    setPage(1);
    setGames([]);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
    setGames([]);
  };

  const addToCollection = async (game) => {
    if (!currentUser) {
      toast.error("Debes iniciar sesión para añadir juegos a tu colección.");
      return;
    }
  
    try {
      const gamesCollectionRef = collection(db, "users", currentUser.uid, "games");
  
    
      const q = query(gamesCollectionRef, where("gameId", "==", game.id)); 
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        toast.error(`El juego "${game.name}" ya está en tu colección.`);
        return;
      }
  
      
      const gameGenreIds = game.genres.map((genre) => genre.id); 
  
      
      await addDoc(gamesCollectionRef, {
        gameId: game.id,
        name: game.name,
        background_image: game.background_image,
        description: game.description || "Sin descripción",
        genres: gameGenreIds,  
        addedAt: new Date(),
      });
  
      toast.success(`El juego "${game.name}" ha sido añadido a tu colección.`);
    } catch (error) {
      console.error("Error al añadir el juego a la colección:", error);
      toast.error("Hubo un problema al añadir el juego. Inténtalo nuevamente.");
    }
  };
  

  return (
    <div className="explorar-page">
      <h1 className="title">Explorar Juegos</h1>

      <div className="search-container">
        <p className="search-label">EXPLORAR</p>
        <input
          type="text"
          placeholder="Escribe el título del juego"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="filter-container">
        <div className="filter-label">Filtrar por género</div>
        <select onChange={handleGenreChange} value={selectedGenre}>
          <option value="">Cualquiera</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>

        <div className="filter-label">Filtrar por plataforma</div>
        <select onChange={handlePlatformChange} value={selectedPlatform}>
          <option value="">Cualquiera</option>
          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>{platform.name}</option>
          ))}
        </select>
      </div>

      <div className="game-list">
        {games.map((game, index) => (
          <div key={`${game.id}-${index}`} className="game-item">
            <Link to={`/game/${game.id}`}>
              <img
                src={game.background_image || "https://via.placeholder.com/150"}
                alt={game.name}
                style={{ width: 150, height: 150 }}
              />
              <h3>{game.name}</h3>
              <p>{game.released}</p>
            </Link>
            <button className="bmain" onClick={() => addToCollection(game)}>
              Añadir a la colección
            </button>
          </div>
        ))}
      </div>

      {loading && <div>Cargando más juegos...</div>}
      {!hasMore && <div>No hay más juegos para mostrar.</div>}
      <ToastContainer />
    </div>
  );
};

export default Explorar;
