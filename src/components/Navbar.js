import React from 'react';
import { useAuth } from '../components/AuthContext';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Logo alineado a la izquierda */}
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="GameVault" style={{ width: '40px', marginRight: '10px' }} />
        </Link>

        {/* Botones alineados a la derecha */}
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="../pages/Explorar">Explorar</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="../pages/Coleccion">Colección</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="../pages/Recomendaciones">Recomendaciones</Link>
            </li>
            {/* Lógica para mostrar botones según el estado del usuario */}
            {currentUser ? (
              <>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={logout}>
                    Cerrar sesión
                  </button>
                </li>
                <li className="nav-item d-flex align-items-center">
                  <img
                    src={currentUser.photoURL || 'default-avatar.png'}
                    alt="Profile"
                    style={{ width: '30px', borderRadius: '50%', marginLeft: '10px' }}
                  />
                  <span className="nav-link">{currentUser.displayName}</span>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Iniciar sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registro</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
