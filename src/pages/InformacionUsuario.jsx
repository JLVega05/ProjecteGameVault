import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";  
import { doc, getDoc, collection, getDocs } from "firebase/firestore";  
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
      
      const obtenerDatosUsuario = async () => {
        try {
          
          const usuarioRef = doc(db, "users", currentUser.uid);  
          const docSnap = await getDoc(usuarioRef);

          if (docSnap.exists()) {
            setUsuario(docSnap.data());

            
            const juegosRef = collection(db, "users", currentUser.uid, "games"); 
            const juegosSnap = await getDocs(juegosRef);
            setColeccionCount(juegosSnap.size); 

            
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
