import type { ReactNode } from 'react';

interface AppShellProps {
  sidebar: ReactNode;
  header?: ReactNode;
  children: ReactNode;
}

export function AppShell({ sidebar, header, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-[#f8f9f6]">
      <aside className="hidden w-[240px] shrink-0 border-r border-[#f1f1ef] bg-white lg:flex lg:flex-col">
        {sidebar}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          {header ? <header className="flex items-center gap-3 lg:hidden">{header}</header> : null}
          <main className="flex-1">
            <div className="rounded-2xl bg-white shadow-[0_1px_1px_rgba(0,0,0,0.01),0_1px_2px_rgba(0,0,0,0.02)]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
