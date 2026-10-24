import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-white hover:bg-[#151f06] disabled:hover:bg-ink',
  outline: 'bg-white text-ink border border-[#e5e7eb] hover:bg-[#f9fafb] disabled:hover:bg-white',
  ghost: 'bg-transparent text-[#374151] hover:bg-[#f3f4f6] hover:text-ink',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes: Record<Size, string> = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-3.5 py-2 text-sm',
  lg: 'px-4 py-2.5 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
    >
      {loading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  tone?: 'default' | 'danger';
}

export function IconButton({ label, tone = 'default', className = '', children, ...rest }: IconButtonProps) {
  return (
    <button
      {...rest}
      title={label}
      aria-label={label}
      className={[
        'inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
        tone === 'danger'
          ? 'text-[#6b7280] hover:bg-red-50 hover:text-red-600'
          : 'text-[#6b7280] hover:bg-[#f3f4f6] hover:text-ink',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}
