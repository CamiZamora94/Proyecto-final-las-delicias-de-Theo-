import { db, connectDB } from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

async function testApi() {
  try {
    await connectDB();
    const [rows] = await db.query(`
      SELECT v.*, dv.id as detail_id
      FROM ventas v
      LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
    `);
    console.log("Ventas con detalles:", rows.length);
    console.log("Primera venta:", rows[0]);
    process.exit(0);
  } catch (error) {
    console.error("DEBUG ERROR:", error.message);
    process.exit(1);
  }
}

testApi();
