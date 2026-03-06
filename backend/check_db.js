import { db, connectDB } from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

async function checkTables() {
  try {
    await connectDB();
    const [rows] = await db.query("SHOW TABLES");
    console.log("Tablas encontradas:", rows);
    
    // Si no está detalle_ventas, intentar crearla de nuevo con un log más detallado
    const tableExists = rows.some(row => Object.values(row)[0] === 'detalle_ventas');
    if (!tableExists) {
        console.log("detalle_ventas NO existe. Intentando crearla...");
        await db.query(`
          CREATE TABLE detalle_ventas (
              id INT AUTO_INCREMENT PRIMARY KEY,
              venta_id INT NOT NULL,
              producto_id INT NOT NULL,
              cantidad DECIMAL(10, 2) NOT NULL,
              precio_unitario DECIMAL(10, 2) NOT NULL
          )
        `);
        console.log("Tabla detalle_ventas creada satisfactoriamente.");
    } else {
        console.log("La tabla detalle_ventas YA EXISTE.");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

checkTables();
