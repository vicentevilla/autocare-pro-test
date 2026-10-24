import { SEMILLA } from './semilla';

export const CLAVE_BD = 'autocare-db';
let datos = null;
const oyentes = new Set();
function copiaSemilla() {
  return structuredClone(SEMILLA);
}
function cargar() {
  if (datos) return datos;
  try {
    const texto = window.localStorage.getItem(CLAVE_BD);
    datos = texto
      ? {
          ...copiaSemilla(),
          ...JSON.parse(texto),
        }
      : copiaSemilla();
  } catch {
    datos = copiaSemilla();
  }
  return datos;
}
function guardar() {
  try {
    window.localStorage.setItem(CLAVE_BD, JSON.stringify(datos));
  } catch {}
  oyentes.forEach((avisar) => avisar());
}
const mismoId = (a, b) => String(a) === String(b);
export function listar(coleccion) {
  return cargar()[coleccion] ?? [];
}
export function obtener(coleccion, id) {
  return listar(coleccion).find((item) => mismoId(item.id, id)) ?? null;
}
export function crear(coleccion, nuevo) {
  const lista = listar(coleccion);
  const id = lista.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const registro = {
    ...nuevo,
    id,
  };
  datos = {
    ...datos,
    [coleccion]: [...lista, registro],
  };
  guardar();
  return registro;
}
export function actualizar(coleccion, id, cambios) {
  const actual = obtener(coleccion, id);
  if (!actual) return null;
  const actualizado = {
    ...actual,
    ...cambios,
    id: actual.id,
  };
  datos = {
    ...datos,
    [coleccion]: listar(coleccion).map((item) =>
      mismoId(item.id, id) ? actualizado : item,
    ),
  };
  guardar();
  return actualizado;
}
export function eliminar(coleccion, id) {
  const lista = listar(coleccion);
  const filtrada = lista.filter((item) => !mismoId(item.id, id));
  if (filtrada.length === lista.length) return false;
  datos = {
    ...datos,
    [coleccion]: filtrada,
  };
  guardar();
  return true;
}
export function suscribir(funcion) {
  oyentes.add(funcion);
  return () => oyentes.delete(funcion);
}
export function reiniciar() {
  datos = copiaSemilla();
  guardar();
}
