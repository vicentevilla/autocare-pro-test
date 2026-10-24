export default function EncabezadoPagina({ eyebrow, titulo, children }) {
  return (
    <div className="encabezado-pagina">
      <div className="container">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="h2 mb-0">{titulo}</h1>
        {children && <div className="mt-2 text-secondary">{children}</div>}
      </div>
    </div>
  );
}
