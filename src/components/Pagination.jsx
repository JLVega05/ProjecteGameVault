import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {pageNumbers.map(number => (
        <button key={number} onClick={() => paginate(number)}>
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
