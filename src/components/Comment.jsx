import React from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig.jsx';
import { doc, updateDoc, deleteDoc, addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';

const Comment = ({ comment, currentUser, comments, setComments, editingCommentId, setEditingCommentId, editedComment, setEditedComment, editedRating, setEditedRating, formatDate }) => {
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

  return (
    <div className="comment">
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
  );
};

export default Comment;
