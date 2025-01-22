import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Explorar from './pages/Explorar.jsx';
import Coleccion from './pages/Coleccion.jsx';
import GameDetails from './pages/GameDetails.jsx';
import Recomendaciones from './pages/Recomendaciones.jsx';
import InformacionUsuario from './pages/InformacionUsuario.jsx';
import PerfilUsuario from './pages/PerfilUsuario.jsx';
import BuscarUsuario from './pages/BuscarUsuario.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/explorar" element={<Explorar />} />
          <Route path="/coleccion" element={<Coleccion />} />
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/recomendaciones" element={<Recomendaciones />} />
          <Route path="/informacionusuario" element={<InformacionUsuario />} />
          <Route path="/perfil-usuario/:userId" element={<PerfilUsuario />} />
          <Route path="/buscarusuario" element={<BuscarUsuario />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
