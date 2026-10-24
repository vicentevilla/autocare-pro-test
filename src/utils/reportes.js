export function resumenVentas(ordenes) {
  const pagadas = ordenes.filter((o) => o.estado === 'pagada');
  return {
    totalVendido: pagadas.reduce((suma, o) => suma + o.total, 0),
    ordenesPagadas: pagadas.length,
    ordenesRechazadas: ordenes.length - pagadas.length,
    ticketPromedio: pagadas.length
      ? Math.round(pagadas.reduce((suma, o) => suma + o.total, 0) / pagadas.length)
      : 0,
  };
}
export function ventasPorCategoria(ordenes, productos) {
  const categoriaDe = Object.fromEntries(productos.map((p) => [p.id, p.categoria]));
  const resultado = {};
  ordenes
    .filter((o) => o.estado === 'pagada')
    .flatMap((o) => o.items)
    .forEach((item) => {
      const cat = categoriaDe[item.id] ?? 'otros';
      resultado[cat] = (resultado[cat] ?? 0) + item.precio * item.cantidad;
    });
  return resultado;
}
export function productosMasVendidos(ordenes, limite = 5) {
  const unidades = {};
  ordenes
    .filter((o) => o.estado === 'pagada')
    .flatMap((o) => o.items)
    .forEach((item) => {
      unidades[item.id] = unidades[item.id] ?? {
        id: item.id,
        nombre: item.nombre,
        unidades: 0,
      };
      unidades[item.id].unidades += item.cantidad;
    });
  return Object.values(unidades)
    .sort((a, b) => b.unidades - a.unidades)
    .slice(0, limite);
}
export const STOCK_CRITICO = 5;
export function productosCriticos(productos) {
  return productos.filter((p) => p.stock <= STOCK_CRITICO);
}
