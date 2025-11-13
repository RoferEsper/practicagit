import express from "express";
import { registrarUsuario, loginUsuario } from "../controllers/usuarios.js";
import { verificarToken, verificarRol } from "../middleware/auth.js";
import { connection } from "../config/database.js";

const router = express.Router();

// 🟢 Registro de usuarios
router.post("/register", registrarUsuario);

// 🟢 Login
router.post("/login", loginUsuario);

// 🟡 Perfil (rutas protegidas para usuarios logueados)
router.get("/perfil", verificarToken, async (req, res) => {
  try {
    const { id_usuario } = req.user;

    const [rows] = await connection.query(
      `SELECT u.id_usuario, u.cuenta, r.nombre_role, p.nombre, p.apellido
       FROM Usuarios u
       JOIN Roles r ON u.id_role = r.id_role
       LEFT JOIN Personas p ON u.id_persona = p.id_persona
       WHERE u.id_usuario = ?`,
      [id_usuario]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ user: rows[0] });
  } catch (err) {
    console.error("Error al obtener perfil:", err);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
});

// 🔐 Ruta solo para administradores
router.get("/admin", verificarToken, verificarRol(1), async (req, res) => {
  try {
    const [rows] = await connection.query(
      `SELECT u.cuenta, r.nombre_role
       FROM Usuarios u
       JOIN Roles r ON u.id_role = r.id_role`
    );
    res.json({ message: "Panel de Administración", usuarios: rows });
  } catch (err) {
    console.error("Error en ruta admin:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;
