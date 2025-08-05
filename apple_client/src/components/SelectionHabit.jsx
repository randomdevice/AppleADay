import React, { useEffect, useState } from 'react';
import '../styles/SelectionDisease.css';

const HabitSelector = ({ habitData, onSetType, onSetLevel }) => {
  // Get all unique "type" values from the habitData prop.
  const uniqueTypes = Array.from(new Set(habitData.map(item => item.type)));

  // State hooks for the selected values in each dropdown.
  const [selectedType, setSelectedType] = useState(uniqueTypes[0] || '');
  const [selectedLevel, setSelectedLevel] = useState('Obese');

  // Effect to handle initialization and changes to the selected type.
  useEffect(() => {
    // Filter the habitData to find all levels for the currently selected type.
    const levelsForType = habitData
      .filter(item => item.type === selectedType)
      .map(item => item.level);

    // Set the selected level to the first available level for the new type.
    setSelectedLevel(levelsForType[0] || '');

  }, [selectedType, habitData]); // Rerun this effect whenever selectedType or habitData changes.

  // Handle changes in the "type" select dropdown.
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  // Handle changes in the "level" select dropdown.
  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  // Handle the "View Results" button click.
  const handleViewResultsClick = () => {
    // Call the parent's function, passing the selected values as an object.
    onSetType(selectedType);
    onSetLevel(selectedLevel);
  };

  // Get the levels for the currently selected type to populate the second dropdown.
  const levelsForSelectedType = habitData
    .filter(item => item.type === selectedType)
    .map(item => item.level);

  const isButtonDisabled = !selectedType || !selectedLevel;

  return (
    <div className="filter-container">
      <div className="filter-group">
          <label htmlFor="habit-type-select">
            Select Habit Type:
          </label>
          <select
            id="habit-type-select"
            className='custom-select'
            value={selectedType}
            onChange={handleTypeChange}
          >
            {uniqueTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
      </div>
      <div className='filter-group'>
          <label htmlFor="habit-level-select">
            Select Habit Level:
          </label>
          <select
            id="habit-level-select"
            value={selectedLevel}
            onChange={handleLevelChange}
            className='custom-select'
          >
            {levelsForSelectedType.map((level, index) => (
              <option key={index} value={level}>
                {level}
              </option>
            ))}
          </select>
      </div>

      {/* Button to view results */}
      <div className="filter-actions">
        <button
          onClick={handleViewResultsClick}
          disabled={isButtonDisabled}
          className={`
            view-button
          `}
        >
          View Results
        </button>
      </div>
    </div>
  );
};

export default HabitSelector;
