import { calcularTotal, formatearPrecio } from '../utils/carrito';

export default function Carrito({
  items = [],
  onEliminar,
  onVaciar,
  onCambiarCantidad,
  onComprar,
  titulo = 'Tu carrito',
}) {
  const total = calcularTotal(items);
  return (
    <aside id="carrito" className="card carrito-panel" aria-labelledby="titulo-carrito">
      <div className="card-body">
        <h2 id="titulo-carrito" className="h4">
          {titulo}
        </h2>

        {items.length === 0 ? (
          <p className="text-secondary mb-0">Aún no has agregado productos.</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col" className="text-center">
                      Cant.
                    </th>
                    <th scope="col" className="text-end">
                      Subtotal
                    </th>
                    <th scope="col">
                      <span className="visually-hidden">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.nombre}
                        <div className="small text-secondary">
                          {formatearPrecio(item.precio)} c/u
                        </div>
                      </td>
                      <td className="text-center text-nowrap">
                        {onCambiarCantidad && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary px-2 py-0"
                            aria-label={`Quitar una unidad de ${item.nombre}`}
                            onClick={() => onCambiarCantidad(item.id, item.cantidad - 1)}
                          >
                            −
                          </button>
                        )}
                        <span className="mx-2" data-testid={`cantidad-${item.id}`}>
                          {item.cantidad}
                        </span>
                        {onCambiarCantidad && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary px-2 py-0"
                            aria-label={`Agregar una unidad de ${item.nombre}`}
                            onClick={() => onCambiarCantidad(item.id, item.cantidad + 1)}
                          >
                            +
                          </button>
                        )}
                      </td>
                      <td className="text-end">
                        {formatearPrecio(item.precio * item.cantidad)}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          aria-label={`Eliminar ${item.nombre}`}
                          onClick={() => onEliminar?.(item.id)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="carrito-total d-flex justify-content-between">
              <span>Total</span>
              <strong data-testid="total">{formatearPrecio(total)}</strong>
            </p>
            <div className="d-grid gap-2">
              {onComprar && (
                <button type="button" className="btn btn-success" onClick={onComprar}>
                  Comprar ahora
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => onVaciar?.()}
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
