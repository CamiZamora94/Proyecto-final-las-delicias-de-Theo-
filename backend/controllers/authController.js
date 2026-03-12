import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("DEBUG: Intentando login para:", email);
  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "El usuario no existe" });
    }

    const usuario = rows[0];

    const isMatch = await bcrypt.compare(password, usuario.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("CRITICAL: JWT_SECRET is not defined in environment");
      return res.status(500).json({ message: "Error de configuración en el servidor" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno al intentar loguear", error: error.message });
  }
};

export const registerUser = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
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
      return res.status(400).json({ message: "El correo ya está registrado" });
    }
    res.status(500).json({ message: "Error interno en el servidor" });
  }
};

export const getPerfil = (req, res) => {
  res.json({
    msg: "Perfil del usuario",
    usuario: req.usuario,
  });
};

export const logout = (req, res) => {
  res.json({
    message: "Logout ha sido exitoso (elimina el token en el frontend)",
  });
};
