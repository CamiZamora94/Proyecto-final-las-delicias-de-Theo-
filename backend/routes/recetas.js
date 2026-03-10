import {
  getRecetas,
  getRecetaById,
  createReceta,
  addIngrediente,
  updateReceta,
  deleteReceta,
} from "../controllers/recetasController.js";
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

// Rutas protegidas: Todos los usuarios autenticados pueden ver recetas
router.use(checkAuth);

// Obtener todas las recetas
router.get("/", getRecetas);

// Obtener una receta por ID
router.get(
  "/:id",
  param("id").isInt().withMessage("El ID debe ser un número"),
  handleValidationErrors,
  getRecetaById,
);

// Rutas críticas: Solo Admin puede crear o modificar recetas
router.use(checkRole(["admin"]));

// crear una nueva receta
router.post(
  "/",
  [
    body("nombre")
      .notEmpty()
      .withMessage("El nombre de la receta es obligatorio"),
    body("producto_id")
      .isNumeric()
      .withMessage("Debe estar vinculada a un producto final"),
    handleValidationErrors,
  ],
  createReceta,
);

// AÑADIR UN INGREDIENTE A UNA RECETA EXISTENTE
router.post(
  "/ingredientes",
  [
    body("receta_id")
      .isNumeric()
      .withMessage("El ID de la receta es obligatorio"),
    body("producto_id")
      .isNumeric()
      .withMessage("El ID del ingrediente (producto) es obligatorio"),
    handleValidationErrors,
  ],
  addIngrediente,
);

//actualizar una receta existente
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número"),
    body("nombre")
      .optional()
      .notEmpty()
      .withMessage("El nombre de la receta no puede estar vacío"),
    body("producto_id")
      .optional()
      .isNumeric()
      .withMessage("Debe estar vinculada a un producto final"),
    handleValidationErrors,
  ],
  updateReceta,
);

//eliminar una receta
router.delete(
  "/:id",
  param("id").isInt().withMessage("El ID debe ser un número"),
  handleValidationErrors,
  deleteReceta,
);

export default router;
