const API_URL = "http://localhost:5000/api/auth";

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData), // Ejemplo: { nombre, email, password }
  });
  return await response.json();
};


export const getPerfil = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token");

  const response = await fetch(`${API_URL}/perfil/usuario`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener perfil");
  }

  return await response.json();
};

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    // Verificamos si la respuesta fue exitosa (status 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en el inicio de sesión");
    }

    const data = await response.json();
    if (data.token) localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.error("Error en auth service:", error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};