import { useEffect, useState } from 'react';
import { getProductos, eliminarProducto } from '../services/productos.service.js';


export const Inventario = () => { 
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarInventario = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto/insumo?")) {
      try {
        await eliminarProducto(id);
        setProductos(productos.filter(p => p.id !== id));
      } catch (error) {
        alert("No se pudo eliminar");
      }
    }
  };

  if (loading) return <p>Cargando inventario de pastelería...</p>;

  return (
    <div className="inventario-container">
      <h2>Gestión de Stock e Insumos</h2>
      <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Unidad</th>
            <th>Costo Unit.</th>
            <th>Precio Venta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.nombre}</td>
              <td>{prod.tipo}</td>
              <td>{prod.unitario || prod.unidad}</td>
              <td>${prod.costo_unitario}</td>
              <td>{prod.vendible ? `$${prod.precio_venta}` : 'N/A'}</td>
              <td>
                <button onClick={() => handleEliminar(prod.id)} style={{ color: 'red' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
