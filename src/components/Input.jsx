import './Input.css';

export function Input({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  ...props
}) {
  return (
    <div className="input-group">
      {label && (
        <label className="input-group__label">
          {label}
          {required && <span className="input-group__required">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`input ${error ? 'input--error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  rows = 4,
  ...props
}) {
  return (
    <div className="input-group">
      {label && (
        <label className="input-group__label">
          {label}
          {required && <span className="input-group__required">*</span>}
        </label>
      )}
      <textarea
        className={`input input--textarea ${error ? 'input--error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        rows={rows}
        {...props}
      />
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
}

export function Select({
  label,
  error,
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  placeholder,
  ...props
}) {
  return (
    <div className="input-group">
      {label && (
        <label className="input-group__label">
          {label}
          {required && <span className="input-group__required">*</span>}
        </label>
      )}
      <select
        className={`input input--select ${error ? 'input--error' : ''}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(({ value: val, label: lbl }) => (
          <option key={val} value={val}>{lbl}</option>
        ))}
      </select>
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
}
