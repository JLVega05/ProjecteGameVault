import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios.jsx';
import { db } from '../firebase/firebaseConfig.jsx';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext.jsx';
import "../styles/GameDetails.css";

const GameDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`https://api.rawg.io/api/games/${id}`, {
          params: { key: "88bc76460cbc47a5bad5317e0bae8846" },
        });
        setGame(response.data);
      } catch (err) {
        console.error("Error al cargar los detalles del juego:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsRef = collection(db, "games", id, "comments");
        const commentsSnapshot = await getDocs(commentsRef);
        const commentsList = commentsSnapshot.docs.map(doc => doc.data());
        setComments(commentsList);
      } catch (err) {
        console.error("Error al cargar los comentarios:", err);
      }
    };

    fetchGameDetails();
    fetchComments();
  }, [id]);

  const handleNextImage = () => setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 2);
  const handlePrevImage = () => setCurrentImageIndex((prevIndex) => (prevIndex - 1 + 2) % 2);

  const handleAddComment = async () => {
    if (!currentUser) {
      alert("Debes iniciar sesión para añadir comentarios.");
      return;
    }

    try {
      const commentsRef = collection(db, "games", id, "comments");
      await addDoc(commentsRef, {
        userId: currentUser.uid,
        username: currentUser.displayName || "Usuario",
        text: newComment,
        createdAt: new Date(),
      });
      setComments([...comments, { userId: currentUser.uid, username: currentUser.displayName || "Usuario", text: newComment, createdAt: new Date() }]);
      setNewComment("");
    } catch (err) {
      console.error("Error al añadir el comentario:", err);
    }
  };

  if (loading) return <div>Cargando detalles del juego...</div>;
  if (!game) return <div>No se encontraron detalles para este juego.</div>;

  const images = [game.background_image, game.background_image_additional];

  return (
    <section className="game-details">
      <h1 className="game-title">{game.name}</h1>
      <div className="game-details-content">
        <div className="carousel">
          <button className="carousel-btn prev" onClick={handlePrevImage}>{"<"}</button>
          <img
            src={images[currentImageIndex] || "https://via.placeholder.com/150"}
            alt={game.name}
            className="game-image"
          />
          <button className="carousel-btn next" onClick={handleNextImage}>{">"}</button>
        </div>

        <div className="game-text">
          <p><strong>Fecha de lanzamiento:</strong> {game.released}</p>
          <p><strong>Calificación en Metacrític:</strong> {game.metacritic}</p>
          {game.metacritic && game.metacritic_platforms[0]?.url && (
            <div> 
              <a href={game.metacritic_platforms[0].url} target="_blank" rel="noopener noreferrer">
                Ver en Metacritic
              </a>
            </div>
          )}
          <p><strong>Descripción:</strong> {game.description_raw}</p>
          <div className="game-genres">
            <strong>Géneros:</strong>
            {game.genres.map((genre) => (
              <span key={genre.id} className="genre">{genre.name}</span>
            ))}
          </div>
          <div className="game-platforms">
            <strong>Plataformas:</strong>
            {game.platforms.map((platform) => (
              <span key={platform.platform.id} className="platform">{platform.platform.name}</span>
            ))}
          </div>
          <div className="game-developers">
            <strong>Desarrollador:</strong> {game.developers[0]?.name}
          </div>
          <div className="game-publishers">
            <strong>Editor:</strong> {game.publishers[0]?.name}
          </div>
        </div>
      </div>

      <div className="comments-section">
        <h2>Comentarios</h2>
        <div className="comments-list">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <p><strong>{comment.username}:</strong> {comment.text}</p>
              <p><small>{new Date(comment.createdAt.seconds * 1000).toLocaleString()}</small></p>
            </div>
          ))}
        </div>
        {currentUser && (
          <div className="add-comment">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Añadir un comentario..."
            />
            <button onClick={handleAddComment}>Añadir Comentario</button>
          </div>
        )}
      </div>
    </section>
  );
}

export default GameDetails;