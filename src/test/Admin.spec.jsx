import { screen, cleanup, fireEvent, within } from '@testing-library/react';
import { listar, obtener } from '../data/baseDatos';
import { iniciarSesionComo, limpiarDatos, renderApp } from './helpers';

describe('Panel de administración', () => {
  beforeEach(() => limpiarDatos());
  afterEach(() => cleanup());
  const entrarComoAdmin = (ruta = '/admin') => {
    iniciarSesionComo(obtener('usuarios', 1));
    renderApp(ruta);
  };
  const escribir = (label, value) =>
    fireEvent.change(screen.getByLabelText(label), {
      target: {
        value,
      },
    });
  describe('acceso', () => {
    it('sin sesión muestra el login y no deja entrar con campos vacíos', () => {
      renderApp('/admin');
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Entrar al panel',
        }),
      );
      expect(screen.getByRole('alert').textContent).toBe('Ingresa usuario y contraseña.');
    });
    it('rechaza credenciales incorrectas y acepta las del admin', () => {
      renderApp('/admin');
      escribir('Usuario', 'admin@autocare.cl');
      escribir('Contraseña', 'otra');
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Entrar al panel',
        }),
      );
      expect(screen.getByRole('alert').textContent).toBe(
        'Correo o contraseña incorrectos.',
      );
      escribir('Contraseña', 'Admin123');
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Entrar al panel',
        }),
      );
      expect(
        screen.getByRole('heading', {
          name: 'Dashboard',
        }),
      ).toBeTruthy();
    });
    it('un cliente con sesión ve "Acceso restringido"', () => {
      iniciarSesionComo(obtener('usuarios', 2));
      renderApp('/admin');
      expect(
        screen.getByRole('heading', {
          name: 'Acceso restringido',
        }),
      ).toBeTruthy();
    });
    it('cerrar sesión vuelve al login', () => {
      entrarComoAdmin();
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Cerrar sesión',
        }),
      );
      expect(
        screen.getByRole('button', {
          name: 'Entrar al panel',
        }),
      ).toBeTruthy();
    });
  });
  it('el dashboard muestra métricas calculadas desde los datos', () => {
    entrarComoAdmin();
    expect(screen.getByTestId('metrica-Compras').textContent).toBe('2');
    expect(screen.getByTestId('metrica-Productos').textContent).toBe('10');
    expect(screen.getByText(/Hay 2 productos con stock crítico/)).toBeTruthy();
  });
  describe('productos (CRUD)', () => {
    it('crea un producto y aparece en el listado', () => {
      entrarComoAdmin('/admin/productos/nuevo');
      escribir('Nombre *', 'Refrigerante 1L');
      escribir('Categoría *', 'aceites');
      escribir('Precio *', '5990');
      escribir('Stock *', '10');
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Crear producto',
        }),
      );
      expect(
        screen.getByRole('heading', {
          name: 'Productos',
        }),
      ).toBeTruthy();
      expect(screen.getByText('Refrigerante 1L')).toBeTruthy();
      expect(listar('productos').length).toBe(11);
    });
    it('no crea el producto si el formulario es inválido', () => {
      entrarComoAdmin('/admin/productos/nuevo');
      escribir('Nombre *', 'Re');
      escribir('Precio *', '1000');
      escribir('Precio oferta (opcional)', '2000');
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Crear producto',
        }),
      );
      expect(
        screen.getByText('El nombre debe tener al menos 3 caracteres.'),
      ).toBeTruthy();
      expect(
        screen.getByText('La oferta debe ser mayor a 0 y menor que el precio.'),
      ).toBeTruthy();
      expect(listar('productos').length).toBe(10);
    });
    it('edita un producto existente (el formulario parte con sus datos)', () => {
      entrarComoAdmin('/admin/productos/2/editar');
      expect(screen.getByLabelText('Nombre *').value).toBe('Filtro de aceite universal');
      escribir('Stock *', '1');
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Guardar cambios',
        }),
      );
      expect(obtener('productos', 2).stock).toBe(1);
    });
    it('elimina un producto solo si se confirma (mock de window.confirm)', () => {
      const confirmar = spyOn(window, 'confirm').and.returnValue(false);
      entrarComoAdmin('/admin/productos');
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Eliminar Fusible estándar (pack 10)',
        }),
      );
      expect(confirmar).toHaveBeenCalled();
      expect(obtener('productos', 7)).not.toBeNull();
      confirmar.and.returnValue(true);
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Eliminar Fusible estándar (pack 10)',
        }),
      );
      expect(obtener('productos', 7)).toBeNull();
      expect(screen.queryByText('Fusible estándar (pack 10)')).toBeNull();
    });
    it('lista solo los productos críticos (stock ≤ 5)', () => {
      entrarComoAdmin('/admin/productos/criticos');
      const filas = within(screen.getByRole('table')).getAllByRole('row');
      expect(filas.length).toBe(3);
    });
    it('muestra el detalle de un producto', () => {
      entrarComoAdmin('/admin/productos/1');
      expect(
        screen.getByRole('heading', {
          name: 'Aceite sintético 5W-30 (4L)',
        }),
      ).toBeTruthy();
      expect(screen.getByText('$13.990')).toBeTruthy();
    });
  });
  describe('categorías', () => {
    it('crea, edita y no elimina categorías con productos', () => {
      entrarComoAdmin('/admin/categorias');
      escribir('Nueva categoría', 'Neumáticos');
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Agregar',
        }),
      );
      expect(listar('categorias').at(-1)).toEqual(
        jasmine.objectContaining({
          nombre: 'Neumáticos',
          slug: 'neumaticos',
        }),
      );
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Editar Neumáticos',
        }),
      );
      escribir('Nombre de la categoría', 'Neumáticos y llantas');
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Guardar',
        }),
      );
      expect(screen.getByText('Neumáticos y llantas')).toBeTruthy();
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Eliminar Accesorios',
        }),
      );
      expect(screen.getByRole('alert').textContent).toContain(
        'tiene productos asociados',
      );
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Eliminar Neumáticos y llantas',
        }),
      );
      expect(listar('categorias').length).toBe(4);
    });
    it('no permite categorías duplicadas', () => {
      entrarComoAdmin('/admin/categorias');
      escribir('Nueva categoría', 'Accesorios');
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Agregar',
        }),
      );
      expect(screen.getByRole('alert').textContent).toBe('Esa categoría ya existe.');
    });
  });
  describe('usuarios, órdenes y reportes', () => {
    it('crea un usuario nuevo', () => {
      entrarComoAdmin('/admin/usuarios/nuevo');
      escribir('Nombre *', 'Pedro');
      escribir('Correo *', 'pedro@correo.cl');
      escribir('Contraseña *', 'Clave1234');
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Crear usuario',
        }),
      );
      expect(screen.getByText('pedro@correo.cl')).toBeTruthy();
    });
    it('no permite correos repetidos al crear usuarios', () => {
      entrarComoAdmin('/admin/usuarios/nuevo');
      escribir('Nombre *', 'Camila');
      escribir('Correo *', 'camila@correo.cl');
      escribir('Contraseña *', 'Clave1234');
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Crear usuario',
        }),
      );
      expect(screen.getByText('Ese correo ya está registrado.')).toBeTruthy();
    });
    it('muestra el historial de compras de un usuario', () => {
      entrarComoAdmin('/admin/usuarios/2');
      expect(
        screen.getByRole('link', {
          name: 'ORD-1',
        }),
      ).toBeTruthy();
      expect(
        screen.getByRole('link', {
          name: 'ORD-2',
        }),
      ).toBeTruthy();
    });
    it('el admin no puede eliminarse a sí mismo', () => {
      entrarComoAdmin('/admin/usuarios');
      expect(
        screen.queryByRole('button', {
          name: 'Eliminar admin@autocare.cl',
        }),
      ).toBeNull();
      expect(
        screen.getByRole('button', {
          name: 'Eliminar camila@correo.cl',
        }),
      ).toBeTruthy();
    });
    it('filtra órdenes por estado y abre la boleta', () => {
      entrarComoAdmin('/admin/ordenes');
      escribir('Filtrar por estado', 'rechazada');
      expect(screen.getByText('No hay órdenes.')).toBeTruthy();
      escribir('Filtrar por estado', 'todas');
      fireEvent.click(
        screen.getAllByRole('link', {
          name: 'Ver boleta',
        })[0],
      );
      expect(
        screen.getByRole('heading', {
          name: 'Boleta ORD-2',
        }),
      ).toBeTruthy();
      expect(screen.getByTestId('total-orden').textContent).toBe('$34.990');
    });
    it('reportes calcula total vendido y más vendidos', () => {
      entrarComoAdmin('/admin/reportes');
      expect(screen.getByText('$55.970')).toBeTruthy();
      expect(screen.getByText(/Kit de detailing completo/)).toBeTruthy();
    });
    it('perfil actualiza el nombre del admin y la sesión', () => {
      entrarComoAdmin('/admin/perfil');
      escribir('Nombre', 'Vicente');
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Guardar',
        }),
      );
      expect(screen.getByRole('status').textContent).toBe('Perfil actualizado.');
      expect(screen.getByText('Administrador: Vicente')).toBeTruthy();
    });
  });
});
