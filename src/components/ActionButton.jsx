export default function ActionButton({
  children,
  className = '',
  icon: Icon,
  variant = 'primary',
  ...props
}) {
  return (
    <button className={`action-button action-button-${variant} ${className}`} {...props}>
      {Icon ? <Icon aria-hidden="true" size={22} strokeWidth={2.4} /> : null}
      <span>{children}</span>
    </button>
  );
}
