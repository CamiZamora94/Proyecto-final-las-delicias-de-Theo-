export const FiltrosVentas = ({ filtros, setFiltros }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-[#d3b9b9]/30 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
          <input
            type="date"
            name="fechaInicio"
            value={filtros.fechaInicio}
            onChange={handleChange}
            className="w-full border border-[#d3b9b9] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8c0315]/30"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
          <input
            type="date"
            name="fechaFin"
            value={filtros.fechaFin}
            onChange={handleChange}
            className="w-full border border-[#d3b9b9] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8c0315]/30"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            name="estado"
            value={filtros.estado}
            onChange={handleChange}
            className="w-full border border-[#d3b9b9] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8c0315]/30"
          >
            <option value="todos">Todos los estados</option>
            <option value="COMPLETADO">Completado</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN PROCESO">En proceso</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          <input
            type="text"
            name="cliente"
            value={filtros.cliente}
            onChange={handleChange}
            placeholder="Nombre del cliente..."
            className="w-full border border-[#d3b9b9] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8c0315]/30"
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <button 
          onClick={() => setFiltros({ fechaInicio: '', fechaFin: '', estado: 'todos', cliente: '' })}
          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          Limpiar filtros
        </button>
        <button className="bg-[#8c0315] text-white px-4 py-2 rounded-lg hover:bg-[#6a0210] transition-colors text-sm font-medium">
          Aplicar filtros
        </button>
      </div>
    </div>
  );
};