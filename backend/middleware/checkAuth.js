import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

const checkAuth = async (req, res, next) => {
  let token;

  // Revisamos si el token viene en los encabezados de autorización
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extraer el token del string "Bearer [token]"
      token = req.headers.authorization.split(" ")[1];

      // Decodificar y verificar el token usando tu JWT_SECRET del .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscamos al usuario en la base de datos para asegurar que aún existe
      const [rows] = await db.query(
        "SELECT id, nombre, email, rol FROM usuarios WHERE id = ?",
        [decoded.id],
      );

      if (rows.length === 0) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
      }

      // Guardamos la info del usuario en el objeto req para usarla en las rutas
      req.usuario = rows[0];

      return next(); // Todo bien, puede pasar a la siguiente función
    } catch (error) {
      return res.status(403).json({ msg: "Token no válido o expirado" });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: "No hay token, autorización denegada" });
  }
};

export default checkAuth;
