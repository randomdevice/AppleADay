import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HabitSelector from '../components/SelectionHabit';
import DataCard from '../components/DataCard';
import config from '../config.json';

// US topoJSON
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const HabitExplorer = () => {
  const [habitData, setHabitData] = useState([]);
  const [inputLevel, setInputLevel] = useState([]);
  const [inputType, setInputType] = useState([]);
  const [agePopData, setAgePopData] = useState({});
  const [genderPopData, setGenderPopData] = useState({});
  const [ethnicityPopData, setEthnicityPopData] = useState({});
  const [agePopDataPos, setAgePopDataPos] = useState({});
  const [genderPopDataPos, setGenderPopDataPos] = useState({});
  const [ethnicityPopDataPos, setEthnicityPopDataPos] = useState({});

  useEffect(() => {
    // Get map data
    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/habits`)
      .then(res => { 
          setHabitData(res.data)
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/habit_correlation/population/age/negative?level=${inputLevel}`)
      .then(res => { 
          setAgePopData(res.data)
      })
      .catch(console.error);

    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/habit_correlation/population/ethnicity/negative?level=${inputLevel}`)
      .then(res => { 
          setEthnicityPopData(res.data)
      })
      .catch(console.error);

    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/habit_correlation/population/gender/negative?level=${inputLevel}`)
      .then(res => { 
          setGenderPopData(res.data)
      })
      .catch(console.error);

    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/habit_correlation/population/age/positive?category=${inputType}`)
      .then(res => { 
          setAgePopDataPos(res.data)
      })
      .catch(console.error);

    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/habit_correlation/population/ethnicity/positive?category=${inputType}`)
      .then(res => { 
          setEthnicityPopDataPos(res.data)
      })
      .catch(console.error);

    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/habit_correlation/population/gender/positive?category=${inputType}`)
      .then(res => { 
          setGenderPopDataPos(res.data)
      })
      .catch(console.error);

  }, [inputLevel]);

  return (
    <div style={{ padding: '1rem 2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Habit Explorer</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
          Get demographic data on the most affected populations of peoples organized by age, gender, and ethnicity, based on health habits or statuses.
      </p>

      <HabitSelector habitData={habitData} onSetType={setInputType} onSetLevel={setInputLevel}/>
      {/* KPI Cards */}
      <h2 style={{ textAlign: 'center' }}>Most Affected Populations based on Habit Level</h2>
      <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          gap: '1rem',
        }}>
           <DataCard data={agePopData}/>
           <DataCard data={ethnicityPopData}/>
           <DataCard data={genderPopData}/>
        </div>

      <h2 style={{ textAlign: 'center' }}>Least Affected Populations based on Habit Type</h2>
      <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          gap: '1rem',
        }}>
           <DataCard data={agePopDataPos}/>
           <DataCard data={ethnicityPopDataPos}/>
           <DataCard data={genderPopDataPos}/>
        </div>

    </div>
  );
};


export default HabitExplorer;
