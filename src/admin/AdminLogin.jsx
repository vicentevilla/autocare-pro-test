import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';

export default function AdminLogin() {
  const { iniciarSesion } = useApp();
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  function handleSubmit(event) {
    event.preventDefault();
    if (email.trim() === '' || clave === '') {
      setError('Ingresa usuario y contraseña.');
      return;
    }
    setError(iniciarSesion(email, clave));
  }
  return (
    <div className="admin-page py-5">
      <section className="admin-login card shadow-sm">
        <div className="card-body p-4 p-md-5">
          <div className="admin-login-logo mb-3">
            <Logo />
          </div>
          <p className="eyebrow">ACCESO ADMIN</p>
          <h1 className="h2">Iniciar sesión</h1>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="usuario" className="form-label">
                Usuario
              </label>
              <input
                id="usuario"
                type="email"
                className="form-control"
                autoComplete="username"
                placeholder="admin@autocare.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="clave-admin" className="form-label">
                Contraseña
              </label>
              <input
                id="clave-admin"
                type="password"
                className="form-control"
                autoComplete="current-password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
            </div>
            {error && (
              <p className="alert alert-danger py-2" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="btn btn-primario w-100">
              Entrar al panel
            </button>
          </form>
          <p className="small text-secondary mt-3 mb-0">
            Demo: admin@autocare.cl / Admin123
          </p>
          <Link to="/" className="small">
            ← Volver a la tienda
          </Link>
        </div>
      </section>
    </div>
  );
}
