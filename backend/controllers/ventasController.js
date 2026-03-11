import { db } from "../config/db.js";

export const getVentas = async (req, res) => {
  try {
    const query = `
      SELECT v.*, dv.producto_id, dv.cantidad, dv.precio_unitario as precio, p.nombre as producto_nombre
      FROM ventas v
      LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
      LEFT JOIN productos p ON dv.producto_id = p.id
      ORDER BY v.fecha DESC, v.id DESC
    `;
    const [rows] = await db.query(query);
    
    // Agrupamos los productos por cada venta
    const ventasMap = rows.reduce((acc, row) => {
      const { id, producto_id, cantidad, precio, producto_nombre, ...ventaInfo } = row;
      if (!acc[id]) {
        acc[id] = { ...ventaInfo, id, productos: [] };
      }
      if (producto_id) {
        acc[id].productos.push({
          producto_id,
          nombre: producto_nombre,
          cantidad,
          precio
        });
      }
      return acc;
    }, {});

    res.json(Object.values(ventasMap));
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    res.status(500).json({ message: "Error al obtener las ventas" });
  }
};

export const getVentaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM ventas WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la venta" });
  }
};

export const createVenta = async (req, res) => {
  const { fecha, cliente_nombre, total, estado, metodo_pago, productos } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const [result] = await connection.query(
      "INSERT INTO ventas (fecha, cliente_nombre, total, estado, metodo_pago) VALUES (?, ?, ?, ?, ?)",
      [fecha, cliente_nombre, total, estado, metodo_pago || 'Efectivo'],
    );
    
    const ventaId = result.insertId;

    if (productos && productos.length > 0) {
      const valoresDetalle = productos.map(p => [
        ventaId, 
        p.producto_id, 
        p.cantidad, 
        p.precio
      ]);
      
      await connection.query(
        "INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES ?",
        [valoresDetalle]
      );
    }

    await connection.commit();
    
    res.status(201).json({
      id: ventaId,
      fecha,
      cliente_nombre,
      total,
      estado,
      metodo_pago,
      productos
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error al crear la venta:", error);
    res.status(500).json({ message: "Error al crear la venta", error: error.message });
  } finally {
    connection.release();
  }
};

export const updateVenta = async (req, res) => {
  const { fecha, cliente_nombre, total, estado, metodo_pago } = req.body;
  const { id: idParam } = req.params;
  try {
    const [result] = await db.query(
      "UPDATE ventas SET fecha = ?, cliente_nombre = ?, total = ?, estado = ?, metodo_pago = ? WHERE id = ?",
      [fecha, cliente_nombre, total, estado, metodo_pago, idParam],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
    res.json({
      id: idParam,
      fecha,
      cliente_nombre,
      total,
      estado,
      metodo_pago,
    });
  } catch (error) {
    console.error("Error al actualizar la venta:", error);
    res.status(500).json({ message: "Error al actualizar la venta" });
  }
};

export const deleteVenta = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM ventas WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }
    res.json({ message: "La venta ha sido eliminada correctamente", id });
  } catch (error) {
    console.error("Error al eliminar la venta", error);
    res.status(500).json({ message: "Error al eliminar la venta" });
  }
};
