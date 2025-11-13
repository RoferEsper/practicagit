import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const CLAVE_SECRETA = process.env.JWT_SECRET || "CLAVE_SUPER_SECRETA";

// ✅ Verificar Token
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, CLAVE_SECRETA);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};

// ✅ Verificar un rol específico
export const verificarRol = (rolPermitido) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { id_role } = req.user;
    if (id_role !== rolPermitido) {
      return res.status(403).json({ message: "Acceso denegado: rol no autorizado" });
    }

    next();
  };
};

// ✅ Verificar varios roles
export const verificarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { id_role } = req.user;
    if (!rolesPermitidos.includes(id_role)) {
      return res.status(403).json({ message: "Acceso denegado: rol no autorizado" });
    }

    next();
  };
};
