import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate(); 

  return (
    <div style={styles.container}>
      <h1>Welcome to GameVault!</h1>
      <p>Choose an option below:</p>
      <button style={styles.button} onClick={() => navigate('/login')}>
        Login
      </button>
      <button style={styles.button} onClick={() => navigate('/register')}>
        Register
      </button>
    </div>
  );
};

// Estilos básicos
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    transition: 'background-color 0.3s',
  },
};

export default Welcome;
