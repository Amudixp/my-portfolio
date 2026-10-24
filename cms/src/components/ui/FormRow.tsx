import type { ReactNode } from 'react';

interface FormRowProps {
  label: string;
  helper?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FormRow({ label, helper, children, className = '' }: FormRowProps) {
  return (
    <div
      className={[
        'grid gap-2 border-b border-[#f1f1ef] px-6 py-6 last:border-b-0 sm:px-8 md:grid-cols-[200px_1fr] md:items-start md:gap-6',
        className,
      ].join(' ')}
    >
      <div className="space-y-1">
        <label className="text-sm font-medium text-ink">{label}</label>
        {helper ? <p className="text-xs text-[#6b7280]">{helper}</p> : null}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
