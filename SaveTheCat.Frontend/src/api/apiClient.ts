import axios from 'axios';

// 1. Define la URL base de tu API
// (La obtuvimos de launchSettings.json)
const API_BASE_URL = 'http://localhost:5079/api';

// 2. Crea una instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. ¡La parte MÁGICA! Un interceptor para adjuntar el token JWT
// Esto se ejecutará ANTES de cada petición.
apiClient.interceptors.request.use(
  (config) => {
    // Obtiene el token de localStorage (que guardaremos al hacer login)
    const token = localStorage.getItem('jwtToken');
    
    if (token) {
      // Si el token existe, lo añade a los headers
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Maneja errores de la petición
    return Promise.reject(error);
  }
);

export default apiClient;