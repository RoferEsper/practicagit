import { connection } from "../config/database.js";
import bcrypt from "bcryptjs";

// ✅ Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const [rows] = await connection.query(`
      SELECT u.id_usuario, u.cuenta, r.nombre_role, p.nombre, p.apellido
      FROM Usuarios u
      JOIN Roles r ON u.id_role = r.id_role
      LEFT JOIN Personas p ON u.id_persona = p.id_persona
      ORDER BY u.id_usuario ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// ✅ Crear un nuevo usuario (seleccionando rol)
export const createUsuario = async (req, res) => {
  try {
    const { cuenta, password, id_persona, id_role } = req.body;

    if (!cuenta || !password || !id_role) {
      return res
        .status(400)
        .json({ message: "Faltan datos obligatorios (cuenta, password o rol)" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await connection.query(
      `INSERT INTO Usuarios (cuenta, password_hash, id_persona, id_role)
       VALUES (?, ?, ?, ?)`,
      [cuenta, hashedPassword, id_persona || null, id_role]
    );

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

// ✅ Actualizar usuario (incluye cambio de rol)
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { cuenta, password, id_role } = req.body;

    let sql, values;

    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      sql = `UPDATE Usuarios SET cuenta = ?, password_hash = ?, id_role = ? WHERE id_usuario = ?`;
      values = [cuenta, hashedPassword, id_role, id];
    } else {
      sql = `UPDATE Usuarios SET cuenta = ?, id_role = ? WHERE id_usuario = ?`;
      values = [cuenta, id_role, id];
    }

    const [result] = await connection.query(sql, values);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// ✅ Eliminar usuario
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await connection.query(
      `DELETE FROM Usuarios WHERE id_usuario = ?`,
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
