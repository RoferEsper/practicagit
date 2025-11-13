import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Protected from "./pages/Protected.jsx";
import Register from "./pages/Register.jsx";
import Productos from "./pages/Productos.jsx";
import Usuarios from "./pages/Usuarios.jsx";
import RutaProtegida from "./components/RutaProtegida.jsx"; // 👈 nuevo
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore.js";

const App = () => {
  const { token, user, fetchUser } = useAuthStore();

  useEffect(() => {
    if (token && !user) fetchUser();
  }, [token, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 Todos los logueados pueden acceder */}
      <Route
        path="/productos"
        element={
          <RutaProtegida>
            <Productos />
          </RutaProtegida>
        }
      />

      {/* 👑 Solo el admin (rol 1) puede entrar */}
      <Route
        path="/usuarios"
        element={
          <RutaProtegida rolPermitido={1}>
            <Usuarios />
          </RutaProtegida>
        }
      />

      {/* Ejemplo genérico */}
      <Route
        path="/protegida"
        element={
          <RutaProtegida>
            <Protected />
          </RutaProtegida>
        }
      />
    </Routes>
  </BrowserRouter>
)};

export default App;
