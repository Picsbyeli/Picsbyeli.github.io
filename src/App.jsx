import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen.jsx';
import Home from './pages/Home.jsx';
import Chess from './games/Chess.jsx';
import Connect4 from './games/Connect4.jsx';
import Imposter from './games/Imposter.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chess" element={<Chess />} />
        <Route path="/connect4" element={<Connect4 />} />
        <Route path="/imposter" element={<Imposter />} />
      </Routes>
    </Router>
  );
}

export default App;
