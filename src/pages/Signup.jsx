import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { Form, Button, Container } from 'react-bootstrap';
import Notification from '../components/Notification';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../firebase/firebaseConfig';  // Ruta de tu configuración de Firebase
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  // Importamos useNavigate
import '../styles/Signup.css'

// Función para guardar el perfil en Firestore
const saveUserProfile = async (uid, username, email) => {
  const db = getFirestore();
  try {
    await setDoc(doc(db, 'users', uid), {
      username: username,
      email: email,
      uid: uid,
      createdAt: new Date().toISOString(),  // Agrega la fecha de creación
    });
  } catch (error) {
    throw new Error('Error al guardar el perfil de usuario: ' + error.message);
  }
};

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');  // Estado para el nombre de usuario
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();  // Inicializamos el hook useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Registro con nombre de usuario, email y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizar el perfil del usuario con el nombre de usuario
      await updateProfile(user, { displayName: username });

      // Guardar el perfil en Firestore
      await saveUserProfile(user.uid, username, email);

      setSuccess('Usuario registrado correctamente!');
      setShowNotification(true);

      // Redirigir a la página de login
      navigate('/login');  // Redirigimos a la página de login

      // Cerrar sesión automáticamente para evitar que se inicie sesión
      await auth.signOut();  // Desconectamos al usuario inmediatamente después de registrarse
    } catch (error) {
      setError('Error en el registro: ' + error.message);
      setShowNotification(true);
    }
  };

  return (
    <container className="signup-container d-flex justify-content-center align-items-center">
      <div className="signup-form">
        <h2 className="signup-title text-center mb-4">Regístrate</h2>
        <Form onSubmit={handleSubmit}>
          {/* Campo para el nombre de usuario */}
          <Form.Group id="username" className="mb-3">
            <Form.Label>Nombre de usuario</Form.Label>
            <Form.Control
              className="signup-input"
              type="text"
              placeholder="Ingresa tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          {/* Campo para el correo electrónico */}
          <Form.Group id="email" className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              className="signup-input"
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          {/* Campo para la contraseña */}
          <Form.Group id="password" className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              className="signup-input"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {/* Botón para registrar */}
          <Button type="submit" className="signup-btn w-100 mt-4">
            Registrar
          </Button>
        </Form>

        {/* Notificación con el mensaje de éxito o error */}
        <Notification
          message={success || error}
          variant={success ? 'success' : 'danger'}
          show={showNotification}
          onClose={() => setShowNotification(false)}
        />
      </div>
      </container>
  );
};

export default Signup;
