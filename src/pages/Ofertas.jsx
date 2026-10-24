import { useApp } from '../context/AppContext';
import useColeccion from '../hooks/useColeccion';
import EncabezadoPagina from '../components/EncabezadoPagina';
import ListaProductos from '../components/ListaProductos';

export default function Ofertas() {
  const { agregar } = useApp();
  const ofertas = useColeccion('productos').filter((p) => p.precioOferta != null);
  return (
    <>
      <EncabezadoPagina eyebrow="AHORRA" titulo="Ofertas">
        {ofertas.length} productos con descuento por tiempo limitado.
      </EncabezadoPagina>
      <div className="container section-space pt-4">
        <ListaProductos
          productos={ofertas}
          onAgregar={agregar}
          columnas="col-sm-6 col-lg-3"
        />
      </div>
    </>
  );
}
