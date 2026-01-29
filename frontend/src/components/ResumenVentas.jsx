export const ResumenVentas = ({ totalVentas, ventasCompletadas, promedioVenta, totalTransacciones }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#d3b9b9]/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Ventas Totales</p>
            <p className="text-2xl font-bold text-[#8c0315] mt-1">${totalVentas.toFixed(2)}</p>
          </div>
          <div className="text-2xl">💰</div>
        </div>
        <p className="text-xs text-green-600 mt-2">+12.5% vs mes anterior</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#d3b9b9]/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Ventas Completadas</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{ventasCompletadas}</p>
          </div>
          <div className="text-2xl">✅</div>
        </div>
        <p className="text-xs text-green-600 mt-2">{Math.round((ventasCompletadas/totalTransacciones)*100)}% del total</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#d3b9b9]/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Promedio por Venta</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">${promedioVenta.toFixed(2)}</p>
          </div>
          <div className="text-2xl">📊</div>
        </div>
        <p className="text-xs text-green-600 mt-2">+8.3% vs promedio histórico</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#d3b9b9]/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Transacciones</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{totalTransacciones}</p>
          </div>
          <div className="text-2xl">🛒</div>
        </div>
        <p className="text-xs text-green-600 mt-2">+5.2% vs mes anterior</p>
      </div>
    </div>
  );
};