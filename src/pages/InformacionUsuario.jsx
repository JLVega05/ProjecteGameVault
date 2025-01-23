import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";  
import { doc, getDoc, collection, getDocs } from "firebase/firestore";  
import { useAuth } from "../components/AuthContext";
import axios from "axios";
import "../styles/InformacionUsuario.css";
import GameGrid from "../components/GameGrid";

const InformacionUsuario = () => {
  const { currentUser } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [coleccionCount, setColeccionCount] = useState(0);
  const [registroDate, setRegistroDate] = useState("");
  const [generosFavoritos, setGenerosFavoritos] = useState([]);
  const [coleccionJuegos, setColeccionJuegos] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const obtenerDatosUsuario = async () => {
        try {
          const usuarioRef = doc(db, "users", currentUser.uid);  
          const docSnap = await getDoc(usuarioRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUsuario(userData);

            const juegosRef = collection(db, "users", currentUser.uid, "games"); 
            const juegosSnap = await getDocs(juegosRef);
            setColeccionCount(juegosSnap.size); 

            const juegos = juegosSnap.docs.map(doc => doc.data());
            setColeccionJuegos(juegos);

            const fechaRegistro = new Date(userData.createdAt).toLocaleDateString();
            setRegistroDate(fechaRegistro);

            const generosCount = {};
            juegos.forEach(juego => {
              juego.genres.forEach(genero => {
                if (generosCount[genero]) {
                  generosCount[genero]++;
                } else {
                  generosCount[genero] = 1;
                }
              });
            });

            const generos = Object.keys(generosCount);
            if (generos.length > 0) {
              fetchGenerosFavoritos(generos);
            } else {
              setGenerosFavoritos([]);
            }
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

  const fetchGenerosFavoritos = async (generos) => {
    try {
      const response = await axios.get("https://api.rawg.io/api/genres", {
        params: { key: "88bc76460cbc47a5bad5317e0bae8846" }
      });
      const allGenres = response.data.results;
      const favoriteGenres = allGenres.filter(genre => generos.includes(genre.id.toString()));
      setGenerosFavoritos(favoriteGenres);
    } catch (error) {
      console.error("Error al obtener los géneros favoritos:", error);
    }
  };

  return (
    <div className="informacion-usuario-page">
      {usuario ? (
        <div>
          <section className="informacion-usuario">
            <h2>Información del Usuario</h2>
            <p className="value"><strong>Nombre de Usuario:</strong> {usuario.username || currentUser.displayName}</p>
            <p className="value"><strong>Colección de Juegos:</strong> {coleccionCount} juegos</p>
            <p className="value"><strong>Fecha de Registro:</strong> {registroDate}</p>
            <div className="generos-favoritos">
              <h3>Géneros Favoritos</h3>
              <p className="value">
                {generosFavoritos.length > 0
                  ? generosFavoritos.map(genero => genero.name).join(", ")
                  : "No hay géneros favoritos disponibles"}
              </p>
            </div>
          </section>
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

export default InformacionUsuario;