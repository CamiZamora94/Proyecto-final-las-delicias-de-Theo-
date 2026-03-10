import {
  createProducto,
  createProductosBulk,
  getProductos,
  getProductoById,
  updateProducto,
  getStock,
} from "../controllers/productosController.js";
import validatorPkg from "express-validator";
const { body, param, validationResult } = validatorPkg;
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

// Rutas protegidas: Todos los usuarios autenticados pueden ver productos
router.use(checkAuth);

// Obtener todos los productos
router.get("/", getProductos);

// Obtener stock
router.get("/stock", getStock);

// Obtener producto por ID
router.get(
  "/:id",
  param("id").isInt().withMessage("El ID debe ser un número"),
  handleValidationErrors,
  getProductoById,
);

// Rutas críticas: Solo Admin puede crear o modificar productos
router.post(
  "/",
  checkRole(["admin"]),
  body("tipo").isString().withMessage("El tipo es obligatorio"),
  body("nombre").isString().withMessage("El nombre es obligatorio"),
  body("descripcion").isString().withMessage("La descripción es obligatoria"),
  body("unidad")
    .isIn(["u", "g", "kg", "ml", "l"])
    .withMessage("La unidad debe ser: u, g, kg, ml o l"),
  body("vendible")
    .exists()
    .withMessage("El campo vendible es obligatorio")
    .isIn([0, 1])
    .withMessage("El campo vendible debe ser 1 o 0"),
  body("costo_unitario")
    .optional()
    .isNumeric()
    .withMessage("El costo unitario debe ser un número")
    .isFloat({ gt: 0 })
    .withMessage("El costo unitario debe ser un número positivo")
    .toFloat(),
  body("precio_venta")
    .optional()
    .isNumeric()
    .withMessage("El precio de venta debe ser un número")
    .isFloat({ gt: 0 })
    .withMessage("El precio de venta debe ser un número positivo")
    .toFloat(),
  handleValidationErrors,
  createProducto,
);

router.post(
  "/bulk",
  checkRole(["admin"]),
  body()
    .isArray({ min: 1 })
    .withMessage("La lista de productos no puede estar vacía"),
  body("*.tipo").isString().withMessage("El tipo es obligatorio"),
  body("*.nombre").isString().withMessage("El nombre es obligatorio"),
  body("*.descripcion").isString().withMessage("La descripción es obligatoria"),
  body("*.unidad")
    .isIn(["u", "g", "kg", "ml", "l"])
    .withMessage("La unidad debe ser: u, g, kg, ml o l"),
  body("*.vendible")
    .exists()
    .withMessage("El campo vendible es obligatorio")
    .isBoolean()
    .withMessage("El campo vendible debe ser verdadero o falso"),
  body("*.costo_unitario")
    .optional()
    .isNumeric()
    .withMessage("El costo unitario debe ser un número"),
  body("*.precio_venta")
    .optional()
    .isNumeric()
    .withMessage("El precio de venta debe ser un número"),
  handleValidationErrors,
  createProductosBulk,
);

router.put(
  "/:id",
  checkRole(["admin"]),
  param("id").isInt().withMessage("El ID debe ser un número"),
  handleValidationErrors,
  updateProducto,
);

export default router;
