const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors()); // Permitir solicitudes desde el frontend

// Configurar la clave y URL base de RAWG
const API_KEY = "88bc76460cbc47a5bad5317e0bae8846";
const BASE_URL = 'https://api.rawg.io/api';

// Ruta para buscar juegos
app.get('/api/games', async (req, res) => {
  const { genre, page = 1 } = req.query;
  try {
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        key: API_KEY,
        genres: genre,
        page,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener juegos:', error.message);
    res.status(500).json({ error: 'Error al obtener juegos' });
  }
});

// Servidor escuchando en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
