import { Link } from 'react-router-dom';
import useColeccion from '../hooks/useColeccion';
import EncabezadoPagina from '../components/EncabezadoPagina';

export default function Blog() {
  const blogs = useColeccion('blogs');
  return (
    <>
      <EncabezadoPagina eyebrow="BLOG" titulo="Consejos para tu vehículo" />
      <div className="container section-space pt-4">
        <div className="row g-4">
          {blogs.map((b) => (
            <div className="col-md-6" key={b.id}>
              <article className="card h-100">
                <img src={b.imagen} alt="" className="blog-imagen" />
                <div className="card-body">
                  <p className="small text-secondary mb-1">{b.fecha}</p>
                  <h2 className="h5">{b.titulo}</h2>
                  <p className="text-secondary">{b.resumen}</p>
                  <Link to={`/blog/${b.id}`} className="btn btn-outline-dark btn-sm">
                    Leer artículo
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
