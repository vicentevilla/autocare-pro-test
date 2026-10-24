import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import useColeccion from '../hooks/useColeccion';
import ListaProductos from '../components/ListaProductos';

export default function Home() {
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();
  const { agregar } = useApp();
  const categorias = useColeccion('categorias');
  const ofertas = useColeccion('productos').filter((p) => p.precioOferta != null);
  function handleSubmit(event) {
    event.preventDefault();
    navigate(`/productos?q=${encodeURIComponent(busqueda.trim())}`);
  }
  return (
    <>
      <section className="hero-section">
        <div className="container text-center">
          <p className="eyebrow">REPUESTOS · LUBRICANTES · ACCESORIOS</p>
          <h1>Todo para el mantenimiento de tu vehículo</h1>
          <p className="hero-description">
            Repuestos, lubricantes y accesorios con despacho directo o retiro en tienda.
          </p>
          <form role="search" className="hero-search" onSubmit={handleSubmit}>
            <label htmlFor="buscador" className="visually-hidden">
              Buscar producto o repuesto
            </label>
            <input
              type="search"
              id="buscador"
              className="form-control form-control-lg"
              placeholder="Ej: filtro de aceite"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
            <button type="submit" className="btn btn-light btn-lg">
              Buscar
            </button>
          </form>
        </div>
        <div className="benefits">
          <div className="container">
            <div className="row g-3 text-center">
              <div className="col-md-4">🚚 Despacho a todo Chile</div>
              <div className="col-md-4">🏬 Retiro en tienda</div>
              <div className="col-md-4">🔧 Asesoría para tu modelo</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-space">
        <p className="eyebrow">EXPLORA</p>
        <h2>Categorías</h2>
        <div className="row g-3 mt-1">
          {categorias.map((c) => (
            <div className="col-6 col-md-3" key={c.id}>
              <Link to={`/categorias/${c.slug}`} className="card categoria-card h-100">
                <img src={c.imagen} alt="" className="categoria-imagen" />
                <span className="card-body fw-semibold text-center">{c.nombre}</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-5">
        <div className="d-flex justify-content-between align-items-end mb-3">
          <div>
            <p className="eyebrow">AHORRA</p>
            <h2 className="mb-0">Ofertas destacadas</h2>
          </div>
          <Link to="/ofertas" className="text-link">
            Ver todas →
          </Link>
        </div>
        <ListaProductos
          productos={ofertas.slice(0, 4)}
          onAgregar={agregar}
          columnas="col-sm-6 col-lg-3"
        />
      </section>
    </>
  );
}
