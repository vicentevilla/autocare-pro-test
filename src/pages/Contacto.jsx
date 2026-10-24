import { useState } from 'react';
import { crear } from '../data/baseDatos';
import { esFormularioValido, validarContacto } from '../utils/validaciones';
import CampoTexto from '../components/CampoTexto';
import EncabezadoPagina from '../components/EncabezadoPagina';

const VACIO = {
  nombre: '',
  email: '',
  mensaje: '',
};
export default function Contacto() {
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  function handleChange(e) {
    setValores({
      ...valores,
      [e.target.name]: e.target.value,
    });
    setEnviado(false);
  }
  function handleSubmit(e) {
    e.preventDefault();
    const nuevos = validarContacto(valores);
    setErrores(nuevos);
    if (!esFormularioValido(nuevos)) return;
    crear('mensajes', {
      ...valores,
      fecha: new Date().toISOString(),
    });
    setValores(VACIO);
    setEnviado(true);
  }
  return (
    <>
      <EncabezadoPagina eyebrow="ESCRÍBENOS" titulo="Contacto" />
      <div className="container section-space pt-4">
        <div className="row g-5">
          <div className="col-lg-5">
            <p>¿Dudas sobre qué repuesto sirve para tu auto? Escríbenos y te ayudamos.</p>
            <ul className="list-unstyled text-secondary">
              <li>📍 Av. Matta 1234, Santiago</li>
              <li>📞 +56 2 2345 6789</li>
              <li>✉️ contacto@autocare.cl</li>
            </ul>
          </div>
          <div className="col-lg-7">
            <form className="form-card" onSubmit={handleSubmit} noValidate>
              <CampoTexto
                id="nombre"
                label="Nombre"
                value={valores.nombre}
                onChange={handleChange}
                error={errores.nombre}
              />
              <CampoTexto
                id="email"
                label="Correo electrónico"
                type="email"
                value={valores.email}
                onChange={handleChange}
                error={errores.email}
              />
              <CampoTexto
                id="mensaje"
                label="Mensaje"
                como="textarea"
                rows={4}
                value={valores.mensaje}
                onChange={handleChange}
                error={errores.mensaje}
                ayuda={`${valores.mensaje.length}/500 caracteres`}
              />
              <button type="submit" className="btn btn-primario">
                Enviar mensaje
              </button>
              {enviado && (
                <p className="alert alert-success mt-3 mb-0" role="alert">
                  ¡Gracias! Recibimos tu mensaje y te responderemos pronto.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
