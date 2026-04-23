const variants = {
  primary:
    'bg-primary text-white hover:bg-secondary shadow-sm hover:shadow-md',
  secondary:
    'bg-white dark:bg-surface-dark text-primary dark:text-white border border-gray-200 dark:border-gray-700 hover:border-accent',
  ghost: 'text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800',
};

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  className = '',
  children,
  ...rest
}) {
  return (
    <Comp
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  );
}
