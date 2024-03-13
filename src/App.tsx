import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import TopTracksPage from './TopTracksPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/top-tracks" element={<TopTracksPage />} />
      </Routes>
    </Router>
  );
};

export default App;