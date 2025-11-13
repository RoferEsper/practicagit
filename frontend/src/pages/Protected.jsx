import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";

const Protected = () => {
  const { fetchUser, user, token } = useAuthStore();

  useEffect(() => {
    if (token) fetchUser();
  }, [token]);

  if (!token) return <h4 className="text-center mt-5">Acceso denegado 🚫</h4>;

  return (
    <div className="container mt-5 text-center">
      <h3>Zona Protegida 🔒</h3>
      {user ? (
        <p>Bienvenido, {user.cuenta}</p>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}
    </div>
  );
};

export default Protected;
