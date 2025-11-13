import { useState } from "react";
import axios from "axios";
import { API_URL } from "../endpoints/api.js";

const Register = () => {
  const [cuenta, setCuenta] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/usuarios`, {
        cuenta,
        password,
      });
      setMensaje("✅ Usuario registrado correctamente");
      setCuenta("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al registrar usuario");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3 className="mb-4 text-center">Crear cuenta</h3>
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
        <button className="btn btn-success w-100" type="submit">
          Registrarse
        </button>
      </form>
      {mensaje && <p className="mt-3 text-center">{mensaje}</p>}
    </div>
  );
};

export default Register;
