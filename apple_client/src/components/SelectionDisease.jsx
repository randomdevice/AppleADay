import React, { useEffect, useState } from 'react';
import '../styles/SelectionDisease.css';

const StateList = [
  'All States', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
  'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska','Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
  'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];
const DiseaseSelector = ({ diseaseData, onViewResults, stateSet }) => {
  // Get all unique "type" values from the diseaseData prop.
  const uniqueTypes = Array.from(new Set(diseaseData.map(item => item.type)));

  // State hooks for the selected values in each dropdown.
  const [selectedType, setSelectedType] = useState(uniqueTypes[0] || '');
  const [selectedLevel, setSelectedLevel] = useState('Obese');
  const [selectedState, setSelectedState] = useState('All States');

  // Effect to handle initialization and changes to the selected type.
  useEffect(() => {
    // Filter the habitData to find all levels for the currently selected type.
    const levelsForType = diseaseData
      .filter(item => item.type === selectedType)
      .map(item => item.level);

    // Set the selected level to the first available level for the new type.
    setSelectedLevel(levelsForType[0] || '');

  }, [selectedType, diseaseData]); // Rerun this effect whenever selectedType or diseaseData changes.

  // Handle changes in the "type" select dropdown.
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  // Handle changes in the "level" select dropdown.
  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  // Handle changes in the "state" select dropdown.
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  // Handle the "View Results" button click.
  const handleViewResultsClick = () => {
    // Call the parent's function, passing the selected values as an object.
    onViewResults(selectedLevel);
    // Optionally, you can also pass the selected state if needed.
    stateSet(selectedState);
  };

  // Get the levels for the currently selected type to populate the second dropdown.
  const levelsForSelectedType = diseaseData
    .filter(item => item.type === selectedType)
    .map(item => item.level);

  const isButtonDisabled = !selectedType || !selectedLevel;

  return (
    <div className="filter-container">
      <div className="filter-group">
          <label htmlFor="habit-type-select">
            Select Disease Type:
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
            Select Disease Level:
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
      <div className='filter-group'>
          <label htmlFor="habit-level-select">
            Select States:
          </label>
          <select
            id="habit-level-select"
            value={selectedState}
            onChange={handleStateChange}
            className='custom-select'
          >
            {StateList.map((state, index) => (
              <option key={index} value={state}>
                {state}
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

export default DiseaseSelector;
