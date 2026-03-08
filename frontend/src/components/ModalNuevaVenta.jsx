import { useState, useEffect } from 'react';
import { crearVenta } from '../services/ventas.service.js';
import { getProductos } from '../services/productos.service.js';

export const ModalNuevaVenta = ({ isOpen, onClose, onVentaCreada }) => {
  const [loading, setLoading] = useState(false);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  
  const [formData, setFormData] = useState({
    cliente_nombre: '',
    total: 0,
    estado: 'pendiente',
    metodo_pago: 'Efectivo',
    fecha: new Date().toISOString().split('T')[0],
    productos: []
  });

  useEffect(() => {
    if (isOpen) {
      cargarProductos();
    }
  }, [isOpen]);

  const cargarProductos = async () => {
    try {
      const data = await getProductos();
      // Solo productos que sean vendibles
      setProductosDisponibles(data.filter(p => p.vendible === 1));
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado) return;
    
    const prod = productosDisponibles.find(p => p.id === parseInt(productoSeleccionado));
    if (!prod) return;

    const nuevoProducto = {
      producto_id: prod.id,
      nombre: prod.nombre,
      precio: prod.precio_venta,
      cantidad: parseFloat(cantidad),
      subtotal: prod.precio_venta * cantidad
    };

    const nuevosProductos = [...formData.productos, nuevoProducto];
    const nuevoTotal = nuevosProductos.reduce((sum, p) => sum + p.subtotal, 0);

    setFormData({
      ...formData,
      productos: nuevosProductos,
      total: nuevoTotal
    });
    
    setProductoSeleccionado('');
    setCantidad(1);
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = formData.productos.filter((_, i) => i !== index);
    const nuevoTotal = nuevosProductos.reduce((sum, p) => sum + p.subtotal, 0);
    setFormData({
      ...formData,
      productos: nuevosProductos,
      total: nuevoTotal
    });
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.productos.length === 0) {
      alert("Debe agregar al menos un producto a la venta");
      return;
    }
    setLoading(true);
    try {
      const nuevaVenta = await crearVenta({
        ...formData,
        total: parseFloat(formData.total)
      });
      
      onVentaCreada(nuevaVenta); 
      onClose(); 
      setFormData({ 
        cliente_nombre: '', 
        total: 0, 
        estado: 'pendiente', 
        metodo_pago: 'Efectivo',
        fecha: new Date().toISOString().split('T')[0],
        productos: []
      });
    } catch (error) {
      console.error("Error al crear la venta:", error);
      alert("Error al crear la venta. Verifique los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-[#8c0315] mb-4">Registrar Nueva Venta</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
            <input
              required
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-[#8c0315] outline-none"
              value={formData.cliente_nombre}
              onChange={(e) => setFormData({...formData, cliente_nombre: e.target.value})}
            />
          </div>

          <div className="bg-[#f9f3f3] p-4 rounded-xl border border-[#d3b9b9]/30">
            <h3 className="text-sm font-bold text-gray-700 mb-3 border-b border-[#d3b9b9] pb-1">Agregar Productos</h3>
            <div className="flex gap-2">
              <select
                className="flex-1 p-2 border border-gray-300 text-black rounded-lg text-sm outline-none"
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
              >
                <option value="">Seleccionar producto...</option>
                {productosDisponibles.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} (AR$ {p.precio_venta})</option>
                ))}
              </select>
              <input
                type="number"
                min="0.1"
                step="0.1"
                className="w-20 p-2 border border-gray-300 text-black rounded-lg text-sm outline-none"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
              <button
                type="button"
                onClick={agregarProducto}
                className="bg-[#8c0315] text-white px-3 py-1 rounded-lg hover:bg-[#6a0210] text-sm"
              >
                +
              </button>
            </div>

            {/* Lista de productos agregados */}
            <div className="mt-3 space-y-2">
              {formData.productos.map((p, index) => (
                <div key={index} className="flex justify-between items-center bg-white p-2 rounded-lg text-xs border border-gray-100">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{p.nombre}</p>
                    <p className="text-gray-500">{p.cantidad} x AR$ {(Number(p.precio) || 0).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#8c0315]">AR$ {(Number(p.subtotal) || 0).toFixed(2)}</span>
                    <button 
                      type="button"
                      onClick={() => eliminarProducto(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <span className="text-sm font-bold text-gray-700">TOTAL A PAGAR:</span>
            <span className="text-xl font-black text-[#8c0315]">AR$ {(Number(formData.total) || 0).toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
              <select
                className="w-full mt-1 p-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-[#8c0315] outline-none"
                value={formData.metodo_pago}
                onChange={(e) => setFormData({...formData, metodo_pago: e.target.value})}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Tarjeta">Tarjeta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Estado Inicial</label>
              <select
                className="w-full mt-1 p-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-[#8c0315] outline-none"
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
              >
                <option value="pendiente">PENDIENTE</option>
                <option value="en proceso">EN PROCESO</option>
                <option value="completado">COMPLETADO</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#8c0315] text-white rounded-lg hover:bg-[#6a0210] transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Confirmar Venta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};