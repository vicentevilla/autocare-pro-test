import { Link, useParams } from 'react-router-dom';
import { obtener } from '../data/baseDatos';
import ResumenOrden from '../components/ResumenOrden';

export default function ResultadoCompra({ exito }) {
  const { id } = useParams();
  const orden = obtener('ordenes', id);
  if (!orden) {
    return (
      <div className="container section-space">
        <h1 className="h3">Orden no encontrada</h1>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }
  return (
    <div className="container section-space">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="form-card">
            <p className="small text-secondary text-end mb-0">
              Código orden: ORD-{orden.id}
            </p>
            {exito ? (
              <h1 className="h3 text-success">
                ✔ Se ha realizado la compra n.º {orden.id}
              </h1>
            ) : (
              <>
                <h1 className="h3 text-danger">
                  ✖ No se pudo realizar el pago n.º {orden.id}
                </h1>
                <p>
                  El pago fue rechazado. Tu carrito se mantiene para que lo intentes de
                  nuevo.
                </p>
                <Link to="/checkout" className="btn btn-success mb-3">
                  Volver a realizar el pago
                </Link>
              </>
            )}
            <ResumenOrden orden={orden} />
            {exito && (
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => window.print()}
                >
                  Imprimir boleta
                </button>
                <Link to="/productos" className="btn btn-outline-dark">
                  Seguir comprando
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
