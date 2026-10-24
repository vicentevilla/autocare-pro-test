import { Link, useParams } from 'react-router-dom';
import useColeccion from '../hooks/useColeccion';
import { formatearPrecio } from '../utils/carrito';

export default function UsuarioDetalle() {
  const { id } = useParams();
  const usuario = useColeccion('usuarios').find((u) => String(u.id) === id);
  const ordenes = useColeccion('ordenes');
  if (!usuario) return <p>Usuario no encontrado.</p>;
  const historial = ordenes.filter(
    (o) => o.usuarioId === usuario.id || o.cliente.email === usuario.email,
  );
  return (
    <>
      <h1 className="h3">
        {usuario.nombre} {usuario.apellidos}
      </h1>
      <div className="card card-body mb-4">
        <p className="mb-1">
          <strong>Correo:</strong> {usuario.email}
        </p>
        <p className="mb-1">
          <strong>Rol:</strong> {usuario.rol}
        </p>
        <p className="mb-0">
          <strong>Dirección:</strong>{' '}
          {usuario.calle
            ? `${usuario.calle}, ${usuario.comuna}, ${usuario.region}`
            : 'Sin registrar'}
        </p>
      </div>
      <h2 className="h5">Historial de compras</h2>
      {historial.length === 0 ? (
        <p className="text-secondary">Este usuario no tiene compras.</p>
      ) : (
        <div className="card">
          <table className="table mb-0">
            <thead>
              <tr>
                <th scope="col">Orden</th>
                <th scope="col">Fecha</th>
                <th scope="col">Estado</th>
                <th scope="col" className="text-end">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {historial.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link to={`/admin/ordenes/${o.id}`}>ORD-{o.id}</Link>
                  </td>
                  <td>{new Date(o.fecha).toLocaleDateString('es-CL')}</td>
                  <td>{o.estado}</td>
                  <td className="text-end">{formatearPrecio(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Link to={`/admin/usuarios/${usuario.id}/editar`} className="btn btn-primario mt-3">
        Editar usuario
      </Link>
    </>
  );
}
