import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
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
  const [trendData, setTrendData] = useState({});

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
    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/trends/national/health_metric?level=Obese`)
      .then(res => { 
          setTrendData(res.data)
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
      <div style={{ display: 'flex', gap: '2rem' }}>
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
        <TrendChart
          title="Heart Disease Mortality"
          data={trendData.heart_disease}
        />
        <TrendChart
          title="Physical Inactivity"
          data={trendData.inactivity}
        />
      </div>
    </div>
  );
};

// Simple Line Chart Component (replace with chart.js / Recharts later)
const TrendChart = ({ title, data }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h4>{title}</h4>
    {data && data.length ? (
      <ul>
        {data.map((point, idx) => (
          <li key={idx}>{point.year}: {point.value}%</li>
        ))}
      </ul>
    ) : (
      <p>No data available</p>
    )}
  </div>
);

export default StateOverview;


