import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const saveUserProfile = async (uid, username, email) => {
  const db = getFirestore();
  await setDoc(doc(db, 'users', uid), {
    username,
    email,
    uid,
    createdAt: new Date().toISOString(),
  });
};

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });
      await saveUserProfile(user.uid, username, email);

      toast.success('Usuario registrado correctamente!');
      navigate('/login');

      await auth.signOut();
    } catch (error) {
      toast.error('Error en el registro: ' + error.message);
    }
  };

  return (
    <div className="signup-container d-flex justify-content-center align-items-center">
      <div className="signup-form">
        <h2 className="signup-title text-center mb-4">Regístrate</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group id="username" className="mb-3">
            <Form.Label>Nombre de usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group id="email" className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group id="password" className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" className="signup-btn w-100 mt-4">
            Registrar
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
