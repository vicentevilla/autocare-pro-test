import { Link, useParams } from 'react-router-dom';
import useColeccion from '../hooks/useColeccion';
import { formatearPrecio } from '../utils/carrito';

export default function ProductoDetalleAdmin() {
  const { id } = useParams();
  const producto = useColeccion('productos').find((p) => String(p.id) === id);
  if (!producto) return <p>Producto no encontrado.</p>;
  const filas = [
    ['ID', producto.id],
    ['Categoría', producto.categoria],
    ['Precio', formatearPrecio(producto.precio)],
    [
      'Precio oferta',
      producto.precioOferta != null ? formatearPrecio(producto.precioOferta) : '—',
    ],
    ['Stock', producto.stock],
    ['Imagen', producto.imagen],
  ];
  return (
    <>
      <h1 className="h3">{producto.nombre}</h1>
      <div className="card">
        <div className="card-body row g-4">
          <div className="col-md-4 text-center">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid admin-detalle-img"
            />
          </div>
          <div className="col-md-8">
            <p>{producto.descripcion}</p>
            <dl className="row mb-0">
              {filas.map(([k, v]) => (
                <div className="col-sm-6" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <Link
              to={`/admin/productos/${producto.id}/editar`}
              className="btn btn-primario"
            >
              Editar producto
            </Link>{' '}
            <Link to="/admin/productos" className="btn btn-outline-dark">
              Volver
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
