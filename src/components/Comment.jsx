import React from 'react';
import { Link } from 'react-router-dom';

const Comment = ({ comment, currentUser, handleEdit, handleDelete, handleVote, editingCommentId, setEditingCommentId, editedComment, setEditedComment, editedRating, setEditedRating, formatDate }) => (
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
        <button onClick={() => handleEdit(comment.id)}>Guardar</button>
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
            <button onClick={() => handleDelete(comment.id)}>Eliminar</button>
          </>
        )}
      </>
    )}
  </div>
);

export default Comment;
