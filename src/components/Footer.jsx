import { Link } from 'react-router-dom';
import Logo from './Logo';

const anio = new Date().getFullYear();
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <Logo />
            <p className="mt-3">Tu tienda de confianza para el cuidado de tu vehículo.</p>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="h6">Explora</h2>
            <Link to="/productos">Productos</Link>
            <Link to="/ofertas">Ofertas</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contacto">Contacto</Link>
          </div>
          <div className="col-6 col-md-4">
            <h2 className="h6">Síguenos</h2>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {anio} AutoCare Pro. Todos los derechos reservados.</span>
          <a href="#contenido">Volver arriba ↑</a>
        </div>
      </div>
    </footer>
  );
}
