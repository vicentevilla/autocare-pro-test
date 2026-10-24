export const CLAVE_CARRITO = 'autocare-carrito';
export function cargarCarrito(storage = window.localStorage) {
  try {
    const datos = storage.getItem(CLAVE_CARRITO);
    return datos ? JSON.parse(datos) : [];
  } catch {
    return [];
  }
}
export function guardarCarrito(carrito, storage = window.localStorage) {
  try {
    storage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  } catch {}
}
export function agregarItem(carrito, producto) {
  const existente = carrito.find((item) => item.id === producto.id);
  if (existente) {
    return carrito.map((item) =>
      item.id === producto.id
        ? {
            ...item,
            cantidad: item.cantidad + 1,
          }
        : item,
    );
  }
  const { id, nombre, imagen } = producto;
  return [
    ...carrito,
    {
      id,
      nombre,
      imagen,
      precio: precioFinal(producto),
      cantidad: 1,
    },
  ];
}
export function precioFinal(producto) {
  return producto.precioOferta ?? producto.precio;
}
export function cambiarCantidad(carrito, id, cantidad) {
  if (cantidad < 1) return eliminarItem(carrito, id);
  return carrito.map((item) =>
    item.id === id
      ? {
          ...item,
          cantidad,
        }
      : item,
  );
}
export function eliminarItem(carrito, id) {
  return carrito.filter((item) => item.id !== id);
}
export function contarItems(carrito) {
  return carrito.reduce((suma, item) => suma + item.cantidad, 0);
}
export function calcularTotal(carrito) {
  return carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
}
export function formatearPrecio(valor) {
  return '$' + Number(valor).toLocaleString('es-CL');
}
