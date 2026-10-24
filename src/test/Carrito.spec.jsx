import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import Carrito from '../components/Carrito';

describe('Componente Carrito', () => {
  afterEach(() => cleanup());
  const items = [
    {
      id: 1,
      nombre: 'Aceite',
      precio: 15990,
      cantidad: 2,
    },
    {
      id: 2,
      nombre: 'Filtro',
      precio: 6990,
      cantidad: 1,
    },
  ];
  it('muestra un mensaje cuando está vacío', () => {
    render(<Carrito items={[]} />);
    expect(screen.getByText('Aún no has agregado productos.')).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();
  });
  it('lista los productos y calcula el total', () => {
    render(<Carrito items={items} />);
    expect(screen.getByText('Aceite')).toBeTruthy();
    expect(screen.getByTestId('total').textContent).toBe('$38.970');
  });
  it('llama a onEliminar con el id correcto', () => {
    const onEliminar = jasmine.createSpy('onEliminar');
    render(<Carrito items={items} onEliminar={onEliminar} />);
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Eliminar Filtro',
      }),
    );
    expect(onEliminar).toHaveBeenCalledWith(2);
  });
  it('llama a onVaciar al pulsar "Vaciar carrito"', () => {
    const onVaciar = jasmine.createSpy('onVaciar');
    render(<Carrito items={items} onVaciar={onVaciar} />);
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Vaciar carrito',
      }),
    );
    expect(onVaciar).toHaveBeenCalled();
  });
  it('solo muestra +/− y "Comprar ahora" si recibe esas funciones por props', () => {
    const { rerender } = render(<Carrito items={items} />);
    expect(
      screen.queryByRole('button', {
        name: 'Comprar ahora',
      }),
    ).toBeNull();
    expect(
      screen.queryByRole('button', {
        name: /Agregar una unidad/,
      }),
    ).toBeNull();
    const onCambiarCantidad = jasmine.createSpy('onCambiarCantidad');
    const onComprar = jasmine.createSpy('onComprar');
    rerender(
      <Carrito
        items={items}
        onCambiarCantidad={onCambiarCantidad}
        onComprar={onComprar}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Agregar una unidad de Aceite',
      }),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Quitar una unidad de Filtro',
      }),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Comprar ahora',
      }),
    );
    expect(onCambiarCantidad).toHaveBeenCalledWith(1, 3);
    expect(onCambiarCantidad).toHaveBeenCalledWith(2, 0);
    expect(onComprar).toHaveBeenCalled();
  });
});
