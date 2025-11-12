import './Button.css';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = ''
}) {
  const baseClasses = `button button--${variant} button--${size}`;
  const classes = [baseClasses, fullWidth && 'button--full', className].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
