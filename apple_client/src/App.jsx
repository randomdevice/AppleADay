import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import StateOverview from './pages/StateOverview';
import DiseaseExplorer from './pages/DiseaseExplorer';
import Footer from './components/Footer';
import HabitExplorer from './pages/HabitExplorer';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<StateOverview />} />
        <Route path="/explore/habit" element={<HabitExplorer/>} />
        <Route path="/explore/disease" element={<DiseaseExplorer />} />
      </Routes>
      <Footer />
    </>
  );
}

