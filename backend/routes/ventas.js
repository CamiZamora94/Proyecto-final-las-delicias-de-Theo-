import { db } from "../config/db.js";
import { body, param, validationResult } from "express-validator";
import express from "express";

export const router = express.Router(); //es un contenedor de rutas

// Middleware para manejar errores de validación
// Revisa los resultados de las validaciones y responde con 400 si hay errores
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

//obtener las ventas con sus productos
router.get("/", async (req, res) => {
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
});

//obtener una venta por id
router.get(
  "/:id",
  param("id")
    .isInt()
    .withMessage("El ID de la venta debe ser un número entero"),
  handleValidationErrors,
  async (req, res) => {
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
  },
);

//crear una venta
router.post(
  "/",
  body("fecha")
    .isISO8601()
    .withMessage("La fecha debe tener un formato válido"),
  body("cliente_nombre")
    .isString()
    .withMessage("El nombre del cliente debe ser una cadena de texto"),
  body("total")
    .isFloat({ gt: 0 })
    .withMessage("El total debe ser un número mayor que cero"),
  body("estado")
    .isIn(["pendiente", "completado", "cancelado"])
    .withMessage("El estado debe ser 'pendiente', 'completado' o 'cancelado'"),
  body("metodo_pago")
    .isString()
    .withMessage("El método de pago debe ser una cadena de texto"),
  handleValidationErrors,
  async (req, res) => {
    const { fecha, cliente_nombre, total, estado, metodo_pago, productos } = req.body;
    try {
      await db.beginTransaction();
      
      const [result] = await db.query(
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
        
        await db.query(
          "INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES ?",
          [valoresDetalle]
        );
      }

      await db.commit();
      
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
      await db.rollback();
      console.error("Error al crear la venta:", error);
      res.status(500).json({ message: "Error al crear la venta", error: error.message });
    }
  },
);

//actualizar una venta
router.put(
  "/:id",
  param("id")
    .isInt()
    .withMessage("El ID de la venta debe ser un número entero"),
  body("fecha")
    .isISO8601()
    .withMessage("La fecha debe tener un formato válido"),
  body("cliente_nombre")
    .isString()
    .withMessage("El nombre del cliente debe ser una cadena de texto"),
  body("total")
    .isFloat({ gt: 0 })
    .withMessage("El total debe ser un número mayor que cero"),
  body("estado")
    .isIn(["pendiente", "completado", "cancelado"])
    .withMessage("El estado debe ser 'pendiente', 'completado' o 'cancelado'"),
  body("metodo_pago")
    .isString()
    .withMessage("El método de pago debe ser una cadena de texto"),
  handleValidationErrors,
  async (req, res) => {
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
  },
);

//eliminar una venta
router.delete(
  "/:id",
  param("id")
    .isInt()
    .withMessage("El id de la venta deber ser un numero entero"),
  handleValidationErrors,
  async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await db.query("DELETE FROM ventas WHERE id = ?", [id]);
      if (result.affectedRows === 0) {
        return res
          .status(400)
          .json({ message: "La venta que no ha sido encontrada" });
      }
      res.json({ message: "La venta ha sido eliminada correctamente", id });
    } catch (error) {
      console.error("Error al eliminar la venta", error);
      res.status(500).json({ message: "Error al eliminar la venta" });
    }
  },
);

export default router;
