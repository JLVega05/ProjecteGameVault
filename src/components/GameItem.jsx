import React from 'react';
import { Link } from 'react-router-dom';

const GameItem = React.memo(({ game, addToCollection }) => (
  <div className="game-item">
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
));

export default GameItem;
