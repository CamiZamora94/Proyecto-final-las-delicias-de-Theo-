import { useState } from 'react';
import { TablaVentas } from '../components/Tabla.jsx';
import { FiltrosVentas } from '../components/FiltrosVentas.jsx';
import { ResumenVentas } from '../components/ResumenVentas.jsx';

export const Ventas = () => {
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    estado: 'todos',
    cliente: ''
  });

  const datosVentas = [
    {
      id: '#101',
      cliente: 'Ana García',
      fecha: '1/5/2024',
      total: 45.50,
      estado: 'COMPLETADO',
      productos: [
        { nombre: 'Tarta de Chocolate', cantidad: 1, precio: 28.00 },
        { nombre: 'Café Americano', cantidad: 2, precio: 8.75 }
      ]
    },
    {
      id: '#102',
      cliente: 'Carlos Ruiz',
      fecha: '1/5/2024',
      total: 12.00,
      estado: 'COMPLETADO',
      productos: [
        { nombre: 'Galletas Mantequilla', cantidad: 6, precio: 12.00 }
      ]
    },
    {
      id: '#103',
      cliente: 'María López',
      fecha: '2/5/2024',
      total: 85.00,
      estado: 'PENDIENTE',
      productos: [
        { nombre: 'Pastel Red Velvet', cantidad: 1, precio: 45.00 },
        { nombre: 'Cupcakes Vainilla', cantidad: 8, precio: 40.00 }
      ]
    },
    {
      id: '#104',
      cliente: 'Roberto Méndez',
      fecha: '2/5/2024',
      total: 32.50,
      estado: 'COMPLETADO',
      productos: [
        { nombre: 'Pan de Maíz', cantidad: 3, precio: 24.00 },
        { nombre: 'Jugo Natural', cantidad: 2, precio: 8.50 }
      ]
    },
    {
      id: '#105',
      cliente: 'Laura Fernández',
      fecha: '3/5/2024',
      total: 67.80,
      estado: 'EN PROCESO',
      productos: [
        { nombre: 'Tres Leches', cantidad: 1, precio: 35.00 },
        { nombre: 'Brownies', cantidad: 6, precio: 24.00 },
        { nombre: 'Té Helado', cantidad: 3, precio: 8.80 }
      ]
    },
    {
      id: '#106',
      cliente: 'Diego Herrera',
      fecha: '3/5/2024',
      total: 24.00,
      estado: 'CANCELADO',
      productos: [
        { nombre: 'Croissants', cantidad: 6, precio: 24.00 }
      ]
    },
    {
      id: '#107',
      cliente: 'Sofía Castro',
      fecha: '4/5/2024',
      total: 156.25,
      estado: 'COMPLETADO',
      productos: [
        { nombre: 'Pastel de Bodas', cantidad: 1, precio: 120.00 },
        { nombre: 'Galletas Decoradas', cantidad: 25, precio: 36.25 }
      ]
    }
  ];

  // Calcular estadísticas
  const totalVentas = datosVentas.reduce((sum, venta) => sum + venta.total, 0);
  const ventasCompletadas = datosVentas.filter(v => v.estado === 'COMPLETADO').length;
  const promedioVenta = totalVentas / datosVentas.length;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#8c0315]">VENTAS</h1>
          <p className="text-gray-600 mt-1">Admin: Las delicias de Theo</p>
        </div>
        <button className="bg-[#8c0315] text-white px-6 py-3 rounded-xl hover:bg-[#6a0210] transition-colors flex items-center gap-2">
          <span className="text-xl">+</span>
          Nueva Venta
        </button>
      </div>

      {/* Línea divisoria */}
      <div className="border-t border-[#d3b9b9] my-4"></div>

      {/* Resumen de ventas */}
      <ResumenVentas 
        totalVentas={totalVentas}
        ventasCompletadas={ventasCompletadas}
        promedioVenta={promedioVenta}
        totalTransacciones={datosVentas.length}
      />

      {/* Título de historial */}
      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Historial de Ventas</h2>

      {/* Filtros de búsqueda */}
      <FiltrosVentas filtros={filtros} setFiltros={setFiltros} />

      {/* Tabla de ventas */}
      <TablaVentas ventas={datosVentas} filtros={filtros} />

      {/* Barra inferior de búsqueda */}
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
            <button className="bg-white border border-[#d3b9b9] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              PDF
            </button>
            <button className="bg-white border border-[#d3b9b9] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};