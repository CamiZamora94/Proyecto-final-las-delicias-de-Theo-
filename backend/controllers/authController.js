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
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol, // Admin o Vendedor
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno al intentar loguear" });
  }
};
