import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HabitSelector from '../components/SelectionHabit';
import DataCard from '../components/DataCard';
import config from '../config.json';
import { scaleLinear } from 'd3-scale';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// US topoJSON
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const HabitExplorer = () => {
  const [habitData, setHabitData] = useState([]);
  const [inputLevel, setInputLevel] = useState([]);
  const [inputType, setInputType] = useState([]);
  const [mapMin, setMapMin] = useState(0);
  const [mapMax, setMapMax] = useState(1);
  const [mapData, setMapData] = useState([]);
  const [hoveredState, setHoveredState] = useState('');
  const [agePopData, setAgePopData] = useState({});
  const [genderPopData, setGenderPopData] = useState({});
  const [ethnicityPopData, setEthnicityPopData] = useState({});
  const [agePopDataPos, setAgePopDataPos] = useState({});
  const [genderPopDataPos, setGenderPopDataPos] = useState({});
  const [ethnicityPopDataPos, setEthnicityPopDataPos] = useState({});

  useEffect(() => {
    // Get habit data
    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/habits`)
      .then(res => { 
          setHabitData(res.data)
      })
      .catch(console.error);
  }, []);

  useEffect(() => {

      // get map data
    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/map/health_metric?level=${inputLevel}`)
      .then(res => { 
          setMapData(res.data)

          const values = Object.values(res.data);
          const min = Math.min(...values);
          const max = Math.max(...values);
          setMapMin(min);
          setMapMax(max);
      })
      .catch(console.error);

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

  function colorScale(min, max, currentValue) {
    // Create a D3 linear scale.
    const myScale = scaleLinear();
  
    // Set the domain (the input range) using the min and max arguments.
    // The range (the output) is set to [0, 1] to normalize the value.
    myScale.domain([min, max]).range(['#e0f3f3', '#ca0020']);
  
    // Use the scale function to transform the currentValue and return the result.
    return myScale(currentValue);
  }
  
  const getPercentage = (state) => Math.round(mapData[state] * 100)/100;

  return (
    <div style={{ padding: '1rem 2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Habit Explorer</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
          Get demographic data on the most affected populations of peoples organized by age, gender, and ethnicity, based on health habits or statuses.
      </p>

      <HabitSelector habitData={habitData} onSetType={setInputType} onSetLevel={setInputLevel}/>

      {/* Map */}
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ width: '55%', alignItems: 'center' }}>
          <h2> Percentage {inputLevel} In {hoveredState}</h2>
          <ComposableMap projection="geoAlbersUsa">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const state = geo.properties.name;
                  const datum = getPercentage(state);
                  const fill = datum ? colorScale(mapMin, mapMax, datum) : '#EEE';

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() =>
                        setHoveredState(`${state}: ${datum ?? 'N/A'}%`)
                      }
                      onMouseLeave={() => setHoveredState('')}
                      style={{
                        default: { fill, outline: 'none' },
                        hover: { fill: '#FFD700', outline: 'none' },
                        pressed: { fill: '#FF6347', outline: 'none' },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
      </div>

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
