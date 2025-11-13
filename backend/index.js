import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers/router.js";
import routerProductos from "./routers/routerProductos.js";
import routerUsuariosCrud from "./routers/routerUsuariosCrud.js"; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// rutas
app.use("/api", router);
app.use("/api", routerProductos);
app.use("/api", routerUsuariosCrud);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
