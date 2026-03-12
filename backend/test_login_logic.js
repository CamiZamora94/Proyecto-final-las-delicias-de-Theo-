import { db, connectDB } from "./config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

async function testLogin() {
  try {
    await connectDB();
    const email = "david89@test.com";
    const password = "12345678";
    
    console.log("Checking user...");
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    console.log("Rows found:", rows.length);
    if (rows.length === 0) return;
    
    const usuario = rows[0];
    console.log("Comparing password...");
    const isMatch = await bcrypt.compare(password, usuario.password);
    console.log("Match:", isMatch);
    
    console.log("Signing token...");
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    console.log("Token:", token);
    process.exit(0);
  } catch (error) {
    console.error("TEST FAILED:", error);
    process.exit(1);
  }
}

testLogin();
