import { getHeaders } from "./api";

const API_URL = "http://localhost:5000/api/recetas";

export const getRecetas = () =>
  fetch(API_URL, {
    headers: getHeaders(),
  }).then((res) => res.json());

export const createReceta = (receta) =>
  fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(receta), // { nombre, producto_id }
  }).then((res) => res.json());

// Para agregar, por ejemplo, 0.500kg de un producto_id a una receta_id
export const agregarIngrediente = (detalle) =>
  fetch(`${API_URL}/ingredientes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(detalle),
  }).then((res) => res.json());

export const eliminarReceta = (id) =>
  fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });