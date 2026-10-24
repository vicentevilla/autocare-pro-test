import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import { reiniciar } from '../data/baseDatos';
import App from '../App';

export function limpiarDatos() {
  window.localStorage.clear();
  reiniciar();
}
export function iniciarSesionComo(usuario) {
  const { clave: _clave, ...sinClave } = usuario;
  window.localStorage.setItem('autocare-sesion', JSON.stringify(sinClave));
}
export function renderConApp(ui, { ruta = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AppProvider>{ui}</AppProvider>
    </MemoryRouter>,
  );
}
export function renderApp(ruta = '/') {
  return renderConApp(<App />, {
    ruta,
  });
}
