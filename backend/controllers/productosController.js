import { db } from "../config/db.js";

export const createProducto = async (req, res) => {
  const {
    tipo,
    nombre,
    descripcion,
    unidad,
    vendible,
    costo_unitario,
    precio_venta,
  } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO productos (tipo,nombre,descripcion,unidad,vendible,costo_unitario,precio_venta) VALUES (?,?,?,?,?,?,?)",
      [
        tipo,
        nombre,
        descripcion,
        unidad,
        vendible ? 1 : 0,
        costo_unitario || 0,
        precio_venta || 0,
      ],
    );
    res.status(201).json({
      message: "Producto creado exitosamente",
      productId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al crear el producto, por favor revisa los datos ingresados",
      error: error.message,
    });
  }
};

export const createProductosBulk = async (req, res) => {
  const productos = req.body;
  const valores = productos.map((p) => [
    p.tipo,
    p.nombre,
    p.descripcion,
    p.unidad,
    p.vendible ? 1 : 0,
    p.costo_unitario || 0,
    p.precio_venta || 0,
  ]);
  try {
    const [result] = await db.query(
      "INSERT INTO productos (tipo,nombre,descripcion,unidad,vendible,costo_unitario,precio_venta) VALUES ?",
      [valores],
    );
    res.status(201).json({
      message: "Los productos fueron creados exitosamente",
      count: result.affectedRows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al crear los productos, por favor revisa los datos ingresados",
      error: error.message,
    });
  }
};

export const getProductos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM productos");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

export const getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM productos WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el producto" });
  }
};

export const updateProducto = async (req, res) => {
  const { id } = req.params;
  const {
    tipo,
    nombre,
    descripcion,
    unidad,
    vendible,
    costo_unitario,
    precio_venta,
  } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE productos SET tipo = COALESCE(?, tipo), nombre = COALESCE(?, nombre), descripcion = COALESCE(?, descripcion), unidad = COALESCE(?, unidad), vendible = COALESCE(?, vendible), costo_unitario = COALESCE(?, costo_unitario), precio_venta = COALESCE(?, precio_venta) WHERE id = ?",
      [
        tipo,
        nombre,
        descripcion,
        unidad,
        vendible,
        costo_unitario,
        precio_venta,
        id,
      ],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar el producto",
      error: error.message,
    });
  }
};

export const getStock = (req, res) => {
  res.json({ msg: `Bienvenido ${req.usuario.nombre}, aquí tienes el stock de ingredientes.` });
};
