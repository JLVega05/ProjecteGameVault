import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";  // Asegúrate de que la ruta sea correcta
import { doc, getDoc, collection, getDocs } from "firebase/firestore";  // Asegúrate de importar getDocs también
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/InformacionUsuario.css";

const InformacionUsuario = () => {
  const { currentUser } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [coleccionCount, setColeccionCount] = useState(0);
  const [registroDate, setRegistroDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      // Obtener datos de Firestore para el usuario
      const obtenerDatosUsuario = async () => {
        try {
          // Cambiar la referencia de 'usuarios' a 'users'
          const usuarioRef = doc(db, "users", currentUser.uid);  // Cambié 'usuarios' por 'users'
          const docSnap = await getDoc(usuarioRef);

          if (docSnap.exists()) {
            setUsuario(docSnap.data());

            // Acceder a la subcolección 'games' (en tu base de datos esto podría ser diferente)
            const juegosRef = collection(db, "users", currentUser.uid, "games"); // Cambié 'coleccion' por 'games'
            const juegosSnap = await getDocs(juegosRef);
            setColeccionCount(juegosSnap.size); // Cuenta los documentos en la subcolección

            // Calcular la fecha de registro del usuario
            const fechaRegistro = currentUser.metadata.creationTime;
            setRegistroDate(fechaRegistro);
          } else {
            console.log("No se encontró el documento");
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      };

      obtenerDatosUsuario();
    }
  }, [currentUser]);

  return (
    <div className="informacion-usuario-page">
      {usuario ? (
        <div>
          <h2>Información del Usuario</h2>
          <p><strong>Nombre de Usuario:</strong> {usuario.username || currentUser.displayName}</p>
          <p><strong>Colección de Juegos:</strong> {coleccionCount} juegos</p>
          <p><strong>Fecha de Registro:</strong> {new Date(registroDate).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default InformacionUsuario;
