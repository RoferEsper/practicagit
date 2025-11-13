import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const CLAVE_SECRETA = process.env.JWT_SECRET ;


// ✅ Verificar Token (válido para todos los roles)
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, CLAVE_SECRETA);
    req.user = user; // guardamos los datos del usuario en la request
    next();
  } catch (error) {
    console.error("❌ Error verificando token:", error.message);
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
  console.log("🟢 Token recibido:", authHeader);
console.log("🟢 Usuario decodificado:", req.user);

};




// ✅ Verificar un solo rol (por ID)
export const verificarRol = (rolPermitido) => {
  return (req, res, next) => {
    const { id_role } = req.user;
    if (id_role !== rolPermitido) {
      return res.status(403).json({ message: "Acceso denegado: rol no autorizado" });
    }
    next();
  };
};

// ✅ Verificar múltiples roles
// ✅ Permite uno o varios roles
export const verificarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    const { id_role } = req.user;

    if (!rolesPermitidos.includes(id_role)) {
      console.log("⛔ Acceso denegado. Rol actual:", id_role, "Permitidos:", rolesPermitidos);
      return res.status(403).json({ message: "Acceso denegado: rol no autorizado" });
    }

    next();
  };
};
