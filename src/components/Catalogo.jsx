import { useState } from 'react';
import useColeccion from '../hooks/useColeccion';
import ListaProductos from './ListaProductos';
import './Catalogo.css';

const PRODUCTOS_POR_PAGINA = 6;
export default function Catalogo({ busqueda = '', onAgregar }) {
  const productos = useColeccion('productos');
  const categorias = useColeccion('categorias');
  const [categoria, setCategoria] = useState('todas');
  const [paginaActual, setPaginaActual] = useState(1);
  const texto = busqueda.trim().toLowerCase();
  const filtrados = productos.filter(
    (p) =>
      (categoria === 'todas' || p.categoria === categoria) &&
      p.nombre.toLowerCase().includes(texto),
  );
  const totalPaginas = Math.ceil(filtrados.length / PRODUCTOS_POR_PAGINA);
  const paginaVisible = Math.min(paginaActual, Math.max(1, totalPaginas));
  const inicio = (paginaVisible - 1) * PRODUCTOS_POR_PAGINA;
  const visibles = filtrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);
  const paginas = Array.from(
    {
      length: totalPaginas,
    },
    (_, i) => i + 1,
  );
  function elegirCategoria(slug) {
    setCategoria(slug);
    setPaginaActual(1);
  }
  return (
    <section aria-label="Catálogo">
      <div
        className="filtros d-flex flex-wrap gap-2 mb-3"
        role="group"
        aria-label="Categorías"
      >
        {[
          {
            slug: 'todas',
            nombre: 'Todas',
          },
          ...categorias,
        ].map((c) => (
          <button
            key={c.slug}
            type="button"
            className={`btn btn-sm ${categoria === c.slug ? 'btn-primario' : 'btn-outline-secondary'}`}
            aria-pressed={categoria === c.slug}
            onClick={() => elegirCategoria(c.slug)}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      <p className="text-secondary small" role="status">
        {filtrados.length > 0
          ? `Mostrando ${inicio + 1}–${inicio + visibles.length} de ${filtrados.length} productos`
          : 'No encontramos productos con ese filtro.'}
      </p>

      {visibles.length > 0 && (
        <ListaProductos
          productos={visibles}
          onAgregar={onAgregar}
          columnas="col-sm-6 col-xl-4"
        />
      )}

      {totalPaginas > 1 && (
        <nav className="mt-4" aria-label="Páginas del catálogo">
          <ul className="pagination catalogo-paginacion justify-content-center">
            <li className={`page-item ${paginaVisible === 1 ? 'disabled' : ''}`}>
              <button
                type="button"
                className="page-link"
                disabled={paginaVisible === 1}
                onClick={() => setPaginaActual(paginaVisible - 1)}
              >
                Anterior
              </button>
            </li>
            {paginas.map((n) => (
              <li key={n} className={`page-item ${n === paginaVisible ? 'active' : ''}`}>
                <button
                  type="button"
                  className="page-link"
                  aria-label={`Página ${n}`}
                  aria-current={n === paginaVisible ? 'page' : undefined}
                  onClick={() => setPaginaActual(n)}
                >
                  {n}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${paginaVisible === totalPaginas ? 'disabled' : ''}`}
            >
              <button
                type="button"
                className="page-link"
                disabled={paginaVisible === totalPaginas}
                onClick={() => setPaginaActual(paginaVisible + 1)}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}
    </section>
  );
}
