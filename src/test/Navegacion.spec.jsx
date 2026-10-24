import { screen, cleanup, fireEvent, within } from '@testing-library/react';
import { limpiarDatos, renderApp } from './helpers';

describe('Navegación y vistas de la tienda', () => {
  beforeEach(() => limpiarDatos());
  afterEach(() => cleanup());
  it('Home → buscar lleva a /productos con el filtro aplicado', () => {
    renderApp('/');
    fireEvent.change(screen.getByLabelText('Buscar producto o repuesto'), {
      target: {
        value: 'ampolleta',
      },
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Buscar',
      }),
    );
    expect(
      screen.getByRole('heading', {
        name: 'Nuestros productos',
      }),
    ).toBeTruthy();
    expect(screen.getByLabelText('Buscar').value).toBe('ampolleta');
    expect(
      screen.getByRole('heading', {
        name: 'Ampolleta LED H4',
      }),
    ).toBeTruthy();
  });
  it('el detalle de producto agrega la cantidad elegida y actualiza el Header', () => {
    renderApp('/producto/3');
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Shampoo para auto (1L)',
      }),
    ).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Cantidad'), {
      target: {
        value: '2',
      },
    });
    fireEvent.click(
      screen.getAllByRole('button', {
        name: 'Agregar al carrito',
      })[0],
    );
    expect(screen.getByTestId('contador').textContent).toBe('2');
    expect(
      screen.getByText('Agregaste 2 × Shampoo para auto (1L) al carrito.'),
    ).toBeTruthy();
  });
  it('muestra "Producto no encontrado" con un id inexistente', () => {
    renderApp('/producto/999');
    expect(screen.getByText('Producto no encontrado')).toBeTruthy();
  });
  it('Categorías muestra solo los productos de la categoría elegida', () => {
    renderApp('/categorias/electricidad');
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Ampolletas & Electricidad',
      }),
    ).toBeTruthy();
    expect(screen.getAllByRole('article').length).toBe(2);
  });
  it('Ofertas lista solo productos con precio de oferta', () => {
    renderApp('/ofertas');
    expect(screen.getAllByRole('article').length).toBe(4);
    expect(screen.getAllByText('Oferta').length).toBe(4);
  });
  it('Blog → detalle del artículo', () => {
    renderApp('/blog');
    fireEvent.click(
      screen.getAllByRole('link', {
        name: 'Leer artículo',
      })[1],
    );
    expect(
      screen.getByRole('heading', {
        name: /Cómo lavar tu auto sin dañar la pintura/,
      }),
    ).toBeTruthy();
  });
  it('Nosotros y la ruta 404', () => {
    renderApp('/nosotros');
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Nosotros',
      }),
    ).toBeTruthy();
    cleanup();
    renderApp('/no-existe');
    expect(
      screen.getByRole('heading', {
        name: '404',
      }),
    ).toBeTruthy();
  });
  it('Login: credenciales incorrectas muestran error; correctas inician sesión', () => {
    renderApp('/login');
    const form = screen
      .getByRole('button', {
        name: 'Entrar',
      })
      .closest('form');
    fireEvent.change(within(form).getByLabelText('Correo electrónico'), {
      target: {
        value: 'camila@correo.cl',
      },
    });
    fireEvent.change(within(form).getByLabelText('Contraseña'), {
      target: {
        value: 'mala',
      },
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Entrar',
      }),
    );
    expect(screen.getByRole('alert').textContent).toBe(
      'Correo o contraseña incorrectos.',
    );
    fireEvent.change(within(form).getByLabelText('Contraseña'), {
      target: {
        value: 'Cliente123',
      },
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Entrar',
      }),
    );
    expect(screen.getByText('Hola, Camila')).toBeTruthy();
    expect(
      screen.getByRole('heading', {
        name: 'Ofertas destacadas',
      }),
    ).toBeTruthy();
  });
  it('Contacto: valida y guarda el mensaje', () => {
    renderApp('/contacto');
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Enviar mensaje',
      }),
    );
    expect(screen.getByText('Escribe tu mensaje.')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Nombre'), {
      target: {
        value: 'Vicente',
      },
    });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: {
        value: 'vicente@duoc.cl',
      },
    });
    fireEvent.change(screen.getByLabelText('Mensaje'), {
      target: {
        value: '¿Tienen filtros?',
      },
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Enviar mensaje',
      }),
    );
    expect(screen.getByRole('alert').textContent).toContain('Recibimos tu mensaje');
  });
});
