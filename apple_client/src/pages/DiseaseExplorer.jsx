import React, { useEffect, useState } from 'react';
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
import DiseaseSelector from '../components/SelectionDisease';
import config from '../config.json';
import DataTable from '../components/DisplayTable';
// import your charting library

const DiseaseExplorer = () => {
  const [habitData, setHabitData] = useState([]);
  const [chartInput, setChartInput] = useState('Any Cancer');
  const [chartData, setChartData] = useState([]);
  const [nationChartData, setNationChartData] = useState([]);
  const [selectedState, setSelectedState] = useState('All States');
  const [top5Data, setTop5Data] = useState([]);

  useEffect(() => {
    // Fetch disease data
    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/diseases`)
      .then(res => { 
          setHabitData(res.data)
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Fetch trend data
    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/trends/national/disease?subtype=${chartInput}`)
      .then(res => { 
          const preprocess = res.data.map(item => {
            const rounded = parseFloat(item.nationalaverage.toFixed(3));
            return {
                ...item,
                nationalaverage: rounded,
            }
          });
          setNationChartData(preprocess)
      })
      .catch(console.error);

    // Fetch states trend data
    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/trends/states/disease?subtype=${chartInput}&state=${selectedState}`)
      .then(res => { 
          const preprocess = res.data.map(item => {
            const rounded = parseFloat(item.stateaverage.toFixed(3));
            return {
                ...item,
                nationalaverage: rounded,
            }
          });
          console.log(preprocess);
          setChartData(preprocess)
      })
      .catch(console.error);

    // Fetch Top 5 states for the selected disease
    axios.get(`http://${config.server_host}:${config.server_port}/api/v1/kpi/top_state/disease?subtype=${chartInput}&top=5`)
      .then(res => {
          setTop5Data(res.data);
      })
      .catch(console.error);
  }, [chartInput, selectedState]);

  return (
    
  <div style={{ padding: '1rem 2rem' }}>
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ textAlign: 'center' }}>Disease Explorer</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>
        What's the most common disease in your state? How does it compare to the national average? Explore the data to find out!
      </p>
      <DiseaseSelector diseaseData={habitData} onViewResults={setChartInput} stateSet={setSelectedState} />
    </div>      
      {/* Trends */}
      <div style={{ marginTop: '3rem' }}>
        <h2>Trends of {chartInput} in {selectedState}</h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          gap: '20px', // Corrected the typo
          alignItems: 'flex-start',
          padding: '20px' // Optional: adds space from the edge of the screen
        }}>
          <div style={{ flex: 1, minWidth: '300px', maxWidth: '600px' }}>
            <DiseaseChart
              chartData={selectedState === 'All States' ? nationChartData : chartData}
              title={chartInput + " Mortality"}
              states={selectedState}
            />
          </div>
          <div style={{ flex: 1, minWidth: '300px', maxWidth: '600px' }}>
            <DataTable data={top5Data} diseaseType={chartInput} />
          </div>
        </div>
    </div>
  </div>
  );
};

// Add 'title' to the props destructuring
const DiseaseChart = ({ chartData, title, states }) => {
  if (!chartData || chartData.length === 0) {
    return <p>No data to display for the chart.</p>;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center' }}> {/* Added div for centering title */}
      <h2>{title}</h2> {/* Display the title if provided */}
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
          <YAxis label={{ value: states, angle: -90, position: 'insideLeft', offset: -5 }}
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

// Case of multiple age groups or subtypes
// This chartData must contain more than one age group or subtype
const DiseaseMultipleChart = ({ chartData, title, states }) => {
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
          <YAxis label={{ value: states, angle: -90, position: 'insideLeft', offset: -5 }}
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

export default DiseaseExplorer;
