// Logout.js
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Button, Container, Alert } from 'react-bootstrap';
 
const Logout = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { logout } = useAuth();
 
  const handleLogout = async () => {
    setError('');
    setSuccess('');
 
    try {
      await logout();
      setSuccess('Sessió tancada amb èxit!');
    } catch (error) {
      setError('Error en tancar sessió: ' + error.message);
    }
  };
 
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Tancar Sessió</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Button onClick={handleLogout} className="w-100" variant="secondary">
          Tancar Sessió
        </Button>
      </div>
    </Container>
  );
};
 
export default Logout;
