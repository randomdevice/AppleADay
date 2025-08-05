import React, { useState } from 'react';
import '../styles/DataCard.css';
import { HeartPulse, MapPin, Calendar, Users, FlaskConical } from 'lucide-react';

/**
 * A reusable React component to display health data in a card format.
 * It is styled with an inline CSS stylesheet for a clean and responsive look.
 *
 * @param {object} props - The props object.
 * @param {object} props.data - An object containing all the card's data.
 * @param {number} props.data.differential - The differential value.
 * @param {string} props.data.disease_subtype - The subtype of the disease.
 * @param {string} props.data.disease_type - The general type of the disease.
 * @param {string} props.data.ethnicity - The ethnicity associated with the data.
 * @param {string} props.data.state - The state the data is from.
 * @param {number} props.data.year - The year of the data.
 */
const DataCard = ({ data }) => {
  const { differential, disease_subtype, disease_type, age, sex, ethnicity, state, year } = data;

  // Dynamically determine the header content and icon based on available data
  let headerContent;
  let headerIcon;
  let headerIconClass = "icon";

  if (age) {
    headerContent = `${age}`;
    headerIcon = <Calendar size={24} />;
    headerIconClass += " calendar-icon";
  } else if (sex) {
    headerContent = `${sex}`;
    headerIcon = <Users size={24} />;
    headerIconClass += " users-icon";
  } else {
    // Default to ethnicity
    headerContent = ethnicity;
    headerIcon = <Users size={24} />;
    headerIconClass += " users-icon";
  }

  return (
    <div className="card">
      {/* Header section with ethnicity and year */}
      <div className="card-header">
        <h3 className="card-title">
          {headerIcon ? React.cloneElement(headerIcon, { className: headerIconClass }) : null}
          {headerContent}
        </h3>
        <span className="card-year">
          {year}
        </span>
      </div>

      {/* Main content section with detailed information */}
      <div className="card-body">
        {/* Disease Type sub-header */}
        <div className="card-item-label">
          <HeartPulse className="icon" size={20} />
          <span>Disease Type:</span>
          <strong>{disease_type}</strong>
        </div>
        
        {/* Differential value, highlighted */}
        <div className="card-item">
          <div className="card-item-label">
            <FlaskConical className="icon" size={20} />
            <span>Differential:</span>
          </div>
          <span className="card-item-value">{Math.round(differential * 100) / 100}%</span>
        </div>
        
        {/* Disease Subtype */}
        <div className="card-list-item">
          <span className="bullet"></span>
          <span>{disease_subtype}</span>
        </div>

        {/* Location details */}
        <div className="card-footer">
          <div className="card-footer-item">
            <MapPin className="icon" size={16} />
            <span>State: <strong>{state}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCard;
