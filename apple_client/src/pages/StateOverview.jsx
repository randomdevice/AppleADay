import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import { scaleLinear } from 'd3-scale';
import KPICard from '../components/KPICard';
import SelectionDisease from '../components/SelectionDisease';
import config from '../config.json';

// US topoJSON
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const StateOverview = () => {
  const [obesityData, setObesityData] = useState([]);
  const [hoveredState, setHoveredState] = useState('');
  const [nationalMortalityDiabetes, setNationalMortalityDiabetes] = useState({});
  const [topActiveState, setTopActiveState] = useState({});
  const [nationalInactivityRate, setNationalInactivityRate] = useState({});
  const [trendDataHeartDisease, setTrendDataHeartDisease] = useState([]);
  const [trendDataPhysicalActivity, setTrendDataPhysicalActivity] = useState([]);

  useEffect(() => {
    // Fetch default map metric: obesity
    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/map/health_metric?level=Obese`)
      .then(res => { 
          setObesityData(res.data)
      })
      .catch(console.error);

    // Fetch national KPIs
    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/national_average/disease?subtype=Diabetes`)
      .then(res => {
          setNationalMortalityDiabetes(res.data.nationalaverage.toFixed(3))
      })
      .catch(console.error);

    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/top_state/health_metric?level=Cardio%20and%20Strength`)
      .then(res => {
          setTopActiveState(res.data.state)
      })
      .catch(console.error);

    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/national_average/health_metric?level=No%20Activity`)
      .then(res => {
          setNationalInactivityRate(res.data.nationalaverage.toFixed(3))
      })
      .catch(console.error);

    // Fetch trend data
    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/trends/national/disease?subtype=Coronary%20Heart%20Disease`)
      .then(res => { 
          const preprocess = res.data.map(item => {
            const rounded = parseFloat(item.nationalaverage.toFixed(3));
            return {
                ...item,
                nationalaverage: rounded,
            }
          });
          setTrendDataHeartDisease(preprocess)
      })
      .catch(console.error);

    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/trends/national/health_metric?level=No%20Activity`)
      .then(res => { 
          const preprocess = res.data.map(item => {
            const rounded = parseFloat(item.nationalaverage.toFixed(3));
            return {
                ...item,
                nationalaverage: rounded,
            }
          });
          setTrendDataPhysicalActivity(preprocess)
      })
      .catch(console.error);
  }, []);

  const colorScale = scaleLinear()
    .domain([20, 40])
    .range(['#e0f3f3', '#ca0020']);

  //console.log(obesityData);
  const getStateObesity = (state) => Math.round(obesityData[state] * 100)/100;

  return (
    <div style={{ padding: '1rem 2rem' }}>
      <h1 style={{ textAlign: 'center' }}>US Health Overview</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
        A nationwide glance at key health metrics in the United States
      </p>

      <SelectionDisease />
      {/* KPI Cards */}
      <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '2rem 0',
          gap: '1rem',
        }}>
          <KPICard title="National Diabetes Mortality Rate" value={`${nationalMortalityDiabetes ?? 'N/A'}%`} /> 
          <KPICard title="Most Active State" value={`${topActiveState ?? 'N/A'}`} />
          <KPICard title="National Inactivity Average" value={`${nationalInactivityRate ?? 'N/A'}%`} />
        </div>

      {/* Map */}
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', gap: '2rem' }}>
        <div style={{ width: '50%' }}>
          <ComposableMap projection="geoAlbersUsa">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const state = geo.properties.name;
                  const datum = getStateObesity(state);
                  const fill = datum ? colorScale(datum) : '#EEE';

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
          {<p style={{ marginTop: '0.5rem' }}>Hovering: {hoveredState}</p>}
        </div>
      </div>

      {/* Trends */}
      <div style={{ marginTop: '3rem' }}>
        <h2>National Trends</h2>
        <div style={{
             display: 'flex',
             flexWrap: 'wrap', // Allows items to wrap if screen is too small
             justifyContent: 'space-around', // Distributes space between/around items
             gap: '1 px', // Space between the chart containers
             alignItems: 'flex-start' // Aligns items to the top if heights differ
        }}>
            <div style={{ flex: 1, minWidth: '450px' }}>
                 <TrendChart
                   chartData={trendDataHeartDisease}
                   title="Heart Disease Mortality"
                 />
            </div>
            <div style={{ flex: 1, minWidth: '450px' }}>
                <TrendChart
                  chartData={trendDataPhysicalActivity}
                  title="Physical Inactivity"
                />
            </div>
        </div>
      </div>
    </div>
  );
};

// Add 'title' to the props destructuring
const TrendChart = ({ chartData, title }) => {
  if (!chartData || chartData.length === 0) {
    return <p>No data to display for the chart.</p>;
  }

  return (
    <div style={{ textAlign: 'center' }}> {/* Added div for centering title */}
      {title && <h2>{title}</h2>} {/* Display the title if provided */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" 
                 label={{ value: "Year", position: 'insideBottom', offset: -10 }}/>
          <YAxis label={{ value: "National Average", angle: -90, position: 'insideLeft', offset: -5 }}
                 domain={['dataMin', 'auto']}/>
          <Tooltip />
          <Line
            type="monotone"
            dataKey="nationalaverage"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};



export default StateOverview;


