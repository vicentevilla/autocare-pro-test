import {
  CLAVE_BD,
  actualizar,
  crear,
  eliminar,
  listar,
  obtener,
  reiniciar,
  suscribir,
} from '../data/baseDatos';

describe('Base de datos simulada (data/baseDatos.js) — CRUD', () => {
  beforeEach(() => reiniciar());
  it('READ: lista y obtiene registros (acepta id numérico o texto)', () => {
    expect(listar('productos').length).toBe(10);
    expect(obtener('productos', 2).nombre).toBe('Filtro de aceite universal');
    expect(obtener('productos', '2').nombre).toBe('Filtro de aceite universal');
    expect(obtener('productos', 999)).toBeNull();
    expect(listar('no-existe')).toEqual([]);
  });
  it('CREATE: asigna el siguiente id', () => {
    const nuevo = crear('productos', {
      nombre: 'Refrigerante',
      precio: 5990,
    });
    expect(nuevo.id).toBe(11);
    expect(listar('productos').length).toBe(11);
  });
  it('UPDATE: modifica solo los campos indicados y conserva el id', () => {
    const editado = actualizar('productos', 1, {
      stock: 99,
      id: 500,
    });
    expect(editado.stock).toBe(99);
    expect(editado.id).toBe(1);
    expect(editado.nombre).toBe('Aceite sintético 5W-30 (4L)');
    expect(
      actualizar('productos', 999, {
        stock: 1,
      }),
    ).toBeNull();
  });
  it('DELETE: elimina y devuelve false si no existe', () => {
    expect(eliminar('productos', 1)).toBeTrue();
    expect(obtener('productos', 1)).toBeNull();
    expect(eliminar('productos', 1)).toBeFalse();
  });
  it('persiste en localStorage (mock con spyOn)', () => {
    spyOn(window.localStorage, 'setItem');
    crear('categorias', {
      nombre: 'Neumáticos',
      slug: 'neumaticos',
    });
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      CLAVE_BD,
      jasmine.any(String),
    );
    const guardado = JSON.parse(window.localStorage.setItem.calls.mostRecent().args[1]);
    expect(guardado.categorias.length).toBe(5);
  });
  it('sigue funcionando si localStorage falla', () => {
    spyOn(window.localStorage, 'setItem').and.throwError('Sin espacio');
    expect(() =>
      crear('mensajes', {
        texto: 'hola',
      }),
    ).not.toThrow();
    expect(listar('mensajes').length).toBe(1);
  });
  it('avisa a los suscriptores en cada cambio y permite desuscribirse', () => {
    const oyente = jasmine.createSpy('oyente');
    const desuscribir = suscribir(oyente);
    crear('mensajes', {
      texto: 'a',
    });
    eliminar('mensajes', 1);
    expect(oyente).toHaveBeenCalledTimes(2);
    desuscribir();
    crear('mensajes', {
      texto: 'b',
    });
    expect(oyente).toHaveBeenCalledTimes(2);
  });
  it('no modifica los datos de la semilla al reiniciar', () => {
    eliminar('productos', 1);
    reiniciar();
    expect(obtener('productos', 1)).not.toBeNull();
  });
});
