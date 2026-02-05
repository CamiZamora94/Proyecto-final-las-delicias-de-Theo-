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

//obtener las ventas
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ventas");
    res.json(rows);
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
  body("metodo_pago")
    .isString()
    .withMessage("El método de pago debe ser una cadena de texto"),
  handleValidationErrors,
  async (req, res) => {
    const { fecha, cliente_nombre, total, estado, metodo_pago } = req.body;
    try {
      const [result] = await db.query(
        "INSERT INTO ventas (fecha, cliente_nombre, total, estado, metodo_pago) VALUES (?, ?, ?, ?, ?)",
        [fecha, cliente_nombre, total, estado, metodo_pago],
      );
      res
        .status(201)
        .json({
          id: result.insertId,
          fecha,
          cliente_nombre,
          total,
          estado,
          metodo_pago,
        });
    } catch (error) {
      console.error("Error al crear la venta:", error);
      res.status(500).json({ message: "Error al crear la venta" });
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
    const { id, fecha, cliente_nombre, total, estado, metodo_pago } = req.body;
    try {
      const [result] = await db.query(
        "UPDATE ventas SET fecha = ?, cliente_nombre = ?, total = ?, estado = ?, metodo_pago = ? WHERE id = ?",
        [fecha, cliente_nombre, total, estado, metodo_pago, id],
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Venta no encontrada" });
      }
      res.json({ id, fecha, cliente_nombre, total, estado, metodo_pago });
    } catch (error) {
      console.error("Error al actualizar la venta:", error);
      res.status(500).json({ message: "Error al actualizar la venta" });
    }
  },
);
