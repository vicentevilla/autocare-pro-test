import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import useColeccion from '../hooks/useColeccion';
import Precio from '../components/Precio';
import ListaProductos from '../components/ListaProductos';

export default function DetalleProducto() {
  const { id } = useParams();
  const productos = useColeccion('productos');
  const categorias = useColeccion('categorias');
  const { agregar } = useApp();
  const [cantidad, setCantidad] = useState(1);
  const [aviso, setAviso] = useState('');
  const producto = productos.find((p) => String(p.id) === id);
  if (!producto) {
    return (
      <div className="container section-space">
        <h1 className="h3">Producto no encontrado</h1>
        <Link to="/productos">Volver al catálogo</Link>
      </div>
    );
  }
  const categoria = categorias.find((c) => c.slug === producto.categoria);
  const relacionados = productos
    .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 3);
  function handleAgregar() {
    for (let i = 0; i < cantidad; i++) agregar(producto);
    setAviso(`Agregaste ${cantidad} × ${producto.nombre} al carrito.`);
  }
  return (
    <div className="container section-space">
      <nav aria-label="Ruta de navegación">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Inicio</Link>
          </li>
          {categoria && (
            <li className="breadcrumb-item">
              <Link to={`/categorias/${categoria.slug}`}>{categoria.nombre}</Link>
            </li>
          )}
          <li className="breadcrumb-item active" aria-current="page">
            {producto.nombre}
          </li>
        </ol>
      </nav>

      <div className="row g-5 align-items-center">
        <div className="col-md-6">
          <div className="detalle-imagen">
            <img src={producto.imagen} alt={producto.nombre} />
          </div>
        </div>
        <div className="col-md-6">
          <h1 className="h2">{producto.nombre}</h1>
          <Precio precio={producto.precio} precioOferta={producto.precioOferta} grande />
          <p className="mt-3">{producto.descripcion}</p>
          <p className={producto.stock > 5 ? 'text-success' : 'text-danger'}>
            {producto.stock > 0 ? `Stock disponible: ${producto.stock}` : 'Sin stock'}
          </p>
          <div className="d-flex gap-2 align-items-end">
            <div>
              <label htmlFor="cantidad" className="form-label">
                Cantidad
              </label>
              <input
                id="cantidad"
                type="number"
                className="form-control"
                min={1}
                max={producto.stock}
                value={cantidad}
                onChange={(e) =>
                  setCantidad(
                    Math.min(producto.stock, Math.max(1, Number(e.target.value) || 1)),
                  )
                }
              />
            </div>
            <button
              type="button"
              className="btn btn-primario"
              disabled={producto.stock === 0}
              onClick={handleAgregar}
            >
              Agregar al carrito
            </button>
          </div>
          <p role="status" className="text-success mt-2 mb-0">
            {aviso}
          </p>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-5">
          <h2 className="h4">Productos relacionados</h2>
          <ListaProductos productos={relacionados} onAgregar={agregar} />
        </section>
      )}
    </div>
  );
}
