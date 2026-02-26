import { db } from "../config/db.js";
import validatorPkg from "express-validator";
const { body, param, validationResult } = validatorPkg;
import express from "express";
import checkAuth from '../middleware/checkAuth.js';


export const router = express.Router(); //es un contenedor de rutas

// Middleware para manejar errores de validación
//Un middleware es un metodo que se ejecuta antes de que se llegue a las peticiones(importe recordar)
// Revisa los resultados de las validaciones y responde con 400 si hay errores
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

//crear el producto
router.post(
  "/",
  body("tipo").isString().withMessage("El tipo es obligatorio"),
  body("nombre").isString().withMessage("El nombre es obligatorio"),
  body("descripcion").isString().withMessage("La descripción es obligatoria"),
  body("unidad")
    .isIn(["u", "g", "kg", "ml", "l"])
    .withMessage("La unidad debe ser: u, g, kg, ml o l"),
  body("vendible")
    .exists()
    .withMessage("El campo vendible es obligatorio") // Verifica que el campo exista
    .isIn([0, 1])
    .withMessage("El campo vendible debe ser 1 o 0"),
  body("costo_unitario")
    .optional()
    .isNumeric()
    .withMessage("El costo unitario debe ser un número")
    .isFloat({ gt: 0 })
    .withMessage("El costo unitario debe ser un número positivo")
    .toFloat(),
  body("precio_venta")
    .optional()
    .isNumeric()
    .withMessage("El precio de venta debe ser un número")
    .isFloat({ gt: 0 })
    .withMessage("El precio de venta debe ser un número positivo")
    .toFloat(),
  handleValidationErrors,
  async (req, res) => {
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
        message:
          "Error al crear el producto, por favor revisa los datos ingresados",
        error: error.message,
      });
    }
  },
);

//Como la base de datos tarda un poco en responder,
// usamos await para esperar a que termine antes de seguir con la siguiente línea.
//La función query devuelve un arreglo con mucha información. Al poner los corchetes en [rows],
// estás extrayendo solo el primer elemento, que contiene el resultado de la operación
//en este post lo que vamos a hacer que es se puedan ingresar varios productos a la vez
//El asterisco * le dice al validador que debe entrar en el array y chequea cada uno de los elementos que están adentro
//El método isArray() verifica que el cuerpo de la solicitud sea un arreglo
//const valores es un array de arrays, donde cada lista interna representa un producto con sus respectivos campos

router.post(
  "/bulk",
  body()
    .isArray({ min: 1 })
    .withMessage("La lista de productos no puede estar vacía"),
  body("*.tipo").isString().withMessage("El tipo es obligatorio"),
  body("*.nombre").isString().withMessage("El nombre es obligatorio"),
  body("*.descripcion").isString().withMessage("La descripción es obligatoria"),
  body("*.unidad")
    .isIn(["u", "g", "kg", "ml", "l"])
    .withMessage("La unidad debe ser: u, g, kg, ml o l"),
  body("*.vendible")
    .exists()
    .withMessage("El campo vendible es obligatorio") // Verifica que el campo exista
    .isBoolean()
    .withMessage("El campo vendible debe ser verdadero o falso"),
  body("*.costo_unitario")
    .optional()
    .isNumeric()
    .withMessage("El costo unitario debe ser un número"),
  body("*.precio_venta")
    .optional()
    .isNumeric()
    .withMessage("El precio de venta debe ser un número"),
  handleValidationErrors,
  async (req, res) => {
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
        message:
          "Error al crear los productos, por favor revisa los datos ingresados",
        error: error.message,
      });
    }
  },
);

//obtenemos todos los productos
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM productos");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
});

// Esta ruta ahora está protegida. Solo usuarios logueados pueden ver el stock.
router.get('/stock', checkAuth, (req, res) => {
    res.json({ msg: `Bienvenido ${req.usuario.nombre}, aquí tienes el stock de ingredientes.` });
});

//obtenemos un producto por id
router.get(
  "/:id",
  param("id").isInt().withMessage("El ID debe ser un número"),
  handleValidationErrors,
  async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query("SELECT * FROM productos WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener el producto" });
    }
  },
);

//actualizar el producto por medio de su id
// la funcion try lo que hace que si la base de datos tarda en responder,
// el codigo espera a que la base de datos responda para continuar con la siguiente linea.
//affectedRows sirve para verificar si la actualizacion se realizo correctamente

router.put("/:id", async (req, res) => {
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
});

export default router;
