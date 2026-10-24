import type { ReactNode } from 'react';

interface PageHeaderProps {
  thumbnail?: ReactNode;
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  tabs?: ReactNode;
}

export function PageHeader({ thumbnail, title, subtitle, actions, tabs }: PageHeaderProps) {
  return (
    <header className="border-b border-[#f1f1ef]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {thumbnail ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#f1f1ef] bg-[#f8f9fa]">
              {thumbnail}
            </div>
          ) : null}
          <div className="min-w-0">
            <h1 className="truncate text-[18px] font-semibold tracking-[-0.01em] text-ink">{title}</h1>
            {subtitle ? <p className="truncate text-xs text-[#6b7280]">{subtitle}</p> : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {tabs ? <div className="px-6 sm:px-8">{tabs}</div> : null}
    </header>
  );
}
