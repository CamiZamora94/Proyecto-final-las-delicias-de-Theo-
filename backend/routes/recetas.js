import { db } from "../config/db.js";
import validatorPkg from "express-validator";
const { body, param, validationResult } = validatorPkg;
import express from "express";

export const router = express.Router();

// Middleware para manejar errores de validación
// Revisa los resultados de las validaciones y responde con 400 si hay errores
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Obtener todas las recetas
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM recetas");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las recetas" });
  }
});

// Obtener una receta por ID
router.get(
  "/:id",
  param("id").isInt().withMessage("El ID debe ser un número"),
  handleValidationErrors,
  async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query("SELECT * FROM recetas WHERE id = ?", [id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Receta no encontrada" });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener la receta" });
    }
  },
);

// crear una nueva receta
router.post(
  "/",
  body("nombre").isString().withMessage("El nombre es obligatorio"),
  handleValidationErrors
)


export default router;
