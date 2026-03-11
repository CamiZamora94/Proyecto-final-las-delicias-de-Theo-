import { db } from "../config/db.js";

export const getRecetas = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM recetas");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las recetas" });
  }
};

export const getRecetaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM recetas WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la receta" });
  }
};

export const createReceta = async (req, res) => {
  const { nombre, producto_id } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO recetas (nombre, producto_id) VALUES (?, ?)",
      [nombre, producto_id],
    );
    res.status(201).json({
      message: "Cabecera de receta creada",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    if (error && (error.code === "ER_NO_REFERENCED_ROW_2" || error.errno === 1452)) {
      return res.status(400).json({ message: "Producto final no existe" });
    }
    res.status(500).json({ message: "Error al crear la receta", error: error.message });
  }
};

export const addIngrediente = async (req, res) => {
  const { receta_id, producto_id } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO ingredientes_receta (receta_id, producto_id) VALUES (?, ?)",
      [receta_id, producto_id],
    );
    res.status(201).json({
      message: "Ingrediente añadido con éxito a la receta",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "La receta o el producto especificado no existen" });
    }
    res.status(500).json({ message: "Error al guardar el ingrediente" });
  }
};

export const updateReceta = async (req, res) => {
  const { id } = req.params;
  const { nombre, producto_id } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE recetas SET nombre = COALESCE(?, nombre), producto_id = COALESCE(?, producto_id) WHERE id = ?",
      [nombre, producto_id, id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Receta no encontrada" });
    }
    res.json({ message: "Receta actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la receta" });
  }
};

export const deleteReceta = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM recetas WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "La receta que desea eliminar no existe" });
    }
    res.json({ message: "Receta y sus ingredientes eliminados correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la receta completa, por favor revisar" });
  }
};
