import React from 'react';
import { Button } from 'react-bootstrap';
import '../styles/Home.css';
import logo from '../assets/images/logo.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext.jsx';

function Home() {
  const { currentUser } = useAuth();
  return (
    <div className="hero-container">
      <div className="hero-content-left">
        <h1>¡Organiza tus juegos y descubre recomendaciones!</h1>
        <p>GameVault es un lugar donde organizar tu colección de videojuegos y recibir recomendaciones personalizadas solo para ti.</p>
      </div>
      <div className="hero-logo">
        <img src={logo} alt="GameVault Logo" />
      </div>
      <div className="hero-content-right">
        {currentUser ? (
          <>
            <h2>¡Bienvenid@ de nuevo, {currentUser.displayName || "Usuario"}!</h2> 
            <Link to="/coleccion">
              <Button className="btn-coleccion" size="lg">
                Ir a mi colección
              </Button>
            </Link>
          </>
        ) : (
          <>
            <h2>¿Aún no estás registrado? ¡Haz click aquí!</h2>
            <Link to="/signup"> 
              <Button className="btn-register" size="lg">
                REGISTRARSE
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
export default Home;