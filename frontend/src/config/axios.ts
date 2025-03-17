import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export default api;
//^ Creamos un archivo axios.ts en la carpeta config y exportamos una instancia de axios con la URL de la API
