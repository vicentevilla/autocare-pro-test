import { formatearPrecio } from '../utils/carrito';

export default function ResumenOrden({ orden }) {
  const { cliente, direccion, items, total } = orden;
  return (
    <div className="resumen-orden">
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <h3 className="h6 text-secondary">Cliente</h3>
          <p className="mb-0">
            {cliente.nombre} {cliente.apellidos}
          </p>
          <p className="mb-0 small">{cliente.email}</p>
        </div>
        <div className="col-sm-6">
          <h3 className="h6 text-secondary">Dirección de entrega</h3>
          <p className="mb-0">
            {direccion.calle}
            {direccion.depto && `, depto ${direccion.depto}`}
          </p>
          <p className="mb-0 small">
            {direccion.comuna}, {direccion.region}
          </p>
          {direccion.indicaciones && (
            <p className="mb-0 small fst-italic">{direccion.indicaciones}</p>
          )}
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col" className="text-end">
                Precio
              </th>
              <th scope="col" className="text-center">
                Cantidad
              </th>
              <th scope="col" className="text-end">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td className="text-end">{formatearPrecio(item.precio)}</td>
                <td className="text-center">{item.cantidad}</td>
                <td className="text-end">
                  {formatearPrecio(item.precio * item.cantidad)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={3} className="text-end">
                Total
              </th>
              <th className="text-end" data-testid="total-orden">
                {formatearPrecio(total)}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
