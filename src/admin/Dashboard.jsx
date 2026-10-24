import { Link } from 'react-router-dom';
import useColeccion from '../hooks/useColeccion';
import { formatearPrecio } from '../utils/carrito';
import { productosCriticos, resumenVentas } from '../utils/reportes';

const ACCESOS = [
  ['/admin/ordenes', '🧾', 'Órdenes', 'Seguimiento de las compras realizadas.'],
  ['/admin/productos', '📦', 'Productos', 'Inventario y detalle de los productos.'],
  ['/admin/categorias', '🏷️', 'Categorías', 'Organiza los productos por tipo.'],
  ['/admin/usuarios', '👥', 'Usuarios', 'Cuentas de clientes y administradores.'],
  ['/admin/reportes', '📈', 'Reportes', 'Ventas por categoría y más vendidos.'],
  ['/admin/perfil', '👤', 'Perfil', 'Tus datos de administrador.'],
];
export default function Dashboard() {
  const ordenes = useColeccion('ordenes');
  const productos = useColeccion('productos');
  const usuarios = useColeccion('usuarios');
  const ventas = resumenVentas(ordenes);
  const criticos = productosCriticos(productos).length;
  const tarjetas = [
    [
      'bg-primary',
      'Compras',
      ventas.ordenesPagadas,
      `Vendido: ${formatearPrecio(ventas.totalVendido)}`,
    ],
    [
      'bg-success',
      'Productos',
      productos.length,
      `Stock total: ${productos.reduce((s, p) => s + p.stock, 0)}`,
    ],
    [
      'bg-warning',
      'Usuarios',
      usuarios.length,
      `Clientes: ${usuarios.filter((u) => u.rol === 'cliente').length}`,
    ],
  ];
  return (
    <>
      <h1 className="h3">Dashboard</h1>
      <p className="text-secondary">Resumen de la actividad de la tienda.</p>
      <div className="row g-3 mb-4">
        {tarjetas.map(([color, titulo, valor, detalle]) => (
          <div className="col-sm-6 col-lg-4" key={titulo}>
            <div className={`card text-white ${color} h-100`}>
              <div className="card-body">
                <h2 className="h6">{titulo}</h2>
                <p className="display-6 mb-0" data-testid={`metrica-${titulo}`}>
                  {valor}
                </p>
                <p className="small mb-0">{detalle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {criticos > 0 && (
        <div className="alert alert-warning">
          Hay {criticos} productos con stock crítico.{' '}
          <Link to="/admin/productos/criticos">Revisar</Link>
        </div>
      )}
      <div className="row g-3">
        {ACCESOS.map(([ruta, icono, titulo, texto]) => (
          <div className="col-sm-6 col-lg-4" key={ruta}>
            <Link to={ruta} className="card acceso-card h-100 text-center">
              <div className="card-body">
                <p className="fs-2 mb-1" aria-hidden="true">
                  {icono}
                </p>
                <h2 className="h6">{titulo}</h2>
                <p className="small text-secondary mb-0">{texto}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
