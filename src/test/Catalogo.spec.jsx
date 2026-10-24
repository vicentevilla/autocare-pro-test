import { act, render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Catalogo from '../components/Catalogo';
import { actualizar, reiniciar } from '../data/baseDatos';

const renderCatalogo = (props = {}) =>
  render(
    <MemoryRouter>
      <Catalogo {...props} />
    </MemoryRouter>,
  );
describe('Componente Catalogo', () => {
  beforeEach(() => reiniciar());
  afterEach(() => cleanup());
  it('muestra 6 productos por página y la paginación', () => {
    renderCatalogo();
    expect(screen.getAllByRole('article').length).toBe(6);
    expect(
      screen.getByRole('button', {
        name: 'Página 2',
      }),
    ).toBeTruthy();
  });
  it('pasa a la página 2 al pulsar "Siguiente"', () => {
    renderCatalogo();
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Siguiente',
      }),
    );
    expect(screen.getByRole('status').textContent).toContain('Mostrando 7–');
  });
  it('filtra por categoría', () => {
    renderCatalogo();
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Accesorios',
      }),
    );
    expect(screen.getAllByRole('article').length).toBe(2);
    expect(
      screen
        .getByRole('button', {
          name: 'Accesorios',
        })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });
  it('filtra por el texto de búsqueda', () => {
    renderCatalogo({
      busqueda: 'filtro',
    });
    const titulos = screen.getAllByRole('heading', {
      level: 3,
    });
    expect(titulos.length).toBe(1);
    expect(titulos[0].textContent).toBe('Filtro de aceite universal');
  });
  it('muestra un mensaje si nada coincide', () => {
    renderCatalogo({
      busqueda: 'xyz123',
    });
    expect(screen.getByText('No encontramos productos con ese filtro.')).toBeTruthy();
  });
  it('envía el producto completo a onAgregar', () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    renderCatalogo({
      busqueda: 'filtro',
      onAgregar,
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Agregar al carrito',
      }),
    );
    expect(onAgregar).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: 2,
      }),
    );
  });
  it('se actualiza en tiempo real cuando cambia la base de datos', () => {
    renderCatalogo({
      busqueda: 'filtro',
    });
    act(() => {
      actualizar('productos', 2, {
        nombre: 'Filtro premium',
      });
    });
    expect(
      screen.getByRole('heading', {
        name: 'Filtro premium',
      }),
    ).toBeTruthy();
  });
});
