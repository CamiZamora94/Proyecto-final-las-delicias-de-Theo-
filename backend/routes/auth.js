import express from "express";
import { db } from "../config/db.js";
import validatorPkg from "express-validator";
const { body, validationResult } = validatorPkg;
import bcrypt from "bcryptjs";

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

router.post(
  "/",
  body("nombre")
    .isString()
    .withMessage("El nombre del usario es estrictamente obligatorio"),
  body("email")
    .isEmail()
    .withMessage("El email del usario es estrictamente obligatorio"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("El password del usario es estrictamente obligatorio"),
  handleValidationErrors,
  async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
      //const salt = await bcrypt.genSalt(10);
      //const password = await bcrypt.hash(password, salt);
      const [result] = await db.query(
        "INSERT INTO usuarios (nombre,email,password) VALUES (?,?,?)",
        [nombre, email, password],
      );
      res.status(201).json({
        message: "Usuario creado exitosamente",
        userId: result.insertId,
        nombre,
        email,
      });
    }catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: "El correo ya está registrado" });
      }
      console.error(error);
      res.status(500).json({ message: "Error interno en el servidor" });
    }
  },
);

export default router;
