import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al usuario en la base de datos de la pastelería
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    // Si no existe el correo, devolvemos error 404
    if (rows.length === 0) {
      return res.status(404).json({ message: "El usuario no existe" });
    }

    const usuario = rows[0];

    // 2. Comparar la contraseña ingresada con el hash guardado en MySQL
    const isMatch = await bcrypt.compare(password, usuario.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // 3. Generar el JWT usando la clave de tu archivo .env
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }, // Expira en una jornada laboral
    );

    // 4. Respuesta exitosa para React
    res.json({
      message: "Inicio de sesión exitoso",
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno al intentar loguear" });
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
