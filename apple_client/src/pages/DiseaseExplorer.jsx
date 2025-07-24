import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SelectionDisease from '../components/SelectionDisease';
// import your charting library

const DiseaseExplorer = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("Alcohol");

  useEffect(() => {
    axios.get(`http://localhost:5432/api/diseases?filter=${filter}`)
      .then(res => setData(res.data));
  }, [filter]);

  return (
    
    <div style={{ textAlign: 'center' }}>
      <h1>Disease Explorer</h1>
      <SelectionDisease />
      {/* Render Chart */}
    </div>
  );
};

export default DiseaseExplorer;