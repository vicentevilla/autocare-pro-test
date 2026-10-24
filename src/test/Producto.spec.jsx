import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import Producto from '../components/Producto';

describe('Componente Producto', () => {
  afterEach(() => {
    cleanup();
  });
  it('muestra el nombre del producto', () => {
    render(
      <Producto nombre="Ampolleta LED H4" imagen="/img/Ampolleta.jpg" precio={12990} />,
    );
    const titulo = screen.getByRole('heading', {
      name: 'Ampolleta LED H4',
    });
    expect(titulo.textContent).toBe('Ampolleta LED H4');
  });
  it('muestra el botón para agregar al carrito', () => {
    render(
      <Producto nombre="Ampolleta LED H4" imagen="/img/Ampolleta.jpg" precio={12990} />,
    );
    const boton = screen.getByRole('button', {
      name: 'Agregar al carrito',
    });
    expect(boton.textContent.trim()).toBe('Agregar al carrito');
    expect(boton.disabled).toBeFalse();
  });
  it('muestra el precio con formato $12.990', () => {
    render(
      <Producto nombre="Ampolleta LED H4" imagen="/img/Ampolleta.jpg" precio={12990} />,
    );
    expect(screen.getByText('$12.990')).toBeTruthy();
  });
  it('llama a onAgregar al pulsar el botón', () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    render(
      <Producto
        nombre="Cera"
        imagen="/img/Cera.jpg"
        precio={19990}
        onAgregar={onAgregar}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Agregar al carrito',
      }),
    );
    expect(onAgregar).toHaveBeenCalledTimes(1);
  });
  it('muestra "Imagen no disponible" si no hay imagen', () => {
    render(<Producto nombre="Sin foto" imagen="" precio={1000} />);
    expect(screen.getByText('Imagen no disponible')).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
  });
  it('muestra la oferta y el precio anterior tachado', () => {
    render(<Producto nombre="Aceite" imagen="" precio={15990} precioOferta={13990} />);
    expect(screen.getByText('Oferta')).toBeTruthy();
    expect(screen.getByText('$13.990')).toBeTruthy();
    expect(screen.getByText('$15.990').tagName).toBe('DEL');
  });
  it('deshabilita el botón cuando no hay stock', () => {
    render(<Producto nombre="Fusible" imagen="" precio={7990} stock={0} />);
    const boton = screen.getByRole('button', {
      name: 'Agotado',
    });
    expect(boton.disabled).toBeTrue();
  });
});
