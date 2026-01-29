import { GraficoVentas } from "../components/GraficoVentas.jsx";
import { Tarjeta } from "../components/Tarjeta.jsx";

export const Resumen = () => {
  // Datos para el gráfico
  const dataVentasSemanales = [
    { dia: 'Lun', ventas: 850, color: '#f8d7da' },
    { dia: 'Mar', ventas: 1100, color: '#f5c6cb' },
    { dia: 'Mie', ventas: 1250, color: '#f1b4c2' },
    { dia: 'Jue', ventas: 1450, color: '#e68f9c' },
    { dia: 'Vie', ventas: 1650, color: '#d9537a' },
    { dia: 'Sab', ventas: 1800, color: '#8c0315' },
    { dia: 'Dom', ventas: 950, color: '#f5c6cb' },
  ];
  
  const totalVentas = dataVentasSemanales.reduce((sum, item) => sum + item.ventas, 0);
  const promedioDiario = Math.round(totalVentas / dataVentasSemanales.length);

  return (
    <div className="">
      <div className="flex gap-6 flex-wrap">
        <Tarjeta
          titulo={"Ventas Totales"}
          dato={"$10.000.00"}
          subdato={"+12.5%"}
        />
        <Tarjeta titulo={"Transacciones"} dato={"20"} subdato={"+5.2%"} />
        <Tarjeta titulo={"Producto Estrella"} dato={"Maicenita"} subdato={"+2.1%"} />
        <Tarjeta titulo={"Alerta de Stock"} dato={"3"} subdato={"+8.7%"} />
      </div>
      
      <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-[#d3b9b9]/30 hover:shadow-md transition-shadow mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#8c0315]">Rendimiento Semanal</h2>
          <span className="text-sm text-gray-500 font-medium">Ventas en el obrador de Theo</span>
        </div>
        
        {/* GRÁFICO CON RECHARTS */}
        <div className="h-80">
          <GraficoVentas datos={dataVentasSemanales} titulo={"Ventas Semanales"} subtitulo={"Resumen de ventas por día"} />
        </div>
        
        {/* Datos clave */}
        <div className="space-y-3 mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total semana:</span>
            <span className="font-bold text-[#8c0315]">${totalVentas}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Promedio diario:</span>
            <span className="font-semibold">${promedioDiario}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Día pico:</span>
            <span className="font-semibold">Sábado (${Math.max(...dataVentasSemanales.map(d => d.ventas))})</span>
          </div>
        </div>
      </div>
    </div>
  );
};