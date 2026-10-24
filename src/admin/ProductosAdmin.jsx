import { Link } from 'react-router-dom';
import { eliminar } from '../data/baseDatos';
import useColeccion from '../hooks/useColeccion';
import { formatearPrecio } from '../utils/carrito';
import { STOCK_CRITICO, productosCriticos } from '../utils/reportes';

export default function ProductosAdmin({
  soloCriticos = false,
  confirmar = window.confirm,
}) {
  const todos = useColeccion('productos');
  const categorias = useColeccion('categorias');
  const productos = soloCriticos ? productosCriticos(todos) : todos;
  const nombreCategoria = Object.fromEntries(categorias.map((c) => [c.slug, c.nombre]));
  function handleEliminar(producto) {
    if (confirmar(`¿Eliminar "${producto.nombre}"?`)) eliminar('productos', producto.id);
  }
  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">{soloCriticos ? 'Productos críticos' : 'Productos'}</h1>
        <div className="d-flex gap-2">
          {soloCriticos ? (
            <Link to="/admin/productos" className="btn btn-outline-dark btn-sm">
              Ver todos
            </Link>
          ) : (
            <Link
              to="/admin/productos/criticos"
              className="btn btn-outline-warning btn-sm"
            >
              Stock crítico
            </Link>
          )}
          <Link to="/admin/productos/nuevo" className="btn btn-primario btn-sm">
            + Nuevo producto
          </Link>
        </div>
      </div>
      {soloCriticos && (
        <p className="text-secondary">Productos con {STOCK_CRITICO} unidades o menos.</p>
      )}
      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Producto</th>
                <th scope="col">Categoría</th>
                <th scope="col" className="text-end">
                  Precio
                </th>
                <th scope="col" className="text-center">
                  Stock
                </th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <th scope="row">{p.id}</th>
                  <td>
                    <img src={p.imagen} alt="" className="miniatura me-2" />
                    {p.nombre}
                  </td>
                  <td>{nombreCategoria[p.categoria] ?? p.categoria}</td>
                  <td className="text-end">
                    {formatearPrecio(p.precioOferta ?? p.precio)}
                    {p.precioOferta != null && (
                      <span className="badge text-bg-danger ms-1">Oferta</span>
                    )}
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge ${p.stock <= STOCK_CRITICO ? 'text-bg-danger' : 'text-bg-secondary'}`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="text-nowrap">
                    <Link
                      to={`/admin/productos/${p.id}`}
                      className="btn btn-sm btn-outline-dark"
                    >
                      Ver
                    </Link>{' '}
                    <Link
                      to={`/admin/productos/${p.id}/editar`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Editar
                    </Link>{' '}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      aria-label={`Eliminar ${p.nombre}`}
                      onClick={() => handleEliminar(p)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {productos.length === 0 && (
          <p className="p-3 mb-0 text-secondary">No hay productos.</p>
        )}
      </div>
    </>
  );
}
