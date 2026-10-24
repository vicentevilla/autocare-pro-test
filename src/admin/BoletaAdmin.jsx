import { Link, useParams } from 'react-router-dom';
import { obtener } from '../data/baseDatos';
import ResumenOrden from '../components/ResumenOrden';

export default function BoletaAdmin() {
  const { id } = useParams();
  const orden = obtener('ordenes', id);
  if (!orden) return <p>Orden no encontrada.</p>;
  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Boleta ORD-{orden.id}</h1>
        <span
          className={`badge fs-6 ${orden.estado === 'pagada' ? 'text-bg-success' : 'text-bg-danger'}`}
        >
          {orden.estado}
        </span>
      </div>
      <div className="card card-body">
        <p className="small text-secondary">
          Fecha: {new Date(orden.fecha).toLocaleString('es-CL')}
        </p>
        <ResumenOrden orden={orden} />
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-danger" onClick={() => window.print()}>
            Imprimir
          </button>
          <Link to="/admin/ordenes" className="btn btn-outline-dark">
            Volver
          </Link>
        </div>
      </div>
    </>
  );
}
