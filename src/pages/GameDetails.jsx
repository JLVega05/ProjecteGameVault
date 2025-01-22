import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../axios.jsx';
import { db } from '../firebase/firebaseConfig.jsx';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/GameDetails.css";

const GameDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

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
        const commentsRef = collection(db, "comments");
        const q = query(commentsRef, where("gameId", "==", id));
        const commentsSnapshot = await getDocs(q);
        const commentsList = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
      toast.error("Debes iniciar sesión para añadir comentarios.");
      return;
    }

    if (newComment.trim() === "") {
      toast.error("El comentario no puede estar vacío.");
      return;
    }

    try {
      const commentsRef = collection(db, "comments");
      const newCommentData = {
        gameId: id,
        userId: currentUser.uid,
        username: currentUser.displayName || "Usuario",
        text: newComment,
        rating: rating,
        createdAt: new Date(),
        likes: 0,
        dislikes: 0,
      };
      const docRef = await addDoc(commentsRef, newCommentData);
      setComments([...comments, { id: docRef.id, ...newCommentData }]);
      setNewComment("");
      setRating(0);
      toast.success("Comentario añadido con éxito.");
    } catch (err) {
      console.error("Error al añadir el comentario:", err);
      toast.error("Hubo un problema al añadir el comentario. Inténtalo nuevamente.");
    }
  };

  const handleEditComment = async (commentId) => {
    if (!currentUser) {
      toast.error("Debes iniciar sesión para editar comentarios.");
      return;
    }

    try {
      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, { text: editedComment, rating: editedRating });
      setComments(comments.map(comment => comment.id === commentId ? { ...comment, text: editedComment, rating: editedRating } : comment));
      setEditingCommentId(null);
      setEditedComment("");
      setEditedRating(0);
      toast.success("Comentario editado con éxito.");
    } catch (err) {
      console.error("Error al editar el comentario:", err);
      toast.error("Hubo un problema al editar el comentario. Inténtalo nuevamente.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!currentUser) {
      toast.error("Debes iniciar sesión para eliminar comentarios.");
      return;
    }

    try {
      const commentRef = doc(db, "comments", commentId);
      await deleteDoc(commentRef);
      setComments(comments.filter(comment => comment.id !== commentId));
      toast.success("Comentario eliminado con éxito.");
    } catch (err) {
      console.error("Error al eliminar el comentario:", err);
      toast.error("Hubo un problema al eliminar el comentario. Inténtalo nuevamente.");
    }
  };

  const handleVote = async (commentId, type) => {
    if (!currentUser) {
      toast.error("Debes iniciar sesión para votar comentarios.");
      return;
    }

    try {
      const commentRef = doc(db, "comments", commentId);
      const comment = comments.find(comment => comment.id === commentId);
      const userVoteRef = collection(db, "comments", commentId, "votes");
      const userVoteSnapshot = await getDocs(query(userVoteRef, where("userId", "==", currentUser.uid)));

      let updatedComment = { ...comment };

      if (!userVoteSnapshot.empty) {
        const userVoteDoc = userVoteSnapshot.docs[0];
        const userVote = userVoteDoc.data();

        if (userVote.type === type) {
          toast.error("Ya has votado este comentario.");
          return;
        }

        if (userVote.type === 'like') {
          updatedComment.likes -= 1;
        } else {
          updatedComment.dislikes -= 1;
        }

        await deleteDoc(userVoteDoc.ref);
      }

      if (type === 'like') {
        updatedComment.likes += 1;
      } else {
        updatedComment.dislikes += 1;
      }

      await updateDoc(commentRef, updatedComment);
      await addDoc(userVoteRef, { userId: currentUser.uid, type });

      setComments(comments.map(comment => comment.id === commentId ? updatedComment : comment));
      toast.success("Voto registrado con éxito.");
    } catch (err) {
      console.error("Error al votar el comentario:", err);
      toast.error("Hubo un problema al votar el comentario. Inténtalo nuevamente.");
    }
  };

  const formatDate = (date) => {
    if (date instanceof Date) {
      return date.toLocaleString();
    } else if (date && date.toDate) {
      return date.toDate().toLocaleString();
    } else {
      return "Fecha inválida";
    }
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        {currentUser && (
          <div className="add-comment">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Añadir un comentario..."
            />
            <label>Rating:</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value={0}>Selecciona una calificación</option>
              <option value={1}>1 estrella</option>
              <option value={2}>2 estrellas</option>
              <option value={3}>3 estrellas</option>
              <option value={4}>4 estrellas</option>
              <option value={5}>5 estrellas</option>
            </select>
            <button onClick={handleAddComment}>Añadir Comentario</button>
          </div>
        )}
        <div className="comments-list">
          {currentComments.map((comment, index) => (
            <div key={index} className="comment">
              {editingCommentId === comment.id ? (
                <>
                  <textarea
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                  />
                  <label>Rating:</label>
                  <select value={editedRating} onChange={(e) => setEditedRating(Number(e.target.value))}>
                    <option value={0}>Selecciona una calificación</option>
                    <option value={1}>1 estrella</option>
                    <option value={2}>2 estrellas</option>
                    <option value={3}>3 estrellas</option>
                    <option value={4}>4 estrellas</option>
                    <option value={5}>5 estrellas</option>
                  </select>
                  <button onClick={() => handleEditComment(comment.id)}>Guardar</button>
                  <button onClick={() => setEditingCommentId(null)}>Cancelar</button>
                </>
              ) : (
                <>
                  <p>
                    <Link to={`/perfil-usuario/${comment.userId}`} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                      <strong>{comment.username}</strong>
                    </Link>
                    : {comment.text}
                  </p>
                  <p><small>{formatDate(comment.createdAt)}</small></p>
                  <p><strong>Rating:</strong> {comment.rating} / 5</p>
                  <p>
                    <button onClick={() => handleVote(comment.id, 'like')}>👍 {comment.likes}</button>
                    <button onClick={() => handleVote(comment.id, 'dislike')}>👎 {comment.dislikes}</button>
                  </p>
                  {currentUser.uid === comment.userId && (
                    <>
                      <button onClick={() => { setEditingCommentId(comment.id); setEditedComment(comment.text); setEditedRating(comment.rating); }}>Editar</button>
                      <button onClick={() => handleDeleteComment(comment.id)}>Eliminar</button>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="pagination">
          {Array.from({ length: Math.ceil(comments.length / commentsPerPage) }, (_, index) => (
            <button key={index} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}

export default GameDetails;