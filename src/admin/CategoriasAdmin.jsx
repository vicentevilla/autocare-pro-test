import { useState } from 'react';
import { actualizar, crear, eliminar } from '../data/baseDatos';
import useColeccion from '../hooks/useColeccion';
import { crearSlug } from '../utils/slug';

export default function CategoriasAdmin() {
  const categorias = useColeccion('categorias');
  const productos = useColeccion('productos');
  const [nombre, setNombre] = useState('');
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');
  const cantidad = (slug) => productos.filter((p) => p.categoria === slug).length;
  function handleCrear(e) {
    e.preventDefault();
    const limpio = nombre.trim();
    if (limpio.length < 3) return setError('El nombre debe tener al menos 3 caracteres.');
    const slug = crearSlug(limpio);
    if (categorias.some((c) => c.slug === slug))
      return setError('Esa categoría ya existe.');
    crear('categorias', {
      nombre: limpio,
      slug,
      imagen: '/img/kit.png',
    });
    setNombre('');
    setError('');
  }
  function handleGuardar() {
    if (editando.nombre.trim().length < 3)
      return setError('El nombre debe tener al menos 3 caracteres.');
    actualizar('categorias', editando.id, {
      nombre: editando.nombre.trim(),
    });
    setEditando(null);
    setError('');
  }
  function handleEliminar(c) {
    if (cantidad(c.slug) > 0) {
      setError(`No se puede eliminar "${c.nombre}": tiene productos asociados.`);
      return;
    }
    eliminar('categorias', c.id);
    setError('');
  }
  return (
    <>
      <h1 className="h3">Categorías</h1>
      <form className="card card-body mb-3" onSubmit={handleCrear} noValidate>
        <label htmlFor="nueva-categoria" className="form-label">
          Nueva categoría
        </label>
        <div className="d-flex gap-2">
          <input
            id="nueva-categoria"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button type="submit" className="btn btn-primario text-nowrap">
            Agregar
          </button>
        </div>
      </form>
      {error && (
        <p className="alert alert-danger" role="alert">
          {error}
        </p>
      )}
      <div className="card">
        <ul className="list-group list-group-flush">
          {categorias.map((c) => (
            <li
              key={c.id}
              className="list-group-item d-flex flex-wrap justify-content-between align-items-center gap-2"
            >
              {editando?.id === c.id ? (
                <>
                  <label htmlFor={`editar-${c.id}`} className="visually-hidden">
                    Nombre de la categoría
                  </label>
                  <input
                    id={`editar-${c.id}`}
                    className="form-control w-auto flex-grow-1"
                    value={editando.nombre}
                    onChange={(e) =>
                      setEditando({
                        ...editando,
                        nombre: e.target.value,
                      })
                    }
                  />
                  <span className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      onClick={handleGuardar}
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => setEditando(null)}
                    >
                      Cancelar
                    </button>
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {c.nombre}{' '}
                    <span className="badge text-bg-secondary">
                      {cantidad(c.slug)} productos
                    </span>
                  </span>
                  <span className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      aria-label={`Editar ${c.nombre}`}
                      onClick={() =>
                        setEditando({
                          id: c.id,
                          nombre: c.nombre,
                        })
                      }
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      aria-label={`Eliminar ${c.nombre}`}
                      onClick={() => handleEliminar(c)}
                    >
                      Eliminar
                    </button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
