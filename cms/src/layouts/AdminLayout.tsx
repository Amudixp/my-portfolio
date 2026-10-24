import { useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  Award,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronRight,
  Code2,
  FolderOpen,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Navigation,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui/Feedback';
import { AppShell } from '../components/layout/AppShell';

const navGroups = [
  {
    label: 'Overview',
    items: [{ path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { path: '/profile', label: 'Profile', icon: User },
      { path: '/projects', label: 'Projects', icon: Code2, badge: 18 },
      { path: '/experiences', label: 'Experiences', icon: Briefcase },
      { path: '/organizations', label: 'Organizations', icon: Building2 },
      { path: '/skills', label: 'Skills', icon: Sparkles },
      { path: '/education', label: 'Education', icon: Award },
    ],
  },
  {
    label: 'Sections',
    items: [
      { path: '/sections/hero', label: 'Hero', icon: ImageIcon },
      { path: '/sections/about', label: 'About', icon: ImageIcon },
      { path: '/sections/contact', label: 'Contact', icon: ImageIcon },
      { path: '/sections/navigation', label: 'Navigation', icon: Navigation },
    ],
  },
  {
    label: 'Assets',
    items: [{ path: '/media', label: 'Media library', icon: FolderOpen }],
  },
];

export function AdminLayout() {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9f6]">
        <Spinner label="Checking the session…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-[11px] font-semibold text-white">
            AP
          </span>
          <span className="text-sm font-medium tracking-tight text-ink">Portfolio CMS</span>
        </Link>
        <button
          type="button"
          className="text-[#6b7280] lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {navGroups.map((group) => (
          <div key={group.label}>
            <button
              type="button"
              onClick={() => (group.label === 'Content' ? setContentOpen((v) => !v) : null)}
              className="mb-1 flex w-full items-center justify-between px-3 text-[11px] text-[#9ca3af]"
            >
              <span>{group.label}</span>
              {group.label === 'Content' ? (contentOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : null}
            </button>
            {(group.label !== 'Content' || contentOpen) ? (
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={[
                          'flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors',
                          active
                            ? 'bg-[#f3f4f6] font-medium text-ink'
                            : 'text-[#4b5563] hover:bg-[#f8f9fa] hover:text-ink',
                        ].join(' ')}
                      >
                        <Icon size={16} strokeWidth={1.5} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {(item as any).badge ? (
                          <span className="rounded-full bg-[#f3f4f6] px-1.5 py-0.5 text-[11px] text-[#6b7280]">
                            {(item as any).badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        ))}
      </nav>

      <div className="border-t border-[#f1f1ef] p-3">
        <div className="mb-2 flex items-center gap-2.5 px-2">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#f3f4f6] text-xs font-medium text-ink">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              (user?.githubLogin ?? 'A').charAt(0).toUpperCase()
            )}
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-ink">{user?.githubLogin}</p>
            <p className="text-xs text-[#6b7280]">Administrator</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-[#4b5563] transition-colors hover:bg-[#f8f9fa] hover:text-ink"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <AppShell
      sidebar={sidebar}
      header={
        <>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="text-[#6b7280]"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-medium text-ink">Portfolio CMS</span>
        </>
      }
    >
      {menuOpen ? (
        <div
          className="fixed inset-0 z-20 bg-black/20 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      ) : null}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 w-[240px] bg-white transition-transform duration-300 lg:hidden',
          menuOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {sidebar}
      </aside>
      <Outlet />
    </AppShell>
  );
}
