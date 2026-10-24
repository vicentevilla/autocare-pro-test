import { createContext, useContext, useEffect, useState } from 'react';
import { crear, listar } from '../data/baseDatos';
import {
  agregarItem,
  cambiarCantidad,
  cargarCarrito,
  eliminarItem,
  guardarCarrito,
} from '../utils/carrito';

const CLAVE_SESION = 'autocare-sesion';
const AppContext = createContext(null);
function leerSesion() {
  try {
    return JSON.parse(window.localStorage.getItem(CLAVE_SESION)) ?? null;
  } catch {
    return null;
  }
}
const sinClave = ({ clave: _clave, ...resto }) => resto;
export function AppProvider({ children }) {
  const [carrito, setCarrito] = useState(() => cargarCarrito());
  const [usuario, setUsuario] = useState(() => leerSesion());
  useEffect(() => {
    guardarCarrito(carrito);
  }, [carrito]);
  useEffect(() => {
    try {
      if (usuario) window.localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
      else window.localStorage.removeItem(CLAVE_SESION);
    } catch {}
  }, [usuario]);
  function iniciarSesion(email, clave) {
    const encontrado = listar('usuarios').find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.clave === clave,
    );
    if (!encontrado) return 'Correo o contraseña incorrectos.';
    setUsuario(sinClave(encontrado));
    return '';
  }
  function registrar(datos) {
    const existe = listar('usuarios').some(
      (u) => u.email.toLowerCase() === datos.email.trim().toLowerCase(),
    );
    if (existe) return 'Ya existe una cuenta con ese correo.';
    const nuevo = crear('usuarios', {
      apellidos: '',
      calle: '',
      depto: '',
      region: '',
      comuna: '',
      ...datos,
      email: datos.email.trim(),
      rol: 'cliente',
    });
    setUsuario(sinClave(nuevo));
    return '';
  }
  const valor = {
    carrito,
    usuario,
    agregar: (producto) => setCarrito((c) => agregarItem(c, producto)),
    eliminar: (id) => setCarrito((c) => eliminarItem(c, id)),
    cambiarCantidad: (id, cantidad) =>
      setCarrito((c) => cambiarCantidad(c, id, cantidad)),
    vaciar: () => setCarrito([]),
    iniciarSesion,
    registrar,
    cerrarSesion: () => setUsuario(null),
    actualizarSesion: (datos) => setUsuario(sinClave(datos)),
  };
  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
}
export function useApp() {
  const contexto = useContext(AppContext);
  if (!contexto) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return contexto;
}
