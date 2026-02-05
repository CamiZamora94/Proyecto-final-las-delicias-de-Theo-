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
})

