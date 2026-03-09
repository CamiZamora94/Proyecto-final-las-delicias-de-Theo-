const API_URL = "http://localhost:5000/api/ventas";

export const getVentas = () => fetch(API_URL).then((res) => res.json());

export const crearVenta = (ventaData) =>
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ventaData),
  }).then((res) => res.json());

export const eliminarVenta = (id) =>
  fetch(`${API_URL}/${id}`, { method: "DELETE" });
