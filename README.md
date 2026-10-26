# AutoCare Pro — versión 2 (React + Vite + Bootstrap)

Tienda de repuestos y accesorios automotrices. La versión 1 era HTML + CSS +
JavaScript; esta versión migra el sitio a **React con Vite**, navega entre vistas
con **React Router**, usa **Bootstrap 5** para el diseño responsive, guarda los
datos en una **base de datos simulada en JavaScript (CRUD + localStorage)** y
tiene **pruebas unitarias con Jasmine + Karma** e informe de cobertura.

## Cómo ejecutarlo

```sh
npm install
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm test           # 99 pruebas con Jasmine + Karma + cobertura
npm run build      # build de producción (carpeta dist/)
npm run lint       # revisión de código con oxlint
```

## Después de `npm test`, abre `coverage/html/index.html` (en PowerShell:
## `Start-Process .\coverage\html\index.html`).

Usuarios de prueba:

| Rol     | Correo            | Contraseña |
| ------- | ----------------- | ---------- |
| Admin   | admin@autocare.cl | Admin123   |
| Cliente | camila@correo.cl  | Cliente123 |

## Vistas (rutas)

**Tienda:** `/` inicio · `/productos` · `/producto/:id` · `/categorias` y
`/categorias/:slug` · `/ofertas` · `/nosotros` · `/blog` y `/blog/:id` ·
`/contacto` · `/registro` · `/login` · `/carrito` · `/checkout` ·
`/compra/exitosa/:id` · `/compra/error/:id`

**Administrador** (requiere rol admin): `/admin` dashboard · `/admin/ordenes`
y boleta · `/admin/productos` (nuevo, ver, editar, eliminar, críticos) ·
`/admin/categorias` · `/admin/usuarios` (nuevo, ver con historial, editar) ·
`/admin/reportes` · `/admin/perfil`

## Organización

```
src/
  main.jsx            BrowserRouter + AppProvider + App
  App.jsx             mapa de rutas (tienda y admin)
  context/            AppContext: carrito y sesión compartidos
  data/
    semilla.js        datos iniciales (productos, categorías, usuarios, órdenes, blogs)
    baseDatos.js      CRUD: listar, obtener, crear, actualizar, eliminar (+ localStorage)
  hooks/useColeccion  lee una colección y re-renderiza cuando cambia
  components/         piezas reutilizables (Header, Producto, Carrito, Catalogo, ...)
  pages/              vistas de la tienda
  admin/              vistas del panel de administración
  utils/              lógica pura: carrito, validaciones, reportes, pago, slug
  test/               *.spec.jsx (Jasmine) + helpers.jsx
```

## Conceptos de React usados

- **Componentes y props**: `ListaProductos` le pasa cada producto a `Producto` con `{...producto}`.
- **useState**: menú móvil, filtros, paginación, formularios controlados.
- **Context**: carrito y sesión disponibles en todas las vistas sin pasar props por cada nivel.
- **useEffect**: guarda carrito y sesión en `localStorage` cuando cambian.
- **useSyncExternalStore** (en `useColeccion`): si el admin cambia un producto, la tienda se actualiza sola.
- **React Router**: rutas anidadas con layouts, `useParams`, `useNavigate`, `useSearchParams`, `NavLink`.
- **Renderizado condicional**, **listas con map + key**, **formularios controlados** con validación en `onBlur` y `onSubmit`.

## Pruebas (99 casos, 12 archivos)

Renderizado, renderizado condicional, props, estado y eventos de los componentes;
pruebas de integración de rutas, checkout y panel admin; mocks con
`jasmine.createSpy` y `spyOn` (localStorage, `window.confirm`, pasarela de pago).
Cobertura: 94,9 % de líneas y 86,6 % de ramas.

## Notas

- Los datos viven en el `localStorage` del navegador. Para volver a los datos
  iniciales, borra las claves `autocare-*` desde las herramientas del navegador.
- El pago es simulado: en el checkout se puede marcar «Simular pago rechazado».
