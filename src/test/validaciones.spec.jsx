import {
  esFormularioValido,
  validarCheckout,
  validarClave,
  validarContacto,
  validarEmail,
  validarNombre,
  validarProducto,
  validarRegistro,
} from '../utils/validaciones';

describe('Validaciones (utils/validaciones.js)', () => {
  it('nombre: obligatorio, mínimo 3 letras y sin números', () => {
    expect(validarNombre('')).toBe('El nombre es obligatorio.');
    expect(validarNombre('Al')).toContain('al menos 3');
    expect(validarNombre('Vicente2')).toContain('números');
    expect(validarNombre('Vicente')).toBe('');
  });
  it('email: obligatorio y con formato usuario@dominio.ext', () => {
    expect(validarEmail('')).toBe('El correo es obligatorio.');
    expect(validarEmail('vicente@')).toContain('correo válido');
    expect(validarEmail('vicente@duoc.cl')).toBe('');
  });
  it('clave: 8 caracteres, una mayúscula y un número', () => {
    expect(validarClave('')).toBe('La contraseña es obligatoria.');
    expect(validarClave('abc12345')).not.toBe('');
    expect(validarClave('Abcdefgh')).not.toBe('');
    expect(validarClave('Abcdefg1')).toBe('');
  });
  it('validarRegistro + esFormularioValido', () => {
    const malo = validarRegistro({
      nombre: '',
      email: 'x',
      clave: '1',
    });
    expect(esFormularioValido(malo)).toBeFalse();
    const bueno = validarRegistro({
      nombre: 'Vicente',
      email: 'vicente@duoc.cl',
      clave: 'Clave123',
    });
    expect(esFormularioValido(bueno)).toBeTrue();
  });
  it('checkout: exige datos del cliente y dirección', () => {
    const errores = validarCheckout({});
    expect(errores.nombre).toBe('Ingresa tu nombre.');
    expect(errores.region).toBe('Selecciona una región.');
    const ok = validarCheckout({
      nombre: 'Ana',
      apellidos: 'Pérez',
      email: 'ana@correo.cl',
      calle: 'Calle 1',
      region: 'Región Metropolitana',
      comuna: 'Santiago',
    });
    expect(esFormularioValido(ok)).toBeTrue();
  });
  it('producto: precio > 0, oferta menor al precio y stock entero', () => {
    const base = {
      nombre: 'Filtro',
      categoria: 'aceites',
      precio: '5000',
      stock: '3',
    };
    expect(esFormularioValido(validarProducto(base))).toBeTrue();
    expect(
      validarProducto({
        ...base,
        precio: '0',
      }).precio,
    ).not.toBe('');
    expect(
      validarProducto({
        ...base,
        precioOferta: '6000',
      }).precioOferta,
    ).not.toBe('');
    expect(
      validarProducto({
        ...base,
        stock: '1.5',
      }).stock,
    ).not.toBe('');
    expect(
      validarProducto({
        ...base,
        categoria: '',
      }).categoria,
    ).not.toBe('');
  });
  it('contacto: mensaje obligatorio y máximo 500 caracteres', () => {
    const base = {
      nombre: 'Vicente',
      email: 'v@duoc.cl',
    };
    expect(
      validarContacto({
        ...base,
        mensaje: '',
      }).mensaje,
    ).toBe('Escribe tu mensaje.');
    expect(
      validarContacto({
        ...base,
        mensaje: 'a'.repeat(501),
      }).mensaje,
    ).toContain('500');
    expect(
      esFormularioValido(
        validarContacto({
          ...base,
          mensaje: 'Hola',
        }),
      ),
    ).toBeTrue();
  });
});
