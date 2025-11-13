  import { useState, useEffect } from "react";
  import { useAuthStore } from "../store/useAuthStore.js";
  import { useNavigate } from "react-router-dom";



  const Login = () => {
  const [cuenta, setCuenta] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, loading, token } = useAuthStore();
  const navigate = useNavigate();




  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(cuenta, password);
  };




  // 🔁 Si existe token, redirige automáticamente
  useEffect(() => {
    if (token) {
      navigate("/"); // o la ruta que quieras (por ejemplo "/protegida")
    }
  }, [token, navigate]);




  return (
    
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3 className="mb-4 text-center">Iniciar Sesión</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Cuenta"
          className="form-control mb-2"
          value={cuenta}
          onChange={(e) => setCuenta(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button disabled={loading} className="btn btn-primary w-100">
          {loading ? "Cargando..." : "Ingresar"}
        </button>
        {error && <p className="text-danger mt-3">{error}</p>}
      </form>
    </div>
  );
};






export default Login;
