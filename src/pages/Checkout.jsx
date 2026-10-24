import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { actualizar, crear, obtener } from '../data/baseDatos';
import { REGIONES } from '../data/semilla';
import { calcularTotal, formatearPrecio } from '../utils/carrito';
import { esFormularioValido, validarCheckout } from '../utils/validaciones';
import { procesarPago } from '../utils/pago';
import CampoTexto from '../components/CampoTexto';

const ahora = () => new Date().toISOString();
export default function Checkout({ pasarela = procesarPago }) {
  const { carrito, usuario, vaciar } = useApp();
  const navigate = useNavigate();
  const [valores, setValores] = useState({
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    email: usuario?.email ?? '',
    calle: usuario?.calle ?? '',
    depto: usuario?.depto ?? '',
    region: usuario?.region ?? '',
    comuna: usuario?.comuna ?? '',
    indicaciones: '',
    simularRechazo: false,
  });
  const [errores, setErrores] = useState({});
  const total = calcularTotal(carrito);
  if (carrito.length === 0) {
    return (
      <div className="container section-space text-center">
        <h1 className="h3">Tu carrito está vacío</h1>
        <Link to="/productos" className="btn btn-primario mt-2">
          Ir a la tienda
        </Link>
      </div>
    );
  }
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const nuevo = {
      ...valores,
      [name]: type === 'checkbox' ? checked : value,
    };
    if (name === 'region') nuevo.comuna = '';
    setValores(nuevo);
  }
  function handleSubmit(e) {
    e.preventDefault();
    const nuevos = validarCheckout(valores);
    setErrores(nuevos);
    if (!esFormularioValido(nuevos)) return;
    const aprobado = pasarela(valores);
    const { nombre, apellidos, email, calle, depto, region, comuna, indicaciones } =
      valores;
    const orden = crear('ordenes', {
      fecha: ahora(),
      estado: aprobado ? 'pagada' : 'rechazada',
      usuarioId: usuario?.id ?? null,
      cliente: {
        nombre,
        apellidos,
        email,
      },
      direccion: {
        calle,
        depto,
        region,
        comuna,
        indicaciones,
      },
      items: carrito,
      total,
    });
    if (aprobado) {
      carrito.forEach((item) => {
        const producto = obtener('productos', item.id);
        if (producto) {
          actualizar('productos', item.id, {
            stock: Math.max(0, producto.stock - item.cantidad),
          });
        }
      });
      vaciar();
      navigate(`/compra/exitosa/${orden.id}`);
    } else {
      navigate(`/compra/error/${orden.id}`);
    }
  }
  const campo = (id, label, extra = {}) => (
    <CampoTexto
      id={id}
      label={label}
      value={valores[id]}
      onChange={handleChange}
      error={errores[id]}
      className="col-md-6"
      {...extra}
    />
  );
  return (
    <div className="container section-space">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="form-card">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <h1 className="h3 mb-0">Checkout</h1>
              <span className="badge text-bg-primary fs-6">
                Total a pagar: {formatearPrecio(total)}
              </span>
            </div>
            <ul className="list-group mb-4">
              {carrito.map((item) => (
                <li
                  className="list-group-item d-flex justify-content-between"
                  key={item.id}
                >
                  <span>
                    {item.nombre} × {item.cantidad}
                  </span>
                  <span>{formatearPrecio(item.precio * item.cantidad)}</span>
                </li>
              ))}
            </ul>

            <form onSubmit={handleSubmit} noValidate>
              <h2 className="h5">Información del cliente</h2>
              <div className="row g-3 mb-4">
                {campo('nombre', 'Nombre *')}
                {campo('apellidos', 'Apellidos *')}
                {campo('email', 'Correo *', {
                  type: 'email',
                })}
              </div>

              <h2 className="h5">Dirección de entrega</h2>
              <div className="row g-3">
                {campo('calle', 'Calle y número *')}
                {campo('depto', 'Departamento (opcional)', {
                  placeholder: 'Ej: 603',
                })}
                {campo('region', 'Región *', {
                  como: 'select',
                  children: (
                    <>
                      <option value="">Selecciona una región</option>
                      {Object.keys(REGIONES).map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </>
                  ),
                })}
                {campo('comuna', 'Comuna *', {
                  como: 'select',
                  disabled: !valores.region,
                  children: (
                    <>
                      <option value="">Selecciona una comuna</option>
                      {(REGIONES[valores.region] ?? []).map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </>
                  ),
                })}
                {campo('indicaciones', 'Indicaciones para la entrega (opcional)', {
                  como: 'textarea',
                  rows: 2,
                  className: 'col-12',
                  placeholder: 'Ej: entre calles, color del edificio, no tiene timbre.',
                })}
              </div>

              <div className="form-check mt-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="simularRechazo"
                  name="simularRechazo"
                  checked={valores.simularRechazo}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label small text-secondary"
                  htmlFor="simularRechazo"
                >
                  Simular pago rechazado (demostración)
                </label>
              </div>

              <button type="submit" className="btn btn-success btn-lg w-100 mt-3">
                Pagar ahora {formatearPrecio(total)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
