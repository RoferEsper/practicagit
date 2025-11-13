import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";

const Home = () => {
  const { user, token, logout, fetchUser } = useAuthStore();

  // 🔁 Cada vez que haya token, cargar datos del usuario
  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, fetchUser]);

  return (
    <div className="container mt-5 text-center">
      <h2>Bienvenido al sistema</h2>

      {!token ? (
        <Link to="/login" className="btn btn-primary mt-3">
          Ir a Login
        </Link>
      ) : (
        <>
          <div className="mt-3">
            <p>
              <strong>Usuario autenticado:</strong>{" "}
              {user ? user.cuenta : "Cargando..."}
            </p>
            <p>
              <strong>Rol:</strong>{" "}
              {user ? user.nombre_role : "Cargando rol..."}
            </p>
          </div>

          {/* 🔸 Panel de administración (si es admin) */}
          {user?.id_role === 1 && (
            <div className="mt-3">
              <Link to="/admin" className="btn btn-warning me-2">
                Ir al panel de administración
              </Link>

              {/* 👇 Botón adicional para gestión de usuarios */}
              <Link to="/usuarios" className="btn btn-secondary">
                Gestión de Usuarios
              </Link>
            </div>
          )}

          {/* 🔹 Acceso general a productos */}
          <div className="mt-3">
            <Link to="/productos" className="btn btn-dark me-2">
              Ir a Productos
            </Link>
          </div>

          {/* 🔴 Logout */}
          <button className="btn btn-danger mt-3" onClick={logout}>
            Cerrar sesión
          </button>


        </>
      )}
    </div>
  );
};

export default Home;
