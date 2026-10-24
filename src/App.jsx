import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import TiendaLayout from './components/TiendaLayout';
import Home from './pages/Home';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import Nosotros from './pages/Nosotros';
import Blog from './pages/Blog';
import BlogDetalle from './pages/BlogDetalle';
import Contacto from './pages/Contacto';
import Registro from './pages/Registro';
import Login from './pages/Login';
import CarritoPage from './pages/CarritoPage';
import Checkout from './pages/Checkout';
import ResultadoCompra from './pages/ResultadoCompra';
import NoEncontrado from './pages/NoEncontrado';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import OrdenesAdmin from './admin/OrdenesAdmin';
import BoletaAdmin from './admin/BoletaAdmin';
import ProductosAdmin from './admin/ProductosAdmin';
import ProductoDetalleAdmin from './admin/ProductoDetalleAdmin';
import ProductoForm from './admin/ProductoForm';
import CategoriasAdmin from './admin/CategoriasAdmin';
import UsuariosAdmin from './admin/UsuariosAdmin';
import UsuarioForm from './admin/UsuarioForm';
import UsuarioDetalle from './admin/UsuarioDetalle';
import Reportes from './admin/Reportes';
import Perfil from './admin/Perfil';
import './App.css';

function ScrollArriba() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo?.(0, 0);
  }, [pathname]);
  return null;
}
export default function App() {
  return (
    <>
      <ScrollArriba />
      <Routes>
        <Route element={<TiendaLayout />}>
          <Route index element={<Home />} />
          <Route path="productos" element={<Productos />} />
          <Route path="producto/:id" element={<DetalleProducto />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="categorias/:slug" element={<Categorias />} />
          <Route path="ofertas" element={<Ofertas />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogDetalle />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="registro" element={<Registro />} />
          <Route path="login" element={<Login />} />
          <Route path="carrito" element={<CarritoPage />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="compra/exitosa/:id" element={<ResultadoCompra exito />} />
          <Route path="compra/error/:id" element={<ResultadoCompra exito={false} />} />
          <Route path="*" element={<NoEncontrado />} />
        </Route>

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="ordenes" element={<OrdenesAdmin />} />
          <Route path="ordenes/:id" element={<BoletaAdmin />} />
          <Route path="productos" element={<ProductosAdmin />} />
          <Route path="productos/criticos" element={<ProductosAdmin soloCriticos />} />
          <Route path="productos/nuevo" element={<ProductoForm />} />
          <Route path="productos/:id" element={<ProductoDetalleAdmin />} />
          <Route path="productos/:id/editar" element={<ProductoForm />} />
          <Route path="categorias" element={<CategoriasAdmin />} />
          <Route path="usuarios" element={<UsuariosAdmin />} />
          <Route path="usuarios/nuevo" element={<UsuarioForm />} />
          <Route path="usuarios/:id" element={<UsuarioDetalle />} />
          <Route path="usuarios/:id/editar" element={<UsuarioForm />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </>
  );
}
