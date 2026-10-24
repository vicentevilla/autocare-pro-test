import { useSyncExternalStore } from 'react';
import { listar, suscribir } from '../data/baseDatos';

export default function useColeccion(nombre) {
  return useSyncExternalStore(suscribir, () => listar(nombre));
}
