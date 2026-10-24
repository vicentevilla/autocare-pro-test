import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  esFormularioValido,
  validarClave,
  validarEmail,
  validarNombre,
  validarRegistro,
} from '../utils/validaciones';
import CampoTexto from '../components/CampoTexto';
import EncabezadoPagina from '../components/EncabezadoPagina';

const VACIO = {
  nombre: '',
  email: '',
  clave: '',
};
const VALIDADORES = {
  nombre: validarNombre,
  email: validarEmail,
  clave: validarClave,
};
export default function Registro() {
  const { registrar } = useApp();
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState(VACIO);
  const [mensaje, setMensaje] = useState({
    texto: '',
    tipo: '',
  });
  function handleChange(event) {
    const { name, value } = event.target;
    setValores({
      ...valores,
      [name]: value,
    });
    setMensaje({
      texto: '',
      tipo: '',
    });
  }
  function handleBlur(event) {
    const { name, value } = event.target;
    setErrores({
      ...errores,
      [name]: VALIDADORES[name](value),
    });
  }
  function handleSubmit(event) {
    event.preventDefault();
    const nuevosErrores = validarRegistro(valores);
    setErrores(nuevosErrores);
    if (!esFormularioValido(nuevosErrores)) {
      setMensaje({
        texto: 'Revisa los campos marcados en rojo.',
        tipo: 'danger',
      });
      return;
    }
    const error = registrar({
      ...valores,
      nombre: valores.nombre.trim(),
    });
    if (error) {
      setMensaje({
        texto: error,
        tipo: 'danger',
      });
      return;
    }
    setMensaje({
      texto: '¡Registro exitoso! Bienvenido/a a AutoCare Pro.',
      tipo: 'success',
    });
    setValores(VACIO);
  }
  return (
    <>
      <EncabezadoPagina eyebrow="CUENTA" titulo="Crear cuenta" />
      <div className="container section-space pt-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <form className="form-card" onSubmit={handleSubmit} noValidate>
              <CampoTexto
                id="nombre"
                label="Nombre completo"
                autoComplete="name"
                value={valores.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errores.nombre}
              />
              <CampoTexto
                id="email"
                label="Correo electrónico"
                type="email"
                autoComplete="email"
                value={valores.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errores.email}
              />
              <CampoTexto
                id="clave"
                label="Contraseña"
                type="password"
                autoComplete="new-password"
                value={valores.clave}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errores.clave}
                ayuda="Mínimo 8 caracteres, una mayúscula y un número."
              />
              <button type="submit" className="btn btn-primario w-100">
                Registrarse
              </button>
              <p
                role="alert"
                className={`mt-3 mb-0 fw-semibold ${mensaje.tipo ? `text-${mensaje.tipo}` : ''}`}
              >
                {mensaje.texto}
              </p>
              <p className="small mt-3 mb-0">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
