import {
  productosCriticos,
  productosMasVendidos,
  resumenVentas,
  ventasPorCategoria,
} from '../utils/reportes';
import { crearSlug } from '../utils/slug';
import { procesarPago } from '../utils/pago';

describe('Reportes y utilidades', () => {
  const productos = [
    {
      id: 1,
      categoria: 'aceites',
      stock: 10,
    },
    {
      id: 2,
      categoria: 'detailing',
      stock: 2,
    },
  ];
  const ordenes = [
    {
      estado: 'pagada',
      total: 3000,
      items: [
        {
          id: 1,
          nombre: 'A',
          precio: 1000,
          cantidad: 3,
        },
      ],
    },
    {
      estado: 'pagada',
      total: 500,
      items: [
        {
          id: 2,
          nombre: 'B',
          precio: 500,
          cantidad: 1,
        },
      ],
    },
    {
      estado: 'rechazada',
      total: 9999,
      items: [
        {
          id: 2,
          nombre: 'B',
          precio: 9999,
          cantidad: 1,
        },
      ],
    },
  ];
  it('resume las ventas pagadas e ignora las rechazadas', () => {
    expect(resumenVentas(ordenes)).toEqual({
      totalVendido: 3500,
      ordenesPagadas: 2,
      ordenesRechazadas: 1,
      ticketPromedio: 1750,
    });
    expect(resumenVentas([]).ticketPromedio).toBe(0);
  });
  it('agrupa las ventas por categoría', () => {
    expect(ventasPorCategoria(ordenes, productos)).toEqual({
      aceites: 3000,
      detailing: 500,
    });
  });
  it('ordena los productos más vendidos por unidades', () => {
    expect(productosMasVendidos(ordenes).map((p) => p.id)).toEqual([1, 2]);
  });
  it('detecta productos con stock crítico (≤ 5)', () => {
    expect(productosCriticos(productos).map((p) => p.id)).toEqual([2]);
  });
  it('crea slugs sin tildes ni símbolos', () => {
    expect(crearSlug('Detailing & Limpieza')).toBe('detailing-limpieza');
    expect(crearSlug('Neumáticos')).toBe('neumaticos');
  });
  it('la pasarela simulada aprueba salvo rechazo forzado', () => {
    expect(
      procesarPago({
        simularRechazo: false,
      }),
    ).toBeTrue();
    expect(
      procesarPago({
        simularRechazo: true,
      }),
    ).toBeFalse();
  });
});
