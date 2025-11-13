// import express from "express";
// import {
//   getProductos,
//   getProductoById,
//   createProducto,
//   updateProducto,
//   deleteProducto,
// } from "../controllers/productos.js";

// const router = express.Router();

// // CRUD de productos
// router.get("/productos", getProductos);
// router.get("/productos/:id", getProductoById);
// router.post("/productos", createProducto);
// router.put("/productos/:id", updateProducto);
// router.delete("/productos/:id", deleteProducto);

// export default router;


import express from "express";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/productos.js";
import { verificarToken, verificarRoles, verificarRol } from "../middleware/auth.js";

const router = express.Router();

// 👁️ Ver todos los productos — acceso a cualquier usuario autenticado
router.get("/productos", verificarToken, getProductos);

// 🧱 Solo admin puede crear, editar o eliminar
router.post("/productos", verificarToken, verificarRoles(1, 2), createProducto);
router.put("/productos/:id", verificarToken, verificarRoles(1, 2), updateProducto);
router.delete("/productos/:id", verificarToken, verificarRoles(1), deleteProducto);

export default router;
