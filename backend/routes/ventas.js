import {
  getVentas,
  getVentaById,
  createVenta,
  updateVenta,
  deleteVenta,
} from "../controllers/ventasController.js";
import { body, param, validationResult } from "express-validator";
import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import checkRole from "../middleware/checkRole.js";

export const router = express.Router();

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Rutas protegidas: Todos los usuarios autenticados pueden ver ventas
router.use(checkAuth);
router.use(checkRole(["admin", "cajero"]));

// Obtener todas las ventas
router.get("/", getVentas);

// Obtener una venta por ID
router.get(
  "/:id",
  param("id").isInt().withMessage("El ID de la venta debe ser un número entero"),
  handleValidationErrors,
  getVentaById,
);

// Crear una venta
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
  createVenta,
);

// Actualizar una venta
router.put(
  "/:id",
  param("id").isInt().withMessage("El ID de la venta debe ser un número entero"),
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
  updateVenta,
);

// Eliminar una venta
router.delete(
  "/:id",
  param("id").isInt().withMessage("El ID de la venta debe ser un número entero"),
  handleValidationErrors,
  deleteVenta,
);

export default router;
