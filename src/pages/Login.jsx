import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { Form, Button, Alert } from 'react-bootstrap';
import '../styles/Signup.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await login(email, password);
      setSuccess('Sessió iniciada correctament!');
    } catch (error) {
      setError('Error en iniciar sessió: ' + error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="signup-title text-center mb-4">Iniciar Sessió</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id="email" className="mb-3">
            <Form.Label>Correu electrònic</Form.Label>
            <Form.Control
              type="email"
              placeholder="Introdueix el teu correu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group id="password" className="mb-3">
            <Form.Label>Contrasenya</Form.Label>
            <Form.Control
              type="password"
              placeholder="Introdueix la teva contrasenya"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="signup-btn w-100 mt-4">
            Iniciar Sessió
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
