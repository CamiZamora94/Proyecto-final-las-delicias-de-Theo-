import { getHeaders } from "./api";

const API_URL = "http://localhost:5000/api/productos";

export const getProductos = () =>
  fetch(API_URL, {
    headers: getHeaders(),
  }).then((res) => res.json());

export const getProductoById = (id) =>
  fetch(`${API_URL}/${id}`, {
    headers: getHeaders(),
  }).then((res) => res.json());

export const createProducto = (producto) =>
  fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(producto),
  }).then((res) => res.json());

// Útil para cargar toda la lista de insumos de una vez
export const createBulkProductos = (lista) =>
  fetch(`${API_URL}/bulk`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(lista),
  }).then((res) => res.json());

export const updateProducto = (id, data) =>
  fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const eliminarProducto = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return await response.json();
};
