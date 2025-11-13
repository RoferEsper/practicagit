import { connection } from "../config/database.js";

// ✅ Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM Productos");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// ✅ Obtener un producto por ID
export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await connection.query(
      "SELECT * FROM Productos WHERE id_producto = ?",
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Producto no encontrado" });

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
};

// ✅ Crear un nuevo producto
export const createProducto = async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body;

    if (!nombre || !precio) {
      return res
        .status(400)
        .json({ message: "Faltan datos obligatorios (nombre o precio)" });
    }

    const sql =
      "INSERT INTO Productos (nombre, precio, descripcion) VALUES (?, ?, ?)";
    const values = [nombre, precio, descripcion || null];

    await connection.query(sql, values);

    res.status(201).json({ message: "Producto creado correctamente" });
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ message: "Error al crear producto" });
  }
};

// ✅ Actualizar un producto
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, descripcion } = req.body;

    const sql =
      "UPDATE Productos SET nombre = ?, precio = ?, descripcion = ? WHERE id_producto = ?";
    const [result] = await connection.query(sql, [
      nombre,
      precio,
      descripcion,
      id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Producto no encontrado" });

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};

// ✅ Eliminar un producto
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await connection.query(
      "DELETE FROM Productos WHERE id_producto = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Producto no encontrado" });

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};
