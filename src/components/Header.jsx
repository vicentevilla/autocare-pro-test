import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';
import { formatearPrecio } from '../utils/carrito';

const ENLACES = [
  ['/', 'Inicio'],
  ['/productos', 'Productos'],
  ['/categorias', 'Categorías'],
  ['/ofertas', 'Ofertas'],
  ['/nosotros', 'Nosotros'],
  ['/blog', 'Blog'],
  ['/contacto', 'Contacto'],
];
export default function Header({
  cantidadCarrito = 0,
  totalCarrito = 0,
  usuario,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const cerrar = () => setOpen(false);
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <header className="site-header">
        <nav className="navbar navbar-expand-xl navbar-dark" aria-label="Principal">
          <div className="container">
            <Link
              className="navbar-brand"
              to="/"
              aria-label="AutoCare Pro, inicio"
              onClick={cerrar}
            >
              <Logo />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              aria-controls="menu-principal"
              aria-expanded={open}
              aria-label="Abrir o cerrar menú"
              onClick={() => setOpen(!open)}
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div
              id="menu-principal"
              className={`collapse navbar-collapse ${open ? 'show' : ''}`}
            >
              <ul className="navbar-nav me-auto ms-xl-3">
                {ENLACES.map(([ruta, texto]) => (
                  <li className="nav-item" key={ruta}>
                    <NavLink
                      className="nav-link"
                      to={ruta}
                      end={ruta === '/'}
                      onClick={cerrar}
                    >
                      {texto}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className="d-flex flex-wrap flex-xl-nowrap align-items-center gap-2 py-2 py-xl-0">
                {usuario ? (
                  <>
                    <span className="text-white small text-nowrap">
                      Hola, {usuario.nombre}
                    </span>
                    {usuario.rol === 'admin' && (
                      <Link
                        className="btn btn-sm btn-outline-light"
                        to="/admin"
                        onClick={cerrar}
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light"
                      onClick={() => {
                        cerrar();
                        onLogout?.();
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      className="btn btn-sm btn-outline-light"
                      to="/login"
                      onClick={cerrar}
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      className="btn btn-sm btn-outline-light"
                      to="/registro"
                      onClick={cerrar}
                    >
                      Crear cuenta
                    </Link>
                  </>
                )}
                <Link
                  className="btn btn-light btn-carrito"
                  to="/carrito"
                  onClick={cerrar}
                >
                  🛒 {formatearPrecio(totalCarrito)}{' '}
                  <span
                    className="badge rounded-pill text-bg-danger"
                    data-testid="contador"
                  >
                    {cantidadCarrito}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
