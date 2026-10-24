import { Link, useParams } from 'react-router-dom';
import { obtener } from '../data/baseDatos';

export default function BlogDetalle() {
  const { id } = useParams();
  const blog = obtener('blogs', id);
  if (!blog) {
    return (
      <div className="container section-space">
        <h1 className="h3">Artículo no encontrado</h1>
        <Link to="/blog">Volver al blog</Link>
      </div>
    );
  }
  return (
    <article className="container section-space blog-detalle">
      <Link to="/blog" className="small">
        ← Volver al blog
      </Link>
      <p className="small text-secondary mt-3 mb-1">{blog.fecha}</p>
      <h1 className="h2">{blog.titulo}</h1>
      <img src={blog.imagen} alt="" className="blog-imagen my-3" />
      {blog.contenido.map((parrafo, i) => (
        <p key={i}>{parrafo}</p>
      ))}
    </article>
  );
}
