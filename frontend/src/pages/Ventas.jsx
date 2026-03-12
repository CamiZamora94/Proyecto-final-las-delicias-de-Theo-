import { useState, useEffect } from 'react';
import { TablaVentas } from '../components/Tabla.jsx';
import { FiltrosVentas } from '../components/FiltrosVentas.jsx';
import { ResumenVentas } from '../components/ResumenVentas.jsx';
import { ModalNuevaVenta } from '../components/ModalNuevaVenta.jsx';
import { getVentas } from '../services/ventas.service.js'; 

export const Ventas = () => {
  // --- ESTADOS ---
  const [datosVentas, setDatosVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    estado: 'todos',
    cliente: ''
  });

  // --- CARGA DE DATOS ---
  const cargarVentas = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await getVentas();
      if (Array.isArray(data)) {
        setDatosVentas(data);
      } else {
        console.error("Respuesta inesperada de la API:", data);
        setError(data.message || data.error || "No se pudieron cargar las ventas. Verifique su sesión.");
        setDatosVentas([]);
      }
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      setError("Error de conexión con el servidor");
      setDatosVentas([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  // --- LÓGICA DE ACTUALIZACIÓN ---
  const handleVentaCreada = () => {
    cargarVentas(); 
  };

  const handleEliminarVenta = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      try {
        const { eliminarVenta } = await import('../services/ventas.service.js');
        await eliminarVenta(id);
        cargarVentas(); // Recargar la lista
      } catch (error) {
        console.error("Error al eliminar la venta:", error);
        alert("No se pudo eliminar la venta.");
      }
    }
  };

  // --- FILTRADO ---
  const ventasFiltradas = datosVentas.filter(venta => {
    const estadoMatch = filtros.estado === 'todos' || 
                        venta.estado?.toLowerCase() === filtros.estado?.toLowerCase();
    
    const clienteMatch = !filtros.cliente || 
                         (venta.cliente_nombre || venta.cliente || "").toLowerCase().includes(filtros.cliente.toLowerCase());
    
    return estadoMatch && clienteMatch;
  });

  // --- CÁLCULOS (Sobre datos filtrados para que el resumen sea dinámico) ---
  const totalVentas = ventasFiltradas.reduce((sum, venta) => sum + Number(venta.total || 0), 0);
  const ventasCompletadas = ventasFiltradas.filter(v => v.estado?.toUpperCase() === 'COMPLETADO').length;
  const promedioVenta = ventasFiltradas.length > 0 ? totalVentas / ventasFiltradas.length : 0;

  return (
    <div className="space-y-6">
      {/* ... (Encabezado) */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#8c0315]">VENTAS</h1>
          <p className="text-gray-600 mt-1">Admin: Las delicias de Theo</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-[#8c0315] text-white px-6 py-3 rounded-xl hover:bg-[#6a0210] transition-colors flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Nueva Venta
        </button>
      </div>

      <div className="border-t border-[#d3b9b9] my-4"></div>

      {/* Resumen dinámico */}
      <ResumenVentas 
        totalVentas={totalVentas}
        ventasCompletadas={ventasCompletadas}
        promedioVenta={promedioVenta}
        totalTransacciones={ventasFiltradas.length}
      />

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '12px',
          marginTop: '20px',
          borderRadius: '8px',
          border: '1px solid #ef9a9a'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Historial de Ventas</h2>

      <FiltrosVentas filtros={filtros} setFiltros={setFiltros} />

      {/* Listado con manejo de carga */}
      {cargando ? (
        <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8c0315]"></div>
        </div>
      ) : (
        <TablaVentas 
          ventas={ventasFiltradas} 
          totalOriginal={datosVentas.length}
          onEliminar={handleEliminarVenta} 
        />
      )}

      {/* Barra de Exportación */}
      <div className="mt-8 p-4 bg-[#f9f3f3] rounded-xl border border-[#d3b9b9]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-gray-600">Buscar comandas...</span>
            <input 
              type="text" 
              placeholder="ID, cliente o producto..."
              className="flex-1 bg-white border border-[#d3b9b9] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8c0315]/30"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Exportar:</span>
            <button className="bg-white border border-[#d3b9b9] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">PDF</button>
            <button className="bg-white border border-[#d3b9b9] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Excel</button>
          </div>
        </div>
      </div>

      {/* Modal de Nueva Venta */}
      <ModalNuevaVenta 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onVentaCreada={handleVentaCreada}
      />
    </div>
  );
};