import React from 'react';
import { Button } from 'react-bootstrap';
import './HeroSection.css';

function HeroSection() {
  return (
    
    <div className='hero-container'>
      <h1>¡Organiza tus juegos y descubre recomendaciones!</h1>
      <p>GameVault es un lugar donde organizar tu colección de videojuegos y recibir recomendaciones personalizadas solo para ti.</p>
      <div className='hero-btns'>
        <Button className='btns' 
          variant="outline-light" 
          size="lg"
        >
          REGISTRARSE
        </Button>
        <Button className='btns'
          variant="primary"
          size="lg"
        >
          INICIAR SESIÓN
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
