import React from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import GameItem from './GameItem';

const GameGrid = ({ games, addToCollection }) => {
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 8 + columnIndex; // Adjusted to 8 columns
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
        columnCount={8} // Adjusted to 8 columns
        columnWidth={180}
        height={Math.ceil(games.length / 8) * 300} // Adjusted based on the number of columns
        rowCount={Math.ceil(games.length / 8)} // Adjusted based on the number of columns
        rowHeight={300}
        width={1440} // Adjusted width to accommodate more columns
      >
        {Cell}
      </Grid>
    </div>
  );
};

export default GameGrid;
