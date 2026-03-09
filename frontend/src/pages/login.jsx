import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir tras el login
import { login } from '../services/auth.service';

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Actualiza el estado cuando el usuario escribe
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(credentials);
      
      if (data.token) {
        // Si el login es exitoso, redirigimos al Resumen o Inventario
        navigate('/resumen'); 
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="login-container">
      <h2>Panel de Gestión - Pastelería</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={credentials.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            name="password" 
            value={credentials.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
