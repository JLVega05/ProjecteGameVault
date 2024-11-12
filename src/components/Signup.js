// Signup.js
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Form, Button, Container } from 'react-bootstrap';
import Notification from './Notification';
 
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signup } = useAuth();
  const [showNotification, setShowNotification] = useState(false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
 
    try {
      await signup(email, password);
      setSuccess('Usuari registrat amb èxit!');
      setShowNotification(true);
    } catch (error) {
      setError('Error en el registre: ' + error.message);
      setShowNotification(true);
    }
  };
 
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Registra't</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group id="email">
            <Form.Label>Correu electrònic</Form.Label>
            <Form.Control
              type="email"
              placeholder="Introdueix el teu correu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group id="password" className="mt-3">
            <Form.Label>Contrasenya</Form.Label>
            <Form.Control
              type="password"
              placeholder="Introdueix la teva contrasenya"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100 mt-4" variant="primary">
            Registrar-se
          </Button>
        </Form>
 
        {/* Notificació amb el missatge d'èxit o error */}
        <Notification
          message={success || error}
          variant={success ? 'success' : 'danger'}
          show={showNotification}
          onClose={() => setShowNotification(false)}
        />
      </div>
    </Container>
  );
};
 
export default Signup;
