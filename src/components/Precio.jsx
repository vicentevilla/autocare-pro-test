import { formatearPrecio } from '../utils/carrito';

export default function Precio({ precio, precioOferta = null, grande = false }) {
  const clase = `producto-precio mb-0 ${grande ? 'fs-3' : ''}`;
  if (precioOferta == null) {
    return <p className={clase}>{formatearPrecio(precio)}</p>;
  }
  return (
    <p className={clase}>
      {formatearPrecio(precioOferta)}{' '}
      <del className="precio-anterior" aria-label={`Antes ${formatearPrecio(precio)}`}>
        {formatearPrecio(precio)}
      </del>
    </p>
  );
}
