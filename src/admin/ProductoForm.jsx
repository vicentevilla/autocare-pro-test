import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { actualizar, crear, obtener } from '../data/baseDatos';
import useColeccion from '../hooks/useColeccion';
import { esFormularioValido, validarProducto } from '../utils/validaciones';
import CampoTexto from '../components/CampoTexto';

const VACIO = {
  nombre: '',
  categoria: '',
  descripcion: '',
  precio: '',
  precioOferta: '',
  stock: '',
  imagen: '',
};
export default function ProductoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const categorias = useColeccion('categorias');
  const existente = id ? obtener('productos', id) : null;
  const [valores, setValores] = useState(() =>
    existente
      ? {
          ...existente,
          precioOferta: existente.precioOferta ?? '',
        }
      : VACIO,
  );
  const [errores, setErrores] = useState({});
  if (id && !existente) return <p>Producto no encontrado.</p>;
  function handleChange(e) {
    setValores({
      ...valores,
      [e.target.name]: e.target.value,
    });
  }
  function handleSubmit(e) {
    e.preventDefault();
    const nuevos = validarProducto(valores);
    setErrores(nuevos);
    if (!esFormularioValido(nuevos)) return;
    const datos = {
      nombre: valores.nombre.trim(),
      categoria: valores.categoria,
      descripcion: valores.descripcion.trim(),
      precio: Number(valores.precio),
      precioOferta: valores.precioOferta === '' ? null : Number(valores.precioOferta),
      stock: Number(valores.stock),
      imagen: valores.imagen.trim(),
    };
    if (existente) actualizar('productos', id, datos);
    else crear('productos', datos);
    navigate('/admin/productos');
  }
  const campo = (nombre, label, extra = {}) => (
    <CampoTexto
      id={nombre}
      label={label}
      value={valores[nombre]}
      onChange={handleChange}
      error={errores[nombre]}
      className="col-md-6"
      {...extra}
    />
  );
  return (
    <>
      <h1 className="h3">
        {existente ? `Editar: ${existente.nombre}` : 'Nuevo producto'}
      </h1>
      <form className="card card-body" onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          {campo('nombre', 'Nombre *')}
          {campo('categoria', 'Categoría *', {
            como: 'select',
            children: (
              <>
                <option value="">Selecciona una categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.nombre}
                  </option>
                ))}
              </>
            ),
          })}
          {campo('descripcion', 'Descripción', {
            como: 'textarea',
            rows: 3,
            className: 'col-12',
          })}
          {campo('precio', 'Precio *', {
            type: 'number',
            min: 1,
          })}
          {campo('precioOferta', 'Precio oferta (opcional)', {
            type: 'number',
            min: 1,
          })}
          {campo('stock', 'Stock *', {
            type: 'number',
            min: 0,
          })}
          {campo('imagen', 'Ruta o URL de la imagen', {
            placeholder: '/img/Filtro.jpg',
          })}
        </div>
        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primario">
            {existente ? 'Guardar cambios' : 'Crear producto'}
          </button>
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}
