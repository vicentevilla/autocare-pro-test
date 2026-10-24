import { useState } from 'react';
import { Link } from 'react-router-dom';
import useColeccion from '../hooks/useColeccion';
import { formatearPrecio } from '../utils/carrito';

export default function OrdenesAdmin() {
  const ordenes = useColeccion('ordenes');
  const [estado, setEstado] = useState('todas');
  const visibles = ordenes
    .filter((o) => estado === 'todas' || o.estado === estado)
    .sort((a, b) => b.id - a.id);
  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Órdenes</h1>
        <div>
          <label htmlFor="filtro-estado" className="visually-hidden">
            Filtrar por estado
          </label>
          <select
            id="filtro-estado"
            className="form-select form-select-sm"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="todas">Todas</option>
            <option value="pagada">Pagadas</option>
            <option value="rechazada">Rechazadas</option>
          </select>
        </div>
      </div>
      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Orden</th>
                <th scope="col">Fecha</th>
                <th scope="col">Cliente</th>
                <th scope="col">Estado</th>
                <th scope="col" className="text-end">
                  Total
                </th>
                <th scope="col">
                  <span className="visually-hidden">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((o) => (
                <tr key={o.id}>
                  <td>ORD-{o.id}</td>
                  <td>{new Date(o.fecha).toLocaleDateString('es-CL')}</td>
                  <td>
                    {o.cliente.nombre} {o.cliente.apellidos}
                  </td>
                  <td>
                    <span
                      className={`badge ${o.estado === 'pagada' ? 'text-bg-success' : 'text-bg-danger'}`}
                    >
                      {o.estado}
                    </span>
                  </td>
                  <td className="text-end">{formatearPrecio(o.total)}</td>
                  <td>
                    <Link
                      to={`/admin/ordenes/${o.id}`}
                      className="btn btn-sm btn-outline-dark"
                    >
                      Ver boleta
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visibles.length === 0 && (
          <p className="p-3 mb-0 text-secondary">No hay órdenes.</p>
        )}
      </div>
    </>
  );
}
