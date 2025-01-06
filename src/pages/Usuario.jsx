import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';  // Para obtener el usuario actual
import { Container, Card, Button } from 'react-bootstrap';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase/firebaseConfig';  // Ruta a tu configuración de Firebase

const UserProfile = () => {
  const { currentUser } = useAuth();  // Obtener el usuario actual desde el AuthContext
  const [userInfo, setUserInfo] = useState(null);  // Estado para almacenar la información del usuario
  const [loading, setLoading] = useState(true);  // Estado de carga

  useEffect(() => {
    if (currentUser) {
      // Obtén la información del usuario desde Firestore (si existe)
      const fetchUserInfo = async () => {
        const db = getFirestore();
        const userRef = doc(db, 'users', currentUser.uid);  // Asumiendo que tienes una colección 'users'
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        } else {
          console.log('No se encontró el documento del usuario');
        }
        setLoading(false);  // Termina el loading
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
            {/* Aquí puedes agregar más datos si tienes más campos en Firestore */}
            
            <Button variant="primary" onClick={() => alert('Funcionalidad para editar aún no implementada')}>
              Editar Perfil
            </Button>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default UserProfile;
