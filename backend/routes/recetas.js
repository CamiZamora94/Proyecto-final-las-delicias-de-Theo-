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
  [
    body("nombre")
      .notEmpty()
      .withMessage("El nombre de la receta es obligatorio"),
    body("producto_id")
      .isNumeric()
      .withMessage("Debe estar vinculada a un producto final"),
    handleValidationErrors,
  ],
  async (req, res) => {
    const { nombre, producto_id } = req.body;
    try {
      const [result] = await db.query(
        "INSERT INTO recetas (nombre, producto_id) VALUES (?, ?)",
        [nombre, producto_id],
      );

      // Devolvemos el ID generado para usarlo en el siguiente paso
      res.status(201).json({
        message: "Cabecera de receta creada",
        id: result.insertId,
      });
    } catch (error) {
      console.error(error);
      // Manejar error de clave foránea (producto final inexistente)
      if (
        error &&
        (error.code === "ER_NO_REFERENCED_ROW_2" || error.errno === 1452)
      ) {
        return res.status(400).json({ message: "Producto final no existe" });
      }
      res
        .status(500)
        .json({ message: "Error al crear la receta", error: error.message });
    }
  },
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
  async (req, res) => {
    const { receta_id, producto_id } = req.body;

    try {
      // Insertamos en la tabla detallada 'ingredientes_receta'
      const [result] = await db.query(
        "INSERT INTO ingredientes_receta (receta_id, producto_id) VALUES (?, ?)",
        [receta_id, producto_id],
      );

      res.status(201).json({
        message: "Ingrediente añadido con éxito a la receta",
        id: result.insertId,
      });
    } catch (error) {
      console.error(error);
      // Si el error es por clave foránea (ej: la receta_id no existe)
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return res
          .status(400)
          .json({ message: "La receta o el producto especificado no existen" });
      }
      res.status(500).json({ message: "Error al guardar el ingrediente" });
    }
  },
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
  async (req, res) => {
    const { id } = req.params;
    const { nombre, producto_id } = req.body;
    try {
      const [result] = await db.query(
        "UPDATE recetas SET nombre = COALESCE(?, nombre), producto_id = COALESCE(?, producto_id) WHERE id = ?",
        [nombre, producto_id, id],
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Receta no encontrada" });
      }
      res.json({ message: "Receta actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar la receta" });
    }
  },
);

//eliminar una receta
router.delete("/:id", async (req, res) => {
  const { id } = req.params; // ID de la tabla recetas
  try {
    // Gracias al ON DELETE CASCADE que configuramos en MySQL,
    // al borrar la receta se borrarán solos sus ingredientes.
    const [result] = await db.query("DELETE FROM recetas WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "La receta que desea eliminar no existe" });
    }

    res.json({ message: "Receta y sus ingredientes eliminados correctamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error al eliminar la receta completa, por favor revisar",
      });
  }
});

export default router;
