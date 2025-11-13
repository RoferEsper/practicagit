import { connection } from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const CLAVE_SECRETA = "CLAVE_SUPER_SECRETA"; 

// ✅ REGISTRO DE USUARIO
export const registrarUsuario = async (req, res) => {
  try {
    const { cuenta, password, id_persona, id_role } = req.body;

    if (!cuenta || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const sql = `
      INSERT INTO Usuarios (cuenta, password_hash, id_persona, id_role)
      VALUES (?, ?, ?, ?)
    `;
    const values = [cuenta, hashedPassword, id_persona || null, id_role || 2];

    await connection.query(sql, values);

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// ✅ LOGIN DE USUARIO
export const loginUsuario = async (req, res) => {
  try {
    const { cuenta, password } = req.body;

    if (!cuenta || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const sql = `
      SELECT u.*, r.nombre_role
      FROM Usuarios u
      JOIN Roles r ON u.id_role = r.id_role
      WHERE u.cuenta = ?
    `;
    const [rows] = await connection.query(sql, [cuenta]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const usuario = rows[0];
    const passwordValida = bcrypt.compareSync(password, usuario.password_hash);

    if (!passwordValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // ✅ Generamos el token (id_role asegurado como número)
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        cuenta: usuario.cuenta,
        id_role: Number(usuario.id_role), // 👈 fuerza tipo numérico
        nombre_role: usuario.nombre_role,
      },
      CLAVE_SECRETA,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login correcto",
      token,
      cuenta: usuario.cuenta,
      id_role: Number(usuario.id_role),
      nombre_role: usuario.nombre_role,
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
