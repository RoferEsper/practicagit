import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../endpoints/api.js";
import { useAuthStore } from "../store/useAuthStore.js"; // ✅ agregado
import "bootstrap/dist/css/bootstrap.min.css";

const Productos = () => {
  const { token, user } = useAuthStore(); // ✅ usamos token y user
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // 🟢 Obtener todos los productos
  const cargarProductos = async () => {
    try {
      const res = await axios.get(`${API_URL}/productos`, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ enviamos token
      });
      setProductos(res.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setMensaje("❌ No se pudieron cargar los productos (token inválido o expirado)");
    }
  };

  useEffect(() => {
    if (token) cargarProductos(); // ✅ solo si hay token
  }, [token]);

  // 🟡 Crear o actualizar producto
  const guardarProducto = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await axios.put(
          `${API_URL}/productos/${editando}`,
          { nombre, precio, descripcion },
          { headers: { Authorization: `Bearer ${token}` } } // ✅
        );
        setMensaje("✅ Producto actualizado correctamente");
      } else {
        await axios.post(
          `${API_URL}/productos`,
          { nombre, precio, descripcion },
          { headers: { Authorization: `Bearer ${token}` } } // ✅
        );
        setMensaje("✅ Producto creado correctamente");
      }

      setNombre("");
      setPrecio("");
      setDescripcion("");
      setEditando(null);
      cargarProductos();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      setMensaje("❌ Error al guardar producto");
    }
  };

  // 🔴 Eliminar producto
  const eliminarProducto = async (id) => {
    if (!confirm("¿Seguro que querés eliminar este producto?")) return;
    try {
      await axios.delete(`${API_URL}/productos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // ✅
      });
      setMensaje("🗑️ Producto eliminado");
      cargarProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setMensaje("❌ No tenés permisos para eliminar productos");
    }
  };

  // ✏️ Editar producto
  const editarProducto = (prod) => {
    setEditando(prod.id_producto);
    setNombre(prod.nombre);
    setPrecio(prod.precio);
    setDescripcion(prod.descripcion || "");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Gestión de Productos</h2>

      {user && (
        <form onSubmit={guardarProducto} className="card p-3 mb-4">
          <h5>{editando ? "Editar Producto" : "Nuevo Producto"}</h5>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <button type="submit" className="btn btn-success">
            {editando ? "Actualizar" : "Guardar"}
          </button>
          {editando && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditando(null);
                setNombre("");
                setPrecio("");
                setDescripcion("");
              }}
            >
              Cancelar
            </button>
          )}
        </form>
      )}

      {mensaje && <p className="text-center">{mensaje}</p>}

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((prod) => (
              <tr key={prod.id_producto}>
                <td>{prod.id_producto}</td>
                <td>{prod.nombre}</td>
                <td>${prod.precio}</td>
                <td>{prod.descripcion}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editarProducto(prod)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarProducto(prod.id_producto)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No hay productos cargados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Productos;
