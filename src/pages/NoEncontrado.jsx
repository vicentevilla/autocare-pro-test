import { Link } from 'react-router-dom';

export default function NoEncontrado() {
  return (
    <div className="container section-space text-center">
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="btn btn-primario">
        Volver al inicio
      </Link>
    </div>
  );
}
