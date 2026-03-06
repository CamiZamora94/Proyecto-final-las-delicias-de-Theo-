import { db, connectDB } from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

async function createTable() {
  try {
    console.log("Conectando a la base de datos...");
    await connectDB();
    
    const query = `
      -- Primero intentamos crearla con el tipo estándar
      CREATE TABLE IF NOT EXISTS detalle_ventas (
          id INT AUTO_INCREMENT PRIMARY KEY,
          venta_id INT NOT NULL,
          producto_id INT NOT NULL,
          cantidad DECIMAL(10, 2) NOT NULL,
          precio_unitario DECIMAL(10, 2) NOT NULL
      );
    `;
    
    await db.query(query);
    console.log("Tabla creada. Ahora configurando llaves foráneas...");
    
    // Intentar añadir llaves foráneas por separado para detectar cuál falla
    try {
      await db.query("ALTER TABLE detalle_ventas ADD CONSTRAINT fk_venta FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE");
      console.log("✅ Llave foránea 'fk_venta' añadida.");
    } catch (e) {
      console.log("⚠️ No se pudo añadir 'fk_venta' (seguramente el tipo de dato no coincide o ya existe).");
    }

    try {
      await db.query("ALTER TABLE detalle_ventas ADD CONSTRAINT fk_producto FOREIGN KEY (producto_id) REFERENCES productos(id)");
      console.log("✅ Llave foránea 'fk_producto' añadida.");
    } catch (e) {
      console.log("⚠️ No se pudo añadir 'fk_producto'.");
    }
    console.log("✅ Tabla 'detalle_ventas' creada (o ya existía) con éxito.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al crear la tabla:", error.message);
    process.exit(1);
  }
}

createTable();
