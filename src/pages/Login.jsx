import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { Form, Button } from 'react-bootstrap';
import '../styles/Signup.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      toast.success('Sessió iniciada correctament!');
      navigate('/explorar');
    } catch (error) {
      toast.error('Error en iniciar sessió: ' + error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="signup-title text-center mb-4">Iniciar Sessió</h2>
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
