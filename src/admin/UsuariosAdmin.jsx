import { Link } from 'react-router-dom';
import { eliminar } from '../data/baseDatos';
import { useApp } from '../context/AppContext';
import useColeccion from '../hooks/useColeccion';

export default function UsuariosAdmin({ confirmar = window.confirm }) {
  const usuarios = useColeccion('usuarios');
  const { usuario: actual } = useApp();
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primario btn-sm">
          + Nuevo usuario
        </Link>
      </div>
      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Rol</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <th scope="row">{u.id}</th>
                  <td>
                    {u.nombre} {u.apellidos}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${u.rol === 'admin' ? 'text-bg-dark' : 'text-bg-info'}`}
                    >
                      {u.rol}
                    </span>
                  </td>
                  <td className="text-nowrap">
                    <Link
                      to={`/admin/usuarios/${u.id}`}
                      className="btn btn-sm btn-outline-dark"
                    >
                      Ver
                    </Link>{' '}
                    <Link
                      to={`/admin/usuarios/${u.id}/editar`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Editar
                    </Link>{' '}
                    {u.id !== actual?.id && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        aria-label={`Eliminar ${u.email}`}
                        onClick={() =>
                          confirmar(`¿Eliminar a ${u.email}?`) &&
                          eliminar('usuarios', u.id)
                        }
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
