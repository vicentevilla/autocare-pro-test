import { Link, NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';
import AdminLogin from './AdminLogin';
import './Admin.css';

const MENU = [
  ['/admin', '📊 Dashboard'],
  ['/admin/ordenes', '🧾 Órdenes'],
  ['/admin/productos', '📦 Productos'],
  ['/admin/categorias', '🏷️ Categorías'],
  ['/admin/usuarios', '👥 Usuarios'],
  ['/admin/reportes', '📈 Reportes'],
  ['/admin/perfil', '👤 Perfil'],
];
export default function AdminLayout() {
  const { usuario, cerrarSesion } = useApp();
  if (!usuario) return <AdminLogin />;
  if (usuario.rol !== 'admin') {
    return (
      <div className="admin-page d-flex align-items-center justify-content-center p-4">
        <div className="card p-4 text-center">
          <h1 className="h4">Acceso restringido</h1>
          <p>Tu cuenta no tiene permisos de administrador.</p>
          <div className="d-flex gap-2 justify-content-center">
            <Link to="/" className="btn btn-outline-dark">
              Volver a la tienda
            </Link>
            <button type="button" className="btn btn-primario" onClick={cerrarSesion}>
              Cambiar de cuenta
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="admin-page">
      <header className="site-header py-2">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link to="/admin" className="navbar-brand">
            <Logo />
          </Link>
          <span className="text-white small">Administrador: {usuario.nombre}</span>
        </div>
      </header>
      <div className="container-fluid">
        <div className="row">
          <nav
            className="col-md-3 col-xl-2 admin-sidebar py-3"
            aria-label="Menú administrador"
          >
            <ul className="nav nav-pills flex-md-column gap-1">
              {MENU.map(([ruta, texto]) => (
                <li className="nav-item" key={ruta}>
                  <NavLink to={ruta} end={ruta === '/admin'} className="nav-link">
                    {texto}
                  </NavLink>
                </li>
              ))}
            </ul>
            <hr />
            <div className="d-grid gap-2">
              <Link to="/" className="btn btn-dark btn-sm">
                🏬 Ver tienda
              </Link>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            </div>
          </nav>
          <main className="col-md-9 col-xl-10 py-4 px-md-4" id="contenido">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
