import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";

const RutaProtegida = ({ children, rolPermitido }) => {
  const { token, user } = useAuthStore();

  // Si no hay token, redirigir a login
  if (!token) return <Navigate to="/login" />;

  // Si hay restricción de rol y el usuario no cumple, redirigir al home
  if (rolPermitido && user?.id_role !== rolPermitido) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RutaProtegida;
