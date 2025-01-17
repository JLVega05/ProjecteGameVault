import React from 'react';

const Filter = ({ label, options, selectedOption, handleChange }) => (
  <div className="filter-container">
    <div className="filter-label">{label}</div>
    <select onChange={handleChange} value={selectedOption}>
      <option value="">Cualquiera</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>{option.name}</option>
      ))}
    </select>
  </div>
);

export default Filter;
