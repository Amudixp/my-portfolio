import type { ReactNode } from 'react';

interface TabsProps {
  children: ReactNode;
}

export function Tabs({ children }: TabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {children}
    </div>
  );
}

interface TabProps {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function Tab({ active = false, onClick, children }: TabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'relative inline-flex items-center gap-2 rounded-t-lg px-3 py-2 text-sm transition-colors',
        active
          ? 'bg-[#f8f9fa] font-medium text-ink'
          : 'text-[#6b7280] hover:text-ink',
      ].join(' ')}
    >
      {children}
      {active ? <span className="absolute inset-x-0 -bottom-px h-px bg-[#f8f9fa]" /> : null}
    </button>
  );
}
