import { useState } from 'react';

export const TablaVentas = ({ ventas, filtros }) => {
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  // Filtrar ventas según los filtros
  const ventasFiltradas = ventas.filter(venta => {
    if (filtros.estado !== 'todos' && venta.estado !== filtros.estado) return false;
    if (filtros.cliente && !venta.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())) return false;
    // Aquí podrías agregar más lógica de filtrado por fecha si lo necesitas
    return true;
  });

  // Función para obtener el color según el estado
  const getColorEstado = (estado) => {
    switch (estado) {
      case 'COMPLETADO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'EN PROCESO':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-[#d3b9b9]/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9f3f3] border-b border-[#d3b9b9]/50">
                <th className="text-left p-4 font-semibold text-gray-700">ID</th>
                <th className="text-left p-4 font-semibold text-gray-700">CLIENTE</th>
                <th className="text-left p-4 font-semibold text-gray-700">FECHA</th>
                <th className="text-left p-4 font-semibold text-gray-700">TOTAL</th>
                <th className="text-left p-4 font-semibold text-gray-700">ESTADO</th>
                <th className="text-left p-4 font-semibold text-gray-700">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.map((venta) => (
                <tr 
                  key={venta.id} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setVentaSeleccionada(ventaSeleccionada?.id === venta.id ? null : venta)}
                >
                  <td className="p-4">
                    <span className="font-mono font-semibold text-gray-800">{venta.id}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-800">{venta.cliente}</p>
                      <p className="text-sm text-gray-500">{venta.productos.length} productos</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">{venta.fecha}</td>
                  <td className="p-4">
                    <span className="font-bold text-[#8c0315]">${venta.total.toFixed(2)}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getColorEstado(venta.estado)}`}>
                      {venta.estado}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        className="text-[#8c0315] hover:text-[#6a0210] p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Acción de ver detalles
                        }}
                      >
                        👁️
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-800 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Acción de editar
                        }}
                      >
                        ✏️
                      </button>
                      <button 
                        className="text-gray-600 hover:text-red-600 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Acción de eliminar
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detalles de la venta seleccionada */}
        {ventaSeleccionada && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-800">Detalles de {ventaSeleccionada.id}</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setVentaSeleccionada(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Información del Cliente</h4>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Nombre:</span> {ventaSeleccionada.cliente}</p>
                  <p><span className="text-gray-600">Fecha:</span> {ventaSeleccionada.fecha}</p>
                  <p><span className="text-gray-600">Estado:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getColorEstado(ventaSeleccionada.estado)}`}>
                      {ventaSeleccionada.estado}
                    </span>
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Productos</h4>
                <div className="space-y-2">
                  {ventaSeleccionada.productos.map((producto, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                      <div>
                        <p className="font-medium">{producto.nombre}</p>
                        <p className="text-sm text-gray-500">Cantidad: {producto.cantidad}</p>
                      </div>
                      <p className="font-semibold">${producto.precio.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-[#8c0315]">${ventaSeleccionada.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resumen al final de la tabla */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div>
          Mostrando <span className="font-semibold">{ventasFiltradas.length}</span> de <span className="font-semibold">{ventas.length}</span> ventas
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              Completado
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
              Pendiente
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
              En proceso
            </span>
          </div>
          <button className="text-[#8c0315] hover:text-[#6a0210] font-medium">
            Ver todas →
          </button>
        </div>
      </div>
    </>
  );
};