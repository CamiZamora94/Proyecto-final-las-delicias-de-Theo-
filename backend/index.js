import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { router as productosRouter } from "./routes/productos.js";
import { router as recetasRouter } from "./routes/recetas.js";
import { router as ventasRouter } from "./routes/ventas.js";
import { router as authRouter } from "./routes/auth.js";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

await connectDB().then(() => {
  console.log("✅ Conectado a la base de datos");
}).catch((error) => {
  console.error("Error al conectar a la base de datos:", error);
  process.exit(1);
});

// Middlewares
app.use(cors());
app.use(express.json()); // Más moderno que body-parser


// Rutas
app.use("/api/productos", productosRouter);
app.use("/api/recetas", recetasRouter);
app.use("/api/ventas", ventasRouter);
app.use("/api/auth", authRouter); // Agregar la ruta de autenticación


app.get("/", (req, res) => {
  res.send("Backend de la Pastelería Online - API Activa");
});

// Manejo de errores básico (opcional pero recomendado)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal en el servidor");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 


