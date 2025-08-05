import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import StateOverview from './pages/StateOverview';
import DiseaseExplorer from './pages/DiseaseExplorer';
import StateComparison from './pages/StateComparison';
import DeepDiveState from './pages/DeepDiveState';
import Footer from './components/Footer';
import HabitExplorer from './pages/HabitExplorer';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<StateOverview />} />
        <Route path="/explore/habit" element={<HabitExplorer/>} />
        //<Route path="/explore" element={<DiseaseExplorer />} />
        //<Route path="/compare" element={<StateComparison />} />
        //<Route path="/deepdive" element={<DeepDiveState />} />
      </Routes>
      <Footer />
    </>
  );
}

