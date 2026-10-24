import Producto from './Producto';

export default function ListaProductos({
  productos,
  onAgregar,
  columnas = 'col-sm-6 col-lg-4',
}) {
  if (productos.length === 0) {
    return <p className="text-secondary">No hay productos para mostrar.</p>;
  }
  return (
    <div className="row g-4">
      {productos.map((producto) => (
        <div className={columnas} key={producto.id}>
          <Producto {...producto} onAgregar={() => onAgregar?.(producto)} />
        </div>
      ))}
    </div>
  );
}
