import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HabitSelector from '../components/SelectionHabit';
import DataCard from '../components/DataCard';
import config from '../config.json';

// US topoJSON
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const HabitExplorer = () => {
  const [habitData, setHabitData] = useState([]);
  const [queryValue, setQueryValue] = useState([]);
  const [agePopData, setAgePopData] = useState({});
  const [genderPopData, setGenderPopData] = useState({});
  const [ethnicityPopData, setEthnicityPopData] = useState({});

  useEffect(() => {
    // Get map data
    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/habits`)
      .then(res => { 
          setHabitData(res.data)
      })
      .catch(console.error);

    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/habit_correlation/population/age?level=Obese`)
      .then(res => { 
          setAgePopData(res.data)
      })
      .catch(console.error);

    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/habit_correlation/population/ethnicity?level=Obese`)
      .then(res => { 
          setEthnicityPopData(res.data)
      })
      .catch(console.error);

    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/habit_correlation/population/gender?level=Obese`)
      .then(res => { 
          setGenderPopData(res.data)
      })
      .catch(console.error);

  }, []);

  useEffect(() => {
    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/habit_correlation/population/age?level=${queryValue}`)
      .then(res => { 
          setAgePopData(res.data)
      })
      .catch(console.error);

    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/habit_correlation/population/ethnicity?level=${queryValue}`)
      .then(res => { 
          setEthnicityPopData(res.data)
      })
      .catch(console.error);

    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/habit_correlation/population/gender?level=${queryValue}`)
      .then(res => { 
          setGenderPopData(res.data)
      })
      .catch(console.error);

  }, [queryValue]);

  return (
    <div style={{ padding: '1rem 2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Habit Explorer</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
          Get demographic data on the most affected populations of peoples organized by age, gender, and ethnicity, based on health habits or statuses.
      </p>

      <HabitSelector habitData={habitData} onViewResults={setQueryValue}/>
      {/* KPI Cards */}
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

    </div>
  );
};


export default HabitExplorer;
