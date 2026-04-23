import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, className = '', ...props }, ref) {
  return (
    <div>
      {label && (
        <label className="block text-xs uppercase tracking-wider text-muted font-semibold mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        {...props}
        className={`w-full px-4 py-3 rounded-xl bg-bg dark:bg-bg-dark border border-gray-200 dark:border-gray-700 text-sm text-text dark:text-text-dark focus:outline-none focus:border-accent transition-colors ${
          error ? 'border-red-400 dark:border-red-400' : ''
        } ${className}`}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
