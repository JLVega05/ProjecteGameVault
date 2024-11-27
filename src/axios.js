// src/axios.js
import axios from 'axios';

// Aquí puedes configurar la URL base de tu API si es la misma para todas las solicitudes
const instance = axios.create({
  baseURL: 'https://api.example.com',  // Cambia esto por la URL base de tu API
  timeout: 5000,  // Establece un tiempo máximo de espera para la solicitud (en ms)
  headers: { 'Content-Type': 'application/json' },
});

export default instance;
