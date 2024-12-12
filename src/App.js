import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup.js';
import Login from './pages/Login.js';
import Explorar from './pages/Explorar.js';
import Coleccion from './pages/Coleccion.js';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Ruta de la página de inicio */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explorar" element={<Explorar />} />
        <Route path="/coleccion" element={<Coleccion />} />
      </Routes>
    </Router>
  );
}

export default App;
