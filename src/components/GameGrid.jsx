import React from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import GameItem from './GameItem';

const GameGrid = ({ games, addToCollection }) => {
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 6 + columnIndex;
    if (index >= games.length) return null;
    return (
      <div style={style}>
        <GameItem game={games[index]} addToCollection={addToCollection} />
      </div>
    );
  };

  return (
    <div className="game-list">
      <Grid
        columnCount={6}
        columnWidth={180}
        height={800}
        rowCount={Math.ceil(games.length / 6)}
        rowHeight={300}
        width={1080}
      >
        {Cell}
      </Grid>
    </div>
  );
};

export default GameGrid;
