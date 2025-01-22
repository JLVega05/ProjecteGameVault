import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";  
import { doc, getDoc, collection, getDocs } from "firebase/firestore";  
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/InformacionUsuario.css";
import GameGrid from "../components/GameGrid";

const PerfilUsuario = () => {
  const { userId } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [coleccionCount, setColeccionCount] = useState(0);
  const [registroDate, setRegistroDate] = useState("");
  const [generosFavoritos, setGenerosFavoritos] = useState([]);
  const [coleccionJuegos, setColeccionJuegos] = useState([]);

  useEffect(() => {
    if (userId) {
      
      const obtenerDatosUsuario = async () => {
        try {
          
          const usuarioRef = doc(db, "users", userId);  
          const docSnap = await getDoc(usuarioRef);

          if (docSnap.exists()) {
            setUsuario(docSnap.data());

            
            const juegosRef = collection(db, "users", userId, "games"); 
            const juegosSnap = await getDocs(juegosRef);
            setColeccionCount(juegosSnap.size); 

            const juegos = juegosSnap.docs.map(doc => doc.data());
            setColeccionJuegos(juegos);

            
            const fechaRegistro = new Date(docSnap.data().createdAt).toLocaleDateString();
            setRegistroDate(fechaRegistro);

            const generos = docSnap.data().favoriteGenres || [];
            fetchGenerosFavoritos(generos);
          } else {
            console.log("No se encontró el documento");
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      };

      obtenerDatosUsuario();
    }
  }, [userId]);

  const fetchGenerosFavoritos = async (generos) => {
    try {
      const response = await axios.get("https://api.rawg.io/api/genres", {
        params: { key: "88bc76460cbc47a5bad5317e0bae8846" }
      });
      const allGenres = response.data.results;
      const favoriteGenres = allGenres.filter(genre => generos.includes(genre.id));
      setGenerosFavoritos(favoriteGenres);
    } catch (error) {
      console.error("Error al obtener los géneros favoritos:", error);
    }
  };

  return (
    <div className="informacion-usuario-page">
      {usuario ? (
        <div>
          <h2>Información del Usuario</h2>
          <p><strong>Nombre de Usuario:</strong> {usuario.username}</p>
          <p><strong>Colección de Juegos:</strong> {coleccionCount} juegos</p>
          <p><strong>Fecha de Registro:</strong> {registroDate}</p>
          <div className="generos-favoritos">
            <h3>Géneros Favoritos</h3>
            <ul>
              {generosFavoritos.map((genero, index) => (
                <li key={index}>{genero.name}</li>
              ))}
            </ul>
          </div>
          <div className="coleccion-juegos">
            <h3 className="coleccion-titulo">Colección de Juegos</h3>
            <GameGrid games={coleccionJuegos} />
          </div>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default PerfilUsuario;
