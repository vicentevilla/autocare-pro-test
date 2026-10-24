import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';

const renderHeader = (props = {}, ruta = '/') =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Header {...props} />
    </MemoryRouter>,
  );
describe('Componente Header', () => {
  afterEach(() => cleanup());
  it('muestra cantidad y total del carrito que recibe por props', () => {
    renderHeader({
      cantidadCarrito: 3,
      totalCarrito: 15990,
    });
    expect(screen.getByTestId('contador').textContent).toBe('3');
    expect(
      screen.getByRole('link', {
        name: /\$15\.990/,
      }),
    ).toBeTruthy();
  });
  it('abre y cierra el menú móvil (estado interno)', () => {
    renderHeader();
    const boton = screen.getByRole('button', {
      name: 'Abrir o cerrar menú',
    });
    expect(boton.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(boton);
    expect(boton.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById('menu-principal').classList).toContain('show');
  });
  it('marca como activo el enlace de la ruta actual', () => {
    renderHeader({}, '/ofertas');
    expect(
      screen.getByRole('link', {
        name: 'Ofertas',
      }).classList,
    ).toContain('active');
    expect(
      screen.getByRole('link', {
        name: 'Inicio',
      }).classList,
    ).not.toContain('active');
  });
  it('sin sesión muestra "Iniciar sesión" y "Crear cuenta"', () => {
    renderHeader();
    expect(
      screen.getByRole('link', {
        name: 'Iniciar sesión',
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole('link', {
        name: 'Crear cuenta',
      }),
    ).toBeTruthy();
  });
  it('con sesión de admin muestra saludo, enlace Admin y cierra sesión', () => {
    const onLogout = jasmine.createSpy('onLogout');
    renderHeader({
      usuario: {
        nombre: 'Admin',
        rol: 'admin',
      },
      onLogout,
    });
    expect(screen.getByText('Hola, Admin')).toBeTruthy();
    expect(
      screen.getByRole('link', {
        name: 'Admin',
      }),
    ).toBeTruthy();
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Cerrar sesión',
      }),
    );
    expect(onLogout).toHaveBeenCalled();
  });
  it('un cliente no ve el enlace Admin', () => {
    renderHeader({
      usuario: {
        nombre: 'Camila',
        rol: 'cliente',
      },
    });
    expect(
      screen.queryByRole('link', {
        name: 'Admin',
      }),
    ).toBeNull();
  });
});
