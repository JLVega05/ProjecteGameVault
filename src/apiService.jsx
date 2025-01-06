import axios from 'axios';

const API_URL = 'http://localhost:3000/api/games';

export const getGames = async (genre, page = 1) => {
  try {
    const response = await axios.get(API_URL, {
      params: { genre, page },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener juegos:', error.message);
    throw error;
  }
};
