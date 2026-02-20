import express from "express";
import { db } from "../config/db.js";
import validatorPkg from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Importante para el login
import { loginUser } from "../controllers/authController.js";
import checkAuth from '../middleware/checkAuth.js';

const { body, validationResult } = validatorPkg;
export const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/perfil', checkAuth, (req, res) => {
    // req.usuario viene del middleware que creamos arriba
    res.json({
        msg: "Perfil del usuario",
        usuario: req.usuario
    });
});



// --- RUTA DE REGISTRO ---
router.post(
  "/", // Cambia "/" por "/register" para evitar confusiones
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
// router.post(
//   "/login",
//   body("email").isEmail().withMessage("Introduce un email válido"),
//   body("password").notEmpty().withMessage("El password es obligatorio"),
//   handleValidationErrors,
//   async (req, res) => {
//     const { email, password } = req.body;
//     try {
//       // 1. Buscar usuario
//       const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
//       if (rows.length === 0) {
//         return res.status(404).json({ message: "El usuario no existe" });
//       }

//       const usuario = rows[0];

//       // 2. Comparar password hasheado
//       const isMatch = await bcrypt.compare(password, usuario.password);
//       if (!isMatch) {
//         return res.status(401).json({ message: "Contraseña incorrecta" });
//       }

//       // 3. Generar Token para la sesión
//       const token = jwt.sign(
//         { id: usuario.id },
//         process.env.JWT_SECRET,
//         { expiresIn: '8h' }
//       );

//       res.json({
//         message: "Login exitoso",
//         token,
//         usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
//       });
//     } catch (error) {
//       res.status(500).json({ message: "Error al iniciar sesión" });
//     }
//   }
// );

router.post("/logout", (req, res) => {
  // En JWT, el logout se maneja en el frontend eliminando el token.
  // Aquí podríamos implementar una lista negra de tokens si queremos invalidarlos.
  res.json({
    message: "Logout  ha sido exitoso (elimina el token en el frontend)",
  });
});

router.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      message: "Acceso concedido a ruta protegida",
      userId: decoded.id,
    });
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
});

export default router;
