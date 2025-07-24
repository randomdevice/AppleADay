import React from 'react';
import '../styles/SelectionDisease.css'; // Link to CSS file

const SelectionDisease = ({ location, topic, onLocationChange, onTopicChange, onView, onClear }) => {
  return (
    <div className="filter-container">
      <div className="filter-group">
        <label htmlFor="topic">
          Topic:
        </label>
        <select id="topic" className="custom-select" value={topic} onChange={onTopicChange}>
          <option value="Alcohol">Alcohol</option>
          <option value="Asthma">Asthma</option>
          <option value="Cancer">Cancer</option>
          <option value="Cardiovascular Disease">Cardiovascular Disease</option>
          <option value="Diabetes">Diabetes</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="topic">
          Subtopic:
        </label>
        <select id="topic" className="custom-select" value={topic} onChange={onTopicChange}>
          <option value="Alcohol">Alcohol</option>
          <option value="Asthma">Asthma</option>
          <option value="Cancer">Cancer</option>
          <option value="Cardiovascular Disease">Cardiovascular Disease</option>
          <option value="Diabetes">Diabetes</option>
        </select>
      </div>

      <div className="filter-actions">
        <button className="view-button" onClick={onView}>View Results</button>
        <a href="#" className="clear-link" onClick={onClear}>Clear</a>
      </div>
    </div>
  );
};

export default SelectionDisease;
