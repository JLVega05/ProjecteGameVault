import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";  // Asegúrate de que la ruta sea correcta
import GameList from "../components/GameList";
import axios from "../axios.js";
import "../styles/Explorar.css";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify"; // Para notificaciones

const Explorar = () => {
  const { currentUser } = useAuth();  // Obtener el usuario actual desde el AuthContext
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get("https://api.rawg.io/api/genres", {
          params: {
            key: "88bc76460cbc47a5bad5317e0bae8846",
          },
        });
        setGenres(response.data.results);
      } catch (error) {
        console.error("Error al obtener los géneros:", error);
      }
    };

    fetchGenres();
  }, []);

  const toggleGameInCollection = async (game) => {
    // Verificar si hay un usuario autenticado
    if (!currentUser) {
      toast.error("Debes estar logueado para añadir juegos a tu colección.");
      return;
    }

    // Asegurarse de que currentUser tiene un uid
    const userId = currentUser.uid;

    try {
      // Agregar el juego a la colección de este usuario
      const collectionRef = collection(db, "users", userId, "collection");
      await addDoc(collectionRef, {
        gameId: game.id,
        name: game.name,
        image: game.background_image,
        genre: game.genres.map((g) => g.name).join(", "), // Almacenar los géneros como una cadena
        addedAt: new Date(),
      });

      toast.success("Juego añadido a tu colección con éxito.");
    } catch (error) {
      console.error("Error al agregar el juego a la colección: ", error);
      toast.error("Hubo un error al añadir el juego.");
    }
  };

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
            <option value="all">Todos</option>
            {genres.map((g) => (
              <option key={g.id} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <GameList genre={genre} page={page} onAddToCollection={toggleGameInCollection} />
    </div>
  );
};

export default Explorar;
