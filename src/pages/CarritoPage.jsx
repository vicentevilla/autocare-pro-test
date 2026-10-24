import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import useColeccion from '../hooks/useColeccion';
import Carrito from '../components/Carrito';
import EncabezadoPagina from '../components/EncabezadoPagina';
import ListaProductos from '../components/ListaProductos';

export default function CarritoPage() {
  const { carrito, agregar, eliminar, vaciar, cambiarCantidad } = useApp();
  const navigate = useNavigate();
  const sugeridos = useColeccion('productos')
    .filter((p) => !carrito.some((item) => item.id === p.id))
    .slice(0, 4);
  return (
    <>
      <EncabezadoPagina eyebrow="COMPRA" titulo="Carrito de compras" />
      <div className="container section-space pt-4">
        <div className="row g-4">
          <div className="col-lg-7 order-lg-2">
            <Carrito
              titulo="Productos en tu carrito"
              items={carrito}
              onEliminar={eliminar}
              onVaciar={vaciar}
              onCambiarCantidad={cambiarCantidad}
              onComprar={() => navigate('/checkout')}
            />
            {carrito.length === 0 && (
              <Link to="/productos" className="btn btn-primario mt-3">
                Ir a la tienda
              </Link>
            )}
          </div>
          <div className="col-lg-5 order-lg-1">
            <h2 className="h5">También te puede interesar</h2>
            <ListaProductos productos={sugeridos} onAgregar={agregar} columnas="col-6" />
          </div>
        </div>
      </div>
    </>
  );
}
