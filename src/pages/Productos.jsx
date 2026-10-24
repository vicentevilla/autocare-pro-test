import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Catalogo from '../components/Catalogo';
import Carrito from '../components/Carrito';
import EncabezadoPagina from '../components/EncabezadoPagina';

export default function Productos() {
  const [params, setParams] = useSearchParams();
  const busqueda = params.get('q') ?? '';
  const { carrito, agregar, eliminar, vaciar } = useApp();
  const navigate = useNavigate();
  return (
    <>
      <EncabezadoPagina eyebrow="CATÁLOGO" titulo="Nuestros productos" />
      <div className="container section-space pt-4">
        <div className="mb-3">
          <label htmlFor="buscar-productos" className="form-label">
            Buscar
          </label>
          <input
            id="buscar-productos"
            type="search"
            className="form-control"
            placeholder="Nombre del producto"
            value={busqueda}
            onChange={(e) =>
              setParams(
                e.target.value
                  ? {
                      q: e.target.value,
                    }
                  : {},
                {
                  replace: true,
                },
              )
            }
          />
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <Catalogo busqueda={busqueda} onAgregar={agregar} />
          </div>
          <div className="col-lg-4">
            <Carrito
              items={carrito}
              onEliminar={eliminar}
              onVaciar={vaciar}
              onComprar={() => navigate('/carrito')}
            />
          </div>
        </div>
      </div>
    </>
  );
}
