import React from 'react';

// KPI Card Component
const KPICard = ({ title, value }) => (
    <div style={{
      flex: 1,
      background: '#116466',
      padding: '1rem',
      borderRadius: '10px',
      textAlign: 'center',
    }}>
      <h4 style={{ marginBottom: '0.5rem' }}>{title}</h4>
      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{value}</div>
    </div>
  );

export default KPICard;