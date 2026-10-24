import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={[
        'h-10 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm text-ink shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-colors placeholder:text-[#9ca3af]',
        'focus:border-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#9ca3af]',
        'disabled:cursor-not-allowed disabled:bg-[#f9fafb] disabled:text-[#9ca3af]',
        className,
      ].join(' ')}
    />
  );
}

export function NumberInput({ className = '', ...rest }: InputProps) {
  return <Input type="number" className={className} {...rest} />;
}
