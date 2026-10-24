import useColeccion from '../hooks/useColeccion';
import { formatearPrecio } from '../utils/carrito';
import {
  productosCriticos,
  productosMasVendidos,
  resumenVentas,
  ventasPorCategoria,
} from '../utils/reportes';

export default function Reportes() {
  const ordenes = useColeccion('ordenes');
  const productos = useColeccion('productos');
  const categorias = useColeccion('categorias');
  const resumen = resumenVentas(ordenes);
  const porCategoria = ventasPorCategoria(ordenes, productos);
  const maximo = Math.max(1, ...Object.values(porCategoria));
  const top = productosMasVendidos(ordenes);
  const indicadores = [
    ['Total vendido', formatearPrecio(resumen.totalVendido)],
    ['Órdenes pagadas', resumen.ordenesPagadas],
    ['Órdenes rechazadas', resumen.ordenesRechazadas],
    ['Ticket promedio', formatearPrecio(resumen.ticketPromedio)],
    ['Productos críticos', productosCriticos(productos).length],
  ];
  return (
    <>
      <h1 className="h3">Reportes</h1>
      <div className="row g-3 mb-4">
        {indicadores.map(([titulo, valor]) => (
          <div className="col-6 col-lg" key={titulo}>
            <div className="card card-body h-100">
              <p className="small text-secondary mb-1">{titulo}</p>
              <p className="h4 mb-0">{valor}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card card-body h-100">
            <h2 className="h5">Ventas por categoría</h2>
            {categorias.map((c) => {
              const monto = porCategoria[c.slug] ?? 0;
              return (
                <div className="mb-3" key={c.id}>
                  <div className="d-flex justify-content-between small">
                    <span>{c.nombre}</span>
                    <span>{formatearPrecio(monto)}</span>
                  </div>

                  <div
                    className="progress"
                    role="progressbar"
                    aria-label={`Ventas ${c.nombre}`}
                    aria-valuenow={monto}
                    aria-valuemin={0}
                    aria-valuemax={maximo}
                  >
                    <div
                      className="progress-bar bg-danger"
                      style={{
                        width: `${(monto / maximo) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card card-body h-100">
            <h2 className="h5">Más vendidos</h2>
            {top.length === 0 ? (
              <p className="text-secondary mb-0">Aún no hay ventas.</p>
            ) : (
              <ol className="mb-0">
                {top.map((p) => (
                  <li key={p.id}>
                    {p.nombre} — <strong>{p.unidades}</strong> u.
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
