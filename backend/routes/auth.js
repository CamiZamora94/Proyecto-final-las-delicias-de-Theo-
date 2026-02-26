import express from "express";
import { db } from "../config/db.js";
import validatorPkg from "express-validator";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import { loginUser } from "../controllers/authController.js";
import checkAuth from "../middleware/checkAuth.js";

const { body, validationResult } = validatorPkg;
export const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/perfil/usuario", checkAuth, (req, res) => {
  // req.usuario viene del middleware que creamos arriba
  res.json({
    msg: "Perfil del usuario",
    usuario: req.usuario,
  });
});

// --- RUTA DE REGISTRO ---
router.post(
  "/register", // Cambia "/" por "/register" para evitar confusiones
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password").isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
  handleValidationErrors,
  async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
      // Encriptar la contraseña antes de guardar
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [result] = await db.query(
        "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
        [nombre, email, hashedPassword],
      );

      res.status(201).json({
        message: "Usuario creado exitosamente",
        userId: result.insertId,
        nombre,
        email,
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ message: "El correo ya está registrado" });
      }
      res.status(500).json({ message: "Error interno en el servidor" });
    }
  },
);

// --- RUTA DE LOGIN ---
router.post(
  "/login",
  body("email").isEmail().withMessage("Introduce un email válido"),
  body("password").notEmpty().withMessage("El password es obligatorio"),
  handleValidationErrors, // Primero validamos los campos
  loginUser, // Luego ejecutamos la lógica del controlador
);

router.post("/logout", (req, res) => {
  // En JWT, el logout se maneja en el frontend eliminando el token.
  // Aquí podríamos implementar una lista negra de tokens si queremos invalidarlos.
  res.json({
    message: "Logout  ha sido exitoso (elimina el token en el frontend)",
  });
});

router.get("/protected", checkAuth, (req, res) => {
  try {
    res.json({
      message: "Acceso concedido a ruta protegida",
      user: req.usuario?.nombre || "Usuario desconocido",
    });
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
});

export default router;
