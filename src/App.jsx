import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Explorar from './pages/Explorar.jsx';
import Coleccion from './pages/Coleccion.jsx';

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
