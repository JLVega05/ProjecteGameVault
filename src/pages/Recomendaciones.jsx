import React, { useState, useEffect, useRef } from "react";
import axios from "../axios.jsx";
import { useAuth } from "../components/AuthContext";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.jsx";
import "../styles/Explorar.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GameGrid from "../components/GameGrid";

const Recomendaciones = () => {
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [userGenres, setUserGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { currentUser } = useAuth();
  const observer = useRef();
  const lastGameElementRef = useRef();

  const fetchUserGenres = async () => {
    if (!currentUser) {
      toast.error("Debes iniciar sesión para ver recomendaciones.");
      return;
    }
    try {
      const gamesCollectionRef = collection(db, "users", currentUser.uid, "games");
      const querySnapshot = await getDocs(gamesCollectionRef);
      
      const genreCount = {};
      querySnapshot.forEach((doc) => {
        const gameGenres = doc.data().genres;
        gameGenres.forEach((genreId) => {
          genreCount[genreId] = (genreCount[genreId] || 0) + 1;
        });
      });

      const sortedGenres = Object.keys(genreCount).sort((a, b) => genreCount[b] - genreCount[a]);
      const topGenres = sortedGenres.slice(0, 3);
      setUserGenres(topGenres);
    } catch (error) {
      console.error("Error al obtener los géneros del usuario:", error);
    }
  };

  const fetchRecommendedGames = async () => {
    if (!currentUser) return;
    if (loading || userGenres.length === 0 || !hasMore) return;
    setLoading(true);

    try {
      const genreIds = userGenres.join(",");
      const params = { genres: genreIds, key: "88bc76460cbc47a5bad5317e0bae8846", page, page_size: 60 }; // Increased page_size to 60
      const response = await axios.get("https://api.rawg.io/api/games", { params });

      const games = response.data.results;

      setRecommendedGames((prevGames) => {
        const uniqueGames = games.filter(game => !prevGames.some(prevGame => prevGame.id === game.id));
        return [...prevGames, ...uniqueGames];
      });
      setHasMore(games.length > 0);
    } catch (error) {
      console.error("Error al obtener los juegos recomendados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserGenres();
  }, [currentUser]);

  useEffect(() => {
    if (userGenres.length > 0) {
      setRecommendedGames([]);
      setPage(1);
      setHasMore(true);
    }
  }, [userGenres]);

  useEffect(() => {
    fetchRecommendedGames();
  }, [page, userGenres]);

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    }, { threshold: 0.5 }); // Adjusted threshold to 0.5
    if (lastGameElementRef.current) observer.current.observe(lastGameElementRef.current);
  }, [loading, hasMore]);

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

      await addDoc(gamesCollectionRef, {
        gameId: game.id,
        name: game.name,
        background_image: game.background_image,
        description: game.description || "Sin descripción",
        genres: game.genres.map((genre) => genre.id),
        addedAt: new Date(),
      });

      toast.success(`El juego "${game.name}" ha sido añadido a tu colección.`);
    } catch (error) {
      console.error("Error al añadir el juego a la colección:", error);
      toast.error("Hubo un problema al añadir el juego. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="explorar-page" style={{ minHeight: '120px', overflow: 'hidden', paddingBottom: '200px' }}> {/* Added paddingBottom */}
      <section className="explorar-content" style={{ overflow: 'hidden' }}>
        <h1 id="title">Recomendaciones</h1>
        
        <ToastContainer />

        {loading && <div>Cargando juegos recomendados...</div>}

        <div style={{ minHeight: '900px', paddingBottom: '0px', transition: 'min-height 0.5s ease', height: 'auto' }}>
          <GameGrid games={recommendedGames} addToCollection={addToCollection} /> {/* Removed lastGameElementRef */}
          <div ref={lastGameElementRef} style={{ height: '1px' }}></div> {/* Add a fixed height */}
        </div>
        {!hasMore && <div>No hay más juegos recomendados.</div>}
      </section>
    </div>
  );
};

export default Recomendaciones;