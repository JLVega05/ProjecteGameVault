import React from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import GameItem from './GameItem';

const GameGrid = ({ games, addToCollection }) => {
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 8 + columnIndex; 
    if (index >= games.length) return null;
    return (
      <div style={style} data-index={index}>
        <GameItem game={games[index]} addToCollection={addToCollection} />
      </div>
    );
  };

  return (
    <div className="game-list">
      <Grid
        columnCount={8} 
        columnWidth={180}
        height={Math.ceil(games.length / 8) * 300} 
        rowCount={Math.ceil(games.length / 8)} 
        rowHeight={300}
        width={1440} 
      >
        {Cell}
      </Grid>
    </div>
  );
};

export default GameGrid;
