import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { calcularTotal, contarItems } from '../utils/carrito';
import Header from './Header';
import Footer from './Footer';

export default function TiendaLayout() {
  const { carrito, usuario, cerrarSesion } = useApp();
  return (
    <>
      <Header
        cantidadCarrito={contarItems(carrito)}
        totalCarrito={calcularTotal(carrito)}
        usuario={usuario}
        onLogout={cerrarSesion}
      />
      <main id="contenido">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
