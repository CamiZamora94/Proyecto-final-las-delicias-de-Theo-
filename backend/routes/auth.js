import express from "express";
import validatorPkg from "express-validator";
import {
  loginUser,
  registerUser,
  getPerfil,
  logout
} from "../controllers/authController.js";
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

// Perfil del usuario
router.get("/perfil/usuario", checkAuth, getPerfil);

// Registro
router.post(
  "/register",
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password").isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
  handleValidationErrors,
  registerUser
);

// Login
router.post(
  "/login",
  body("email").isEmail().withMessage("Introduce un email válido"),
  body("password").notEmpty().withMessage("El password es obligatorio"),
  handleValidationErrors,
  loginUser
);

// Logout
router.post("/logout", logout);

// Ruta de prueba protegida
router.get("/protected", checkAuth, (req, res) => {
  res.json({
    message: "Acceso concedido a ruta protegida",
    user: req.usuario?.nombre || "Usuario desconocido",
  });
});

export default router;
