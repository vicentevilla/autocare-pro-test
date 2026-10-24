import { useState } from 'react';
import { Link } from 'react-router-dom';
import Precio from './Precio';
import './Producto.css';

export default function Producto({
  id,
  nombre,
  imagen,
  precio,
  precioOferta = null,
  descripcion,
  stock,
  onAgregar,
}) {
  const [failed, setFailed] = useState(false);
  const agotado = stock === 0;
  return (
    <article className="card producto-card">
      {precioOferta != null && (
        <span className="badge text-bg-danger badge-oferta">Oferta</span>
      )}
      <div className="producto-imagen-contenedor">
        {imagen?.trim() && !failed ? (
          <img
            src={imagen}
            alt={nombre}
            className="producto-imagen"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="producto-placeholder">
            <span aria-hidden="true">AC</span>
            <small>Imagen no disponible</small>
          </div>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h3 className="card-title h6">
          {id ? (
            <Link to={`/producto/${id}`} className="stretched-link-titulo">
              {nombre}
            </Link>
          ) : (
            nombre
          )}
        </h3>
        {descripcion && <p className="card-text small text-secondary">{descripcion}</p>}
        <div className="mt-auto">
          <Precio precio={precio} precioOferta={precioOferta} />
        </div>
        <button
          type="button"
          className="btn btn-primario mt-2"
          disabled={agotado}
          onClick={() => onAgregar?.()}
        >
          {agotado ? 'Agotado' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  );
}
