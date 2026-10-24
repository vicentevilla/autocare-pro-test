import {
  agregarItem,
  calcularTotal,
  cambiarCantidad,
  cargarCarrito,
  contarItems,
  eliminarItem,
  formatearPrecio,
  guardarCarrito,
  precioFinal,
} from '../utils/carrito';

describe('Lógica del carrito (utils/carrito.js)', () => {
  const aceite = {
    id: 1,
    nombre: 'Aceite',
    precio: 15990,
  };
  const filtro = {
    id: 2,
    nombre: 'Filtro',
    precio: 6990,
  };
  it('agrega un producto nuevo con cantidad 1', () => {
    const carrito = agregarItem([], aceite);
    expect(carrito.length).toBe(1);
    expect(carrito[0]).toEqual(
      jasmine.objectContaining({
        id: 1,
        nombre: 'Aceite',
        precio: 15990,
        cantidad: 1,
      }),
    );
  });
  it('usa el precio de oferta cuando existe', () => {
    const enOferta = {
      ...aceite,
      precioOferta: 13990,
    };
    expect(precioFinal(enOferta)).toBe(13990);
    expect(agregarItem([], enOferta)[0].precio).toBe(13990);
  });
  it('suma 1 a la cantidad si el producto ya estaba', () => {
    const carrito = agregarItem(agregarItem([], aceite), aceite);
    expect(carrito.length).toBe(1);
    expect(carrito[0].cantidad).toBe(2);
  });
  it('no modifica el carrito original (inmutabilidad)', () => {
    const original = [];
    agregarItem(original, aceite);
    expect(original.length).toBe(0);
  });
  it('elimina un producto por id', () => {
    const carrito = [aceite, filtro].reduce(agregarItem, []);
    expect(eliminarItem(carrito, 1).map((i) => i.id)).toEqual([2]);
  });
  it('cambia la cantidad y elimina si llega a 0', () => {
    const carrito = [aceite, filtro].reduce(agregarItem, []);
    expect(cambiarCantidad(carrito, 1, 5)[0].cantidad).toBe(5);
    expect(cambiarCantidad(carrito, 1, 0).map((i) => i.id)).toEqual([2]);
  });
  it('cuenta unidades y calcula el total', () => {
    const carrito = [aceite, aceite, filtro].reduce(agregarItem, []);
    expect(contarItems(carrito)).toBe(3);
    expect(calcularTotal(carrito)).toBe(15990 * 2 + 6990);
  });
  it('formatea precios en pesos chilenos', () => {
    expect(formatearPrecio(15990)).toBe('$15.990');
  });
  it('guarda y vuelve a cargar el carrito (mock de almacenamiento)', () => {
    const datos = {};
    const storage = {
      getItem: jasmine.createSpy('getItem').and.callFake((k) => datos[k] ?? null),
      setItem: jasmine.createSpy('setItem').and.callFake((k, v) => {
        datos[k] = v;
      }),
    };
    guardarCarrito(
      [
        {
          ...aceite,
          cantidad: 2,
        },
      ],
      storage,
    );
    expect(storage.setItem).toHaveBeenCalledWith('autocare-carrito', jasmine.any(String));
    expect(cargarCarrito(storage)[0].cantidad).toBe(2);
  });
  it('devuelve [] si los datos guardados están dañados', () => {
    const storage = {
      getItem: () => '{esto no es json',
    };
    expect(cargarCarrito(storage)).toEqual([]);
  });
  it('no se cae si el almacenamiento lanza un error', () => {
    const storage = {
      setItem: jasmine.createSpy('setItem').and.throwError('QuotaExceededError'),
    };
    expect(() => guardarCarrito([], storage)).not.toThrow();
  });
});
