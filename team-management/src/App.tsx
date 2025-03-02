import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TeamProvider } from './context/TeamContext';
import Navbar from './components/Navbar';
import TeamsPage from './pages/TeamsPage';
import DiagramPage from './pages/DiagramPage';
import ChartsPage from './pages/ChartsPage';
import './App.css';

const App: React.FC = () => {
  return (
    <TeamProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<TeamsPage />} />
              <Route path="/diagram" element={<DiagramPage />} />
              <Route path="/charts" element={<ChartsPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </TeamProvider>
  );
};

export default App;