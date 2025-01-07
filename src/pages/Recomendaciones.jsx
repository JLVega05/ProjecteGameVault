import React, { useState, useEffect, useCallback } from "react";
import axios from "../axios.jsx";
import { useAuth } from "../components/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore"; 
import { db } from "../firebase/firebaseConfig.jsx";
import { Link } from 'react-router-dom';
import "../styles/Explorar.css";

const Recomendaciones = () => {
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [userGenres, setUserGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { currentUser } = useAuth();

  const fetchUserGenres = async () => {
    if (!currentUser) return;
    try {
      const gamesCollectionRef = collection(db, "users", currentUser.uid, "games");
      const querySnapshot = await getDocs(gamesCollectionRef);
      
      const genres = new Set();
      querySnapshot.forEach((doc) => {
        const gameGenres = doc.data().genres;
        gameGenres.forEach((genreId) => genres.add(genreId));
      });

      setUserGenres(Array.from(genres));
    } catch (error) {
      console.error("Error al obtener los géneros del usuario:", error);
    }
  };

  const fetchRecommendedGames = async (page) => {
    if (loading || userGenres.length === 0) return;
    setLoading(true);

    try {
      const genreIds = userGenres.join(",");
      const params = { genres: genreIds, key: "88bc76460cbc47a5bad5317e0bae8846", page };
      const response = await axios.get("https://api.rawg.io/api/games", { params });

      const games = response.data.results;

      if (games.length === 0) {
        setHasMore(false);
      } else {
        setRecommendedGames((prevGames) => [...prevGames, ...games]);
      }
    } catch (error) {
      console.error("Error al obtener los juegos recomendados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    const bottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
    if (bottom && !loading && hasMore) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchRecommendedGames(nextPage);
        return nextPage;
      });
    }
  }, [loading, hasMore]);

  useEffect(() => {
    fetchUserGenres();
  }, [currentUser]);

  useEffect(() => {
    if (userGenres.length > 0) {
      fetchRecommendedGames(page);
    }
  }, [userGenres, page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const addToCollection = async (game) => {
    if (!currentUser) {
      alert("Debes iniciar sesión para añadir juegos a tu colección.");
      return;
    }

    try {
      const gamesCollectionRef = collection(db, "users", currentUser.uid, "games");
      const q = query(gamesCollectionRef, where("gameId", "==", game.id)); 
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert(`El juego "${game.name}" ya está en tu colección.`);
        return;
      }

      await addDoc(gamesCollectionRef, {
        gameId: game.id,
        name: game.name,
        background_image: game.background_image,
        description: game.description || "Sin descripción",
        genres: game.genres.map((genre) => genre.id),
        addedAt: new Date(),
      });

      alert(`El juego "${game.name}" ha sido añadido a tu colección.`);
    } catch (error) {
      console.error("Error al añadir el juego a la colección:", error);
      alert("Hubo un problema al añadir el juego. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="explorar-page">
      <h1 className="title">Recomendaciones</h1>

      {loading && <div>Cargando juegos recomendados...</div>}

      <div className="game-list">
        {recommendedGames.length > 0 ? (
            recommendedGames.map((game, index) => (
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
            ))
        ) : (
            <div>No hay juegos recomendados.</div>
        )}
        </div>


      {!hasMore && <div>No hay más juegos recomendados.</div>}
    </div>
  );
};

export default Recomendaciones;
