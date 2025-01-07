import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { Container, Card, Button } from 'react-bootstrap';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase/firebaseConfig';

const Usuario = () => {
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const fetchUserInfo = async () => {
        const db = getFirestore();
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        } else {
          console.log('No se encontró el documento del usuario');
        }
        setLoading(false);
      };

      fetchUserInfo();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div>Cargando...</div>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <Card>
          <Card.Body>
            <Card.Title>Perfil de Usuario</Card.Title>
            <Card.Text><strong>Nombre de usuario:</strong> {userInfo?.username || 'No disponible'}</Card.Text>
            <Card.Text><strong>Correo electrónico:</strong> {currentUser?.email}</Card.Text>
            <Button variant="primary" onClick={() => alert('Funcionalidad para editar aún no implementada')}>
              Editar Perfil
            </Button>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Usuario;
