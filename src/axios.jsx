import axios from "axios";

// Configuración de Axios
const instance = axios.create({
  baseURL: 'https://api.rawg.io',
  timeout: 5000, // Timeout de 5 segundos
});

// Realizando una solicitud GET
const fetchGenres = async () => {
  try {
    const response = await instance.get('/api/genres', {
      params: {
        key: 'YOUR_API_KEY', // Asegúrate de tener la clave correcta
      },
    });
    console.log(response.data);
  } catch (err) {
    console.error("Error de red:", err.message);
  }
};
export default instance;