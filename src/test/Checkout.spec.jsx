import { screen, cleanup, fireEvent } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import Checkout from '../pages/Checkout';
import { listar, obtener } from '../data/baseDatos';
import { iniciarSesionComo, limpiarDatos, renderApp, renderConApp } from './helpers';

const CARRITO = [
  {
    id: 3,
    nombre: 'Shampoo para auto (1L)',
    precio: 19990,
    cantidad: 2,
  },
];
function llenarFormulario() {
  const cambiar = (label, value) =>
    fireEvent.change(screen.getByLabelText(label), {
      target: {
        value,
      },
    });
  cambiar('Nombre *', 'Vicente');
  cambiar('Apellidos *', 'Villalobos');
  cambiar('Correo *', 'vicente@duoc.cl');
  cambiar('Calle y número *', 'Av. Siempre Viva 742');
  cambiar('Región *', 'Región Metropolitana');
  cambiar('Comuna *', 'Ñuñoa');
}
describe('Checkout y resultado de la compra', () => {
  beforeEach(() => {
    limpiarDatos();
    window.localStorage.setItem('autocare-carrito', JSON.stringify(CARRITO));
  });
  afterEach(() => cleanup());
  it('con el carrito vacío ofrece volver a la tienda', () => {
    window.localStorage.setItem('autocare-carrito', '[]');
    renderApp('/checkout');
    expect(screen.getByText('Tu carrito está vacío')).toBeTruthy();
  });
  it('muestra los errores de validación y no crea la orden', () => {
    renderApp('/checkout');
    fireEvent.click(
      screen.getByRole('button', {
        name: /Pagar ahora/,
      }),
    );
    expect(screen.getByText('Ingresa tu nombre.')).toBeTruthy();
    expect(screen.getByText('Selecciona una región.')).toBeTruthy();
    expect(listar('ordenes').length).toBe(2);
  });
  it('la comuna depende de la región elegida (select dependiente)', () => {
    renderApp('/checkout');
    const comuna = screen.getByLabelText('Comuna *');
    expect(comuna.disabled).toBeTrue();
    fireEvent.change(screen.getByLabelText('Región *'), {
      target: {
        value: 'Región de Valparaíso',
      },
    });
    expect(comuna.disabled).toBeFalse();
    expect(
      screen.getByRole('option', {
        name: 'Viña del Mar',
      }),
    ).toBeTruthy();
    expect(
      screen.queryByRole('option', {
        name: 'Ñuñoa',
      }),
    ).toBeNull();
  });
  it('completa los datos automáticamente si hay sesión iniciada', () => {
    iniciarSesionComo(obtener('usuarios', 2));
    renderApp('/checkout');
    expect(screen.getByLabelText('Nombre *').value).toBe('Camila');
    expect(screen.getByLabelText('Comuna *').value).toBe('Providencia');
  });
  it('pago aprobado: crea la orden, descuenta stock, vacía el carrito y muestra la boleta', () => {
    renderApp('/checkout');
    llenarFormulario();
    fireEvent.click(
      screen.getByRole('button', {
        name: /Pagar ahora/,
      }),
    );
    expect(
      screen.getByRole('heading', {
        name: /Se ha realizado la compra/,
      }),
    ).toBeTruthy();
    expect(screen.getByTestId('total-orden').textContent).toBe('$39.980');
    expect(obtener('productos', 3).stock).toBe(10);
    expect(screen.getByTestId('contador').textContent).toBe('0');
    expect(listar('ordenes').at(-1).estado).toBe('pagada');
  });
  it('pago rechazado (mock de la pasarela): conserva carrito y stock', () => {
    const pasarela = jasmine.createSpy('pasarela').and.returnValue(false);
    renderConApp(
      <Routes>
        <Route path="/checkout" element={<Checkout pasarela={pasarela} />} />
        <Route path="/compra/error/:id" element={<p>Pantalla de error</p>} />
      </Routes>,
      {
        ruta: '/checkout',
      },
    );
    llenarFormulario();
    fireEvent.click(
      screen.getByRole('button', {
        name: /Pagar ahora/,
      }),
    );
    expect(pasarela).toHaveBeenCalledWith(
      jasmine.objectContaining({
        nombre: 'Vicente',
      }),
    );
    expect(screen.getByText('Pantalla de error')).toBeTruthy();
    expect(obtener('productos', 3).stock).toBe(12);
    expect(listar('ordenes').at(-1).estado).toBe('rechazada');
    expect(JSON.parse(window.localStorage.getItem('autocare-carrito')).length).toBe(1);
  });
  it('la vista de pago con error permite volver a pagar', () => {
    renderApp('/checkout');
    llenarFormulario();
    fireEvent.click(screen.getByLabelText('Simular pago rechazado (demostración)'));
    fireEvent.click(
      screen.getByRole('button', {
        name: /Pagar ahora/,
      }),
    );
    expect(
      screen.getByRole('heading', {
        name: /No se pudo realizar el pago/,
      }),
    ).toBeTruthy();
    fireEvent.click(
      screen.getByRole('link', {
        name: 'Volver a realizar el pago',
      }),
    );
    expect(
      screen.getByRole('heading', {
        name: 'Checkout',
      }),
    ).toBeTruthy();
  });
  it('la página del carrito permite cambiar cantidades', () => {
    renderApp('/carrito');
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Agregar una unidad de Shampoo para auto (1L)',
      }),
    );
    expect(screen.getByTestId('cantidad-3').textContent).toBe('3');
    expect(screen.getByTestId('contador').textContent).toBe('3');
  });
});
