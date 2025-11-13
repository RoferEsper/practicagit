import express from "express";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuariosCrud.js";
import { verificarToken, verificarRoles, verificarRol } from "../middleware/auth.js";

import { connection } from "../config/database.js";

const router = express.Router();

// ✅ CRUD de usuarios - Solo ADMIN (rol 1)
router.get("/admin/usuarios", verificarToken, verificarRol(1), getUsuarios);
router.post("/admin/usuarios", verificarToken, verificarRol(1), createUsuario);
router.put("/admin/usuarios/:id", verificarToken, verificarRol(1), updateUsuario);
router.delete("/admin/usuarios/:id", verificarToken, verificarRol(1), deleteUsuario);

// ✅ Listado de roles - Solo ADMIN (rol 1)
router.get("/admin/roles", verificarToken, verificarRol(1), async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT id_role, nombre_role FROM Roles ORDER BY id_role"
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener roles:", error);
    res.status(500).json({ message: "Error al obtener los roles" });
  }
});

export default router;
