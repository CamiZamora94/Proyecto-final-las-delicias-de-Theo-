import { db, connectDB } from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

async function forceCreate() {
  try {
    await connectDB();
    console.log("Conectado a:", process.env.DB_NAME);
    
    // Matar la tabla si existe para recrearla limpia
    await db.query("DROP TABLE IF EXISTS detalle_ventas");
    
    await db.query(`
      CREATE TABLE detalle_ventas (
          id INT AUTO_INCREMENT PRIMARY KEY,
          venta_id INT NOT NULL,
          producto_id INT NOT NULL,
          cantidad DECIMAL(10, 2) NOT NULL,
          precio_unitario DECIMAL(10, 2) NOT NULL
      )
    `);
    
    console.log("Tabla detalle_ventas RE-CREADA.");
    
    const [tables] = await db.query("SHOW TABLES");
    console.log("Tablas ahora:", tables.map(t => Object.values(t)[0]));
    
    process.exit(0);
  } catch (error) {
    console.error("ERROR CRITICO:", error.message);
    process.exit(1);
  }
}

forceCreate();
