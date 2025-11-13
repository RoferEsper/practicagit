import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../endpoints/api.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";

const Usuarios = () => {
  const { token, user } = useAuthStore();
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    cuenta: "",
    password: "",
    id_role: 2,
  });
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [show, setShow] = useState(false); // controla el modal

  const handleClose = () => setShow(false);
  const handleShow = (usuario = null) => {
    if (usuario) {
      setEditando(usuario.id_usuario);
      setFormData({
        cuenta: usuario.cuenta,
        password: "",
        id_role:
          roles.find((r) => r.nombre_role === usuario.nombre_role)?.id_role || 2,
      });
    } else {
      setEditando(null);
      setFormData({ cuenta: "", password: "", id_role: 2 });
    }
    setShow(true);
  };

  // 🔁 Cargar usuarios y roles (solo si es admin)
  const cargarUsuarios = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al cargar usuarios");
    }
  };

  const cargarRoles = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token && user?.id_role === 1) {
      cargarUsuarios();
      cargarRoles();
    }
  }, [token]);

  // 🟢 Crear o editar usuario
  const guardarUsuario = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(`${API_URL}/admin/usuarios/${editando}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensaje("✅ Usuario actualizado correctamente");
      } else {
        await axios.post(`${API_URL}/admin/usuarios`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensaje("✅ Usuario creado correctamente");
      }

      setEditando(null);
      setFormData({ cuenta: "", password: "", id_role: 2 });
      cargarUsuarios();
      handleClose();
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al guardar usuario");
    }
  };

  // 🔴 Eliminar usuario
  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que querés eliminar este usuario?")) return;
    try {
      await axios.delete(`${API_URL}/admin/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("🗑️ Usuario eliminado");
      cargarUsuarios();
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al eliminar usuario");
    }
  };

  // 🚫 Protección de acceso
  if (!token || user?.id_role !== 1) {
    return (
      <div className="text-center mt-5">
        <h3>🚫 Acceso restringido</h3>
        <p>Solo los administradores pueden ver esta página.</p>
        <Link to="/" className="btn btn-primary mt-3">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Gestión de Usuarios</h2>

      <Button variant="success" className="mb-3" onClick={() => handleShow()}>
        + Nuevo Usuario
      </Button>

      {mensaje && <p className="text-center">{mensaje}</p>}

      {/* 🧾 Tabla de usuarios */}
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Cuenta</th>
            <th>Rol</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((u) => (
              <tr key={u.id_usuario}>
                <td>{u.id_usuario}</td>
                <td>{u.cuenta}</td>
                <td>{u.nombre_role}</td>
                <td>{u.nombre || "-"}</td>
                <td>{u.apellido || "-"}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShow(u)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => eliminarUsuario(u.id_usuario)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No hay usuarios cargados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🪟 Modal React-Bootstrap */}
      <Modal show={show} onHide={handleClose} centered>
        <Form onSubmit={guardarUsuario}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editando ? "Editar Usuario" : "Nuevo Usuario"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Control
              type="text"
              className="mb-2"
              placeholder="Cuenta"
              value={formData.cuenta}
              onChange={(e) =>
                setFormData({ ...formData, cuenta: e.target.value })
              }
              required
            />
            <Form.Control
              type="password"
              className="mb-2"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required={!editando}
            />
            <Form.Select
              value={formData.id_role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  id_role: Number(e.target.value),
                })
              }
            >
              {roles.map((r) => (
                <option key={r.id_role} value={r.id_role}>
                  {r.nombre_role}
                </option>
              ))}
            </Form.Select>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="success" type="submit">
              {editando ? "Actualizar" : "Guardar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Usuarios;
