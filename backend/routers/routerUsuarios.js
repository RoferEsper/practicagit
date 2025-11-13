import express from "express";
import { registrarUsuario } from "../controllers/usuarios.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/usuarios", registrarUsuario);
router.get("/usuarios", verificarToken, (req, res) => {
  res.json({ message: "Acceso permitido", usuario: req.user });
});

export default router;
