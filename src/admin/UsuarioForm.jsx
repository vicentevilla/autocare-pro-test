import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { actualizar, crear, listar, obtener } from '../data/baseDatos';
import { useApp } from '../context/AppContext';
import { validarClave, validarEmail, validarNombre } from '../utils/validaciones';
import CampoTexto from '../components/CampoTexto';

export default function UsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario: sesion, actualizarSesion } = useApp();
  const existente = id ? obtener('usuarios', id) : null;
  const [valores, setValores] = useState(
    existente ?? {
      nombre: '',
      apellidos: '',
      email: '',
      clave: '',
      rol: 'cliente',
    },
  );
  const [errores, setErrores] = useState({});
  if (id && !existente) return <p>Usuario no encontrado.</p>;
  const handleChange = (e) =>
    setValores({
      ...valores,
      [e.target.name]: e.target.value,
    });
  function handleSubmit(e) {
    e.preventDefault();
    const duplicado = listar('usuarios').some(
      (u) =>
        u.email.toLowerCase() === valores.email.trim().toLowerCase() &&
        u.id !== existente?.id,
    );
    const nuevos = {
      nombre: validarNombre(valores.nombre),
      email: duplicado ? 'Ese correo ya está registrado.' : validarEmail(valores.email),
      clave: validarClave(valores.clave),
    };
    setErrores(nuevos);
    if (Object.values(nuevos).some(Boolean)) return;
    const datos = {
      ...valores,
      nombre: valores.nombre.trim(),
      email: valores.email.trim(),
    };
    if (existente) {
      const guardado = actualizar('usuarios', id, datos);
      if (guardado.id === sesion?.id) actualizarSesion(guardado);
    } else {
      crear('usuarios', {
        calle: '',
        depto: '',
        region: '',
        comuna: '',
        ...datos,
      });
    }
    navigate('/admin/usuarios');
  }
  return (
    <>
      <h1 className="h3">{existente ? 'Editar usuario' : 'Nuevo usuario'}</h1>
      <form className="card card-body" onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          <CampoTexto
            id="nombre"
            label="Nombre *"
            value={valores.nombre}
            onChange={handleChange}
            error={errores.nombre}
            className="col-md-6"
          />
          <CampoTexto
            id="apellidos"
            label="Apellidos"
            value={valores.apellidos}
            onChange={handleChange}
            className="col-md-6"
          />
          <CampoTexto
            id="email"
            label="Correo *"
            type="email"
            value={valores.email}
            onChange={handleChange}
            error={errores.email}
            className="col-md-6"
          />
          <CampoTexto
            id="clave"
            label="Contraseña *"
            type="password"
            value={valores.clave}
            onChange={handleChange}
            error={errores.clave}
            className="col-md-6"
            ayuda="Mínimo 8 caracteres, una mayúscula y un número."
          />
          <CampoTexto
            id="rol"
            label="Rol"
            como="select"
            value={valores.rol}
            onChange={handleChange}
            className="col-md-6"
          >
            <option value="cliente">cliente</option>
            <option value="admin">admin</option>
          </CampoTexto>
        </div>
        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primario">
            {existente ? 'Guardar cambios' : 'Crear usuario'}
          </button>
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}
