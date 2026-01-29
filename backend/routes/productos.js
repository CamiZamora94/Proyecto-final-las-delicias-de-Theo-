import { db } from "../config/db.js";
import validatorPkg from "express-validator";
const { body, param, validationResult } = validatorPkg;
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

//crear el producto
//Como la base de datos tarda un poco en responder,
// usamos await para esperar a que termine antes de seguir con la siguiente línea.
//La función query devuelve un arreglo con mucha información. Al poner los corchetes en [rows],
//  estás extrayendo solo el primer elemento, que contiene el resultado de la operación
router.post(
  "/",
  body("tipo").isString().withMessage("El tipo es obligatorio"),
  body("nombre").isString().withMessage("El nombre es obligatorio"),
  body("descripcion").isString().withMessage("La descripción es obligatoria"),
  body("unidad").isString().withMessage("La unidad es obligatoria"),
  handleValidationErrors,
  async (req, res) => {
    const { tipo, nombre, descripcion, unidad } = req.body;
    try {
      const [rows] = await db.query(
        "INSERT INTO productos (tipo,nombre, descripcion, unidad) VALUES (?,?,?,?)",
        [tipo, nombre, descripcion, unidad],
      );
      res
        .status(201)
        .json({ id: rows.insertId, tipo, nombre, descripcion, unidad });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el producto" });
    }
  },
);

//obtenemos todos los productos
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM productos");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
});

//obtenemos un producto por id
router.get(
  "/:id",
  param("id").isInt().withMessage("El ID debe ser un número"),
  handleValidationErrors,
  async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query("SELECT * FROM productos WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el producto" });
    }
  },
);

//actualizar el producto por medio de su id
// la funcion try lo que hace que si la base de datos tarda en responder,
// el codigo espera a que la base de datos responda para continuar con la siguiente linea.
//affectedRows sirve para verificar si la actualizacion se realizo correctamente

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { tipo, nombre, descripcion, unidad } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE productos SET tipo = ?, nombre = ?, descripcion = ?, unidad = ? WHERE id = ?",
      [tipo, nombre, descripcion, unidad, id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});

export default router;
