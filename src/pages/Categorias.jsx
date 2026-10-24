import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import useColeccion from '../hooks/useColeccion';
import EncabezadoPagina from '../components/EncabezadoPagina';
import ListaProductos from '../components/ListaProductos';

export default function Categorias() {
  const { slug } = useParams();
  const categorias = useColeccion('categorias');
  const productos = useColeccion('productos');
  const { agregar } = useApp();
  const actual = categorias.find((c) => c.slug === slug);
  return (
    <>
      <EncabezadoPagina
        eyebrow="CATEGORÍAS"
        titulo={actual ? actual.nombre : 'Categorías'}
      />
      <div className="container section-space pt-4">
        <div className="row g-3 mb-5">
          {categorias.map((c) => (
            <div className="col-6 col-md-3" key={c.id}>
              <Link
                to={`/categorias/${c.slug}`}
                className={`card categoria-card h-100 ${c.slug === slug ? 'activa' : ''}`}
                aria-current={c.slug === slug ? 'page' : undefined}
              >
                <img src={c.imagen} alt="" className="categoria-imagen" />
                <span className="card-body fw-semibold text-center">
                  {c.nombre}
                  <small className="d-block text-secondary fw-normal">
                    {productos.filter((p) => p.categoria === c.slug).length} productos
                  </small>
                </span>
              </Link>
            </div>
          ))}
        </div>

        {slug && !actual && <p>No existe esa categoría.</p>}
        {actual && (
          <ListaProductos
            productos={productos.filter((p) => p.categoria === actual.slug)}
            onAgregar={agregar}
            columnas="col-sm-6 col-lg-3"
          />
        )}
        {!slug && (
          <p className="text-secondary">Elige una categoría para ver sus productos.</p>
        )}
      </div>
    </>
  );
}
