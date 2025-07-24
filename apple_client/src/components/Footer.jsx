import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#1a1a1a',
      color: '#ccc',
      padding: '2rem',
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Health Dashboard</strong> — Insights on population health across U.S. states.
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Link to="/" style={{ margin: '0 1rem', color: '#4ecdc4' }}>Overview</Link>
        <Link to="/disease" style={{ margin: '0 1rem', color: '#4ecdc4' }}>Disease Explorer</Link>
        <Link to="/compare" style={{ margin: '0 1rem', color: '#4ecdc4' }}>Compare States</Link>
      </div>

      <div style={{ fontSize: '0.9rem', color: '#888' }}>
        Data from CDC Behavioral Risk Factor Surveillance System (BRFSS) and other sources. <br />
        © {new Date().getFullYear()} Your Institution or Team Name
      </div>
    </footer>
  );
};

export default Footer;
