import type { ReactNode } from 'react';

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm text-muted">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      {label}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-pill bg-page-light/60 px-6 py-12 text-center">
      {icon ? <div className="text-muted">{icon}</div> : null}
      <p className="text-sm font-medium text-ink">{title}</p>
      {description ? <p className="max-w-sm text-sm text-muted">{description}</p> : null}
      {action}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'accent' | 'warning';
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  const tones = {
    neutral: 'bg-pill/60 text-ink',
    accent: 'bg-accent/10 text-accent',
    warning: 'bg-amber-100 text-amber-800',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
