import React from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import '../styles/Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
      <div className="container-fluid">
        {/* Logo alineado a la izquierda */}
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="GameVault" className="navbar-logo" />
        </Link>

        {/* Botones alineados a la derecha */}
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/explorar">Explorar</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/coleccion">Colección</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/recomendaciones">Recomendaciones</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/buscarusuario">Buscar Usuario</Link>
            </li>
            {currentUser ? (
              <>
                <li className="nav-item">
                  {/* Enlace al perfil del usuario */}
                  <Link to="/informacionusuario" className="nav-link user-name">
                    {currentUser.displayName}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link session-btn-navbar" onClick={logout}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <div className="d-flex">
                  <Link className="nav-link session-btn-navbar" to="/signup">Registrarse</Link>

                  <Link className="nav-link session-btn-navbar ms-2" to="/Login">Iniciar sesión</Link>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
