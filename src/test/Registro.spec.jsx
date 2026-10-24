import { screen, cleanup, fireEvent } from '@testing-library/react';
import Registro from '../pages/Registro';
import { listar } from '../data/baseDatos';
import { limpiarDatos, renderConApp } from './helpers';

describe('Página Registro', () => {
  beforeEach(() => limpiarDatos());
  afterEach(() => cleanup());
  function escribir(label, valor) {
    fireEvent.change(screen.getByLabelText(label), {
      target: {
        value: valor,
      },
    });
  }
  it('muestra errores si se envía vacío', () => {
    renderConApp(<Registro />);
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Registrarse',
      }),
    );
    expect(screen.getByText('El nombre es obligatorio.')).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toBe(
      'Revisa los campos marcados en rojo.',
    );
    expect(screen.getByLabelText('Nombre completo').classList).toContain('is-invalid');
  });
  it('el estado del input cambia al escribir (formulario controlado)', () => {
    renderConApp(<Registro />);
    escribir('Nombre completo', 'Vicente');
    expect(screen.getByLabelText('Nombre completo').value).toBe('Vicente');
  });
  it('valida un campo al salir de él (blur)', () => {
    renderConApp(<Registro />);
    escribir('Correo electrónico', 'correo-malo');
    fireEvent.blur(screen.getByLabelText('Correo electrónico'));
    expect(screen.getByText(/Ingresa un correo válido/)).toBeTruthy();
  });
  it('registra con datos válidos, guarda el usuario y limpia el formulario', () => {
    renderConApp(<Registro />);
    escribir('Nombre completo', 'Vicente Villalobos');
    escribir('Correo electrónico', 'vicente@duoc.cl');
    escribir('Contraseña', 'Clave1234');
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Registrarse',
      }),
    );
    expect(screen.getByRole('alert').textContent).toContain('Registro exitoso');
    expect(screen.getByLabelText('Nombre completo').value).toBe('');
    const creado = listar('usuarios').find((u) => u.email === 'vicente@duoc.cl');
    expect(creado.rol).toBe('cliente');
  });
  it('no permite registrar un correo que ya existe', () => {
    renderConApp(<Registro />);
    escribir('Nombre completo', 'Otra Camila');
    escribir('Correo electrónico', 'camila@correo.cl');
    escribir('Contraseña', 'Clave1234');
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Registrarse',
      }),
    );
    expect(screen.getByRole('alert').textContent).toBe(
      'Ya existe una cuenta con ese correo.',
    );
  });
});
