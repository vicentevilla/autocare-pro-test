import { useState } from 'react';
import { actualizar } from '../data/baseDatos';
import { useApp } from '../context/AppContext';
import { validarNombre } from '../utils/validaciones';
import CampoTexto from '../components/CampoTexto';

export default function Perfil() {
  const { usuario, actualizarSesion } = useApp();
  const [nombre, setNombre] = useState(usuario.nombre);
  const [apellidos, setApellidos] = useState(usuario.apellidos ?? '');
  const [error, setError] = useState('');
  const [guardado, setGuardado] = useState(false);
  function handleSubmit(e) {
    e.preventDefault();
    const mensaje = validarNombre(nombre);
    setError(mensaje);
    setGuardado(false);
    if (mensaje) return;
    const actualizado = actualizar('usuarios', usuario.id, {
      nombre: nombre.trim(),
      apellidos,
    });
    actualizarSesion(actualizado);
    setGuardado(true);
  }
  return (
    <>
      <h1 className="h3">Mi perfil</h1>
      <form className="card card-body perfil-form" onSubmit={handleSubmit} noValidate>
        <p className="mb-3">
          <strong>Correo:</strong> {usuario.email} · <strong>Rol:</strong> {usuario.rol}
        </p>
        <CampoTexto
          id="perfil-nombre"
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          error={error}
        />
        <CampoTexto
          id="perfil-apellidos"
          label="Apellidos"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
        />
        <button type="submit" className="btn btn-primario">
          Guardar
        </button>
        {guardado && (
          <p className="text-success mt-2 mb-0" role="status">
            Perfil actualizado.
          </p>
        )}
      </form>
    </>
  );
}
