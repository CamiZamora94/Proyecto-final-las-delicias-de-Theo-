import { useEffect, useState } from "react";
import { GraficoVentas } from "../components/GraficoVentas.jsx";
import { Tarjeta } from "../components/Tarjeta.jsx";
import { getVentas } from "../services/ventas.service.js";

export const Resumen = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getVentas();
        if (Array.isArray(data)) {
          setVentas(data);
        }
      } catch (error) {
        console.error("Error al cargar datos para el resumen:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  // --- CÁLCULOS SOBRE DATOS REALES ---
  
  // 1. Ventas Totales
  const totalVentas = ventas.reduce((sum, v) => sum + Number(v.total || 0), 0);
  
  // 2. Transacciones
  const totalTransacciones = ventas.length;
  
  // 3. Producto Estrella (el más vendido por cantidad)
  const rankingProductos = {};
  ventas.forEach(v => {
    (v.productos || []).forEach(p => {
      rankingProductos[p.nombre] = (rankingProductos[p.nombre] || 0) + Number(p.cantidad);
    });
  });
  
  const productoEstrella = Object.entries(rankingProductos)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "Ninguno";

  // 4. Datos para el gráfico (últimos 7 días con ventas)
  // Agrupamos por fecha
  const ventasPorDia = ventas.reduce((acc, v) => {
    const fecha = new Date(v.fecha).toLocaleDateString('es-ES', { weekday: 'short' });
    const nombreDia = fecha.charAt(0).toUpperCase() + fecha.slice(1, 3);
    acc[nombreDia] = (acc[nombreDia] || 0) + Number(v.total || 0);
    return acc;
  }, {});

  const diasOrdenados = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
  const dataVentasSemanales = diasOrdenados.map(dia => ({
    dia,
    ventas: ventasPorDia[dia] || 0
  }));

  const promedioDiario = totalTransacciones > 0 ? (totalVentas / totalTransacciones) : 0;

  if (loading) return <div className="p-10 text-center">Cargando resumen...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Tarjeta
          titulo={"Ventas Totales"}
          dato={`AR$ ${totalVentas.toFixed(2)}`}
          subdato={"+12.5%"}
          icono="💰"
        />
        <Tarjeta 
          titulo={"Transacciones"} 
          dato={totalTransacciones.toString()} 
          subdato={"+5.2%"} 
          icono="🛒"
        />
        <Tarjeta 
          titulo={"Producto Estrella"} 
          dato={productoEstrella} 
          subdato={"+2.1%"} 
          icono="⭐"
        />
        <Tarjeta 
          titulo={"Alerta de Stock"} 
          dato={"0"} 
          subdato={"0%"} 
          icono="⚠️"
        />
      </div>
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#d3b9b9]/30 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#8c0315]">Rendimiento Semanal</h2>
          <span className="text-sm text-gray-500 font-medium">Ventas en el obrador de Theo</span>
        </div>
        
        <div className="h-80">
          <GraficoVentas datos={dataVentasSemanales} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
          <div className="bg-[#f9f3f3] p-4 rounded-2xl flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total acumulado:</span>
            <span className="font-bold text-[#8c0315] text-lg">AR$ {totalVentas.toFixed(2)}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
            <span className="text-gray-600 font-medium">Promedio por ticket:</span>
            <span className="font-bold text-gray-700 text-lg">AR$ {promedioDiario.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};