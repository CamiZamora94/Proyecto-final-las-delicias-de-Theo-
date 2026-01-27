import mysql from "mysql2/promise"; //es una promesa es trabajar de forma asincronica

export let db; //es una variable que el db

export async function connectDB() {
  //en este archivo se conecta a la base de datos
  db = await mysql.createConnection({
    //crear la conexion por medio del await
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}
