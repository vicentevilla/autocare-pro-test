export const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const regexClave = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
export function validarNombre(valor) {
  const texto = valor.trim();
  if (texto === '') return 'El nombre es obligatorio.';
  if (texto.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
  if (/\d/.test(texto)) return 'El nombre no puede contener números.';
  return '';
}
export function validarEmail(valor) {
  const texto = valor.trim();
  if (texto === '') return 'El correo es obligatorio.';
  if (!regexEmail.test(texto)) return 'Ingresa un correo válido, ej: nombre@dominio.com';
  return '';
}
export function validarClave(valor) {
  if (valor === '') return 'La contraseña es obligatoria.';
  if (!regexClave.test(valor)) {
    return 'Debe tener mínimo 8 caracteres, una mayúscula y un número.';
  }
  return '';
}
export function validarRegistro({ nombre, email, clave }) {
  return {
    nombre: validarNombre(nombre),
    email: validarEmail(email),
    clave: validarClave(clave),
  };
}
export function esFormularioValido(errores) {
  return Object.values(errores).every((mensaje) => mensaje === '');
}
export function validarCheckout(d) {
  const requerido = (valor, texto) => (String(valor ?? '').trim() === '' ? texto : '');
  return {
    nombre: requerido(d.nombre, 'Ingresa tu nombre.'),
    apellidos: requerido(d.apellidos, 'Ingresa tus apellidos.'),
    email: validarEmail(d.email ?? ''),
    calle: requerido(d.calle, 'Ingresa la calle y número.'),
    region: requerido(d.region, 'Selecciona una región.'),
    comuna: requerido(d.comuna, 'Selecciona una comuna.'),
  };
}
export function validarProducto(p) {
  const precio = Number(p.precio);
  const oferta =
    p.precioOferta === '' || p.precioOferta == null ? null : Number(p.precioOferta);
  const stock = Number(p.stock);
  return {
    nombre:
      String(p.nombre ?? '').trim().length < 3
        ? 'El nombre debe tener al menos 3 caracteres.'
        : '',
    categoria: p.categoria ? '' : 'Selecciona una categoría.',
    precio: p.precio === '' || !(precio > 0) ? 'El precio debe ser mayor a 0.' : '',
    precioOferta:
      oferta !== null && !(oferta > 0 && oferta < precio)
        ? 'La oferta debe ser mayor a 0 y menor que el precio.'
        : '',
    stock:
      p.stock === '' || !Number.isInteger(stock) || stock < 0
        ? 'El stock debe ser un entero ≥ 0.'
        : '',
  };
}
export function validarContacto(d) {
  const mensaje = String(d.mensaje ?? '').trim();
  return {
    nombre: validarNombre(d.nombre ?? ''),
    email: validarEmail(d.email ?? ''),
    mensaje:
      mensaje === ''
        ? 'Escribe tu mensaje.'
        : mensaje.length > 500
          ? 'Máximo 500 caracteres.'
          : '',
  };
}
