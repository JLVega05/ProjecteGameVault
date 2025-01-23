import React, { useState, useEffect, useCallback } from "react";
import axios from "../axios.jsx";
import "../styles/Explorar.css";
import { useAuth } from "../components/AuthContext";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore"; 
import { db } from "../firebase/firebaseConfig.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Filter from "../components/Filter";
import SearchBar from "../components/SearchBar";
import GameGrid from "../components/GameGrid";
import debounce from 'lodash/debounce';

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

      setGames((prevGames) => {
        const uniqueGames = newGames.filter(game => !prevGames.some(prevGame => prevGame.id === game.id));
        return [...prevGames, ...uniqueGames];
      });
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

  const handleScroll = useCallback(debounce(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
      setPage((prevPage) => prevPage + 1);
    }
  }, 200), []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
      <section className="explorar-content">
        <h1 id="title">Explorar Juegos</h1>
        <div className="filters">
          <SearchBar searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
          <section className="filters btn-group">
            <Filter label="Filtrar por género" options={genres} selectedOption={selectedGenre} handleChange={handleGenreChange} />
            <Filter label="Filtrar por plataforma" options={platforms} selectedOption={selectedPlatform} handleChange={handlePlatformChange} />
          </section>
        </div>
        <GameGrid games={games} addToCollection={addToCollection} />
        {loading && <div>Cargando más juegos...</div>}
        {!hasMore && <div>No hay más juegos para mostrar.</div>}
        <ToastContainer />
      </section>
    </div>
  );
};

export default Explorar;
