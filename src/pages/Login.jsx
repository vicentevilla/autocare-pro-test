import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CampoTexto from '../components/CampoTexto';
import EncabezadoPagina from '../components/EncabezadoPagina';

export default function Login() {
  const { iniciarSesion } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim() === '' || clave === '') {
      setError('Ingresa tu correo y contraseña.');
      return;
    }
    const resultado = iniciarSesion(email, clave);
    if (resultado) {
      setError(resultado);
      return;
    }
    navigate('/');
  }
  return (
    <>
      <EncabezadoPagina eyebrow="CUENTA" titulo="Iniciar sesión" />
      <div className="container section-space pt-4">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <form className="form-card" onSubmit={handleSubmit} noValidate>
              <CampoTexto
                id="login-email"
                label="Correo electrónico"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <CampoTexto
                id="login-clave"
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
              {error && (
                <p className="alert alert-danger py-2" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className="btn btn-primario w-100">
                Entrar
              </button>
              <p className="small mt-3 mb-0">
                ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
              </p>
              <p className="small text-secondary mt-2 mb-0">
                Demo cliente: camila@correo.cl / Cliente123 · Admin: admin@autocare.cl /
                Admin123
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
