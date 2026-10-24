export default function CampoTexto({
  id,
  label,
  error,
  ayuda,
  como = 'input',
  className = 'mb-3',
  children,
  ...props
}) {
  const Etiqueta = como;
  const claseBase = como === 'select' ? 'form-select' : 'form-control';
  const descritoPor = [ayuda && `ayuda-${id}`, error && `error-${id}`]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={className}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <Etiqueta
        id={id}
        name={id}
        className={`${claseBase} ${error ? 'is-invalid' : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={descritoPor || undefined}
        {...props}
      >
        {children}
      </Etiqueta>
      {ayuda && (
        <div id={`ayuda-${id}`} className="form-text">
          {ayuda}
        </div>
      )}

      {error && (
        <div id={`error-${id}`} className="invalid-feedback">
          {error}
        </div>
      )}
    </div>
  );
}
