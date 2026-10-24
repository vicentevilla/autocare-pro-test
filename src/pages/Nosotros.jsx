import EncabezadoPagina from '../components/EncabezadoPagina';

const VALORES = [
  ['🔧', 'Asesoría experta', 'Te ayudamos a elegir el repuesto correcto para tu modelo.'],
  [
    '✅',
    'Productos originales',
    'Trabajamos solo con marcas y distribuidores autorizados.',
  ],
  ['🚚', 'Despacho rápido', 'Enviamos a todo Chile o puedes retirar en tienda.'],
];
export default function Nosotros() {
  return (
    <>
      <EncabezadoPagina eyebrow="QUIÉNES SOMOS" titulo="Nosotros" />
      <div className="container section-space pt-4">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <p className="lead">
              AutoCare Pro nació para que mantener tu vehículo sea simple: todo lo que
              necesitas en un solo lugar, con precios claros y asesoría real.
            </p>
            <p className="text-secondary">
              Vendemos lubricantes, filtros, productos de detailing, iluminación y
              accesorios para autos particulares. Nuestra meta es que cada cliente
              encuentre el producto adecuado sin tener que ser mecánico.
            </p>
          </div>
          <div className="col-lg-6">
            <img
              src="/img/kit.png"
              alt="Productos de detailing"
              className="img-fluid rounded"
            />
          </div>
        </div>
        <div className="row g-4 mt-4">
          {VALORES.map(([icono, titulo, texto]) => (
            <div className="col-md-4" key={titulo}>
              <div className="card h-100">
                <div className="card-body">
                  <p className="fs-2 mb-1" aria-hidden="true">
                    {icono}
                  </p>
                  <h2 className="h5">{titulo}</h2>
                  <p className="text-secondary mb-0">{texto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
