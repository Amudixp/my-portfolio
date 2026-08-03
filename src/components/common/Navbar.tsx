import { useEffect, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { User, Briefcase, FolderGit2, GraduationCap, Send, Sun, Moon } from 'lucide-react';
import { profile } from '../../data/profile';
import { useTheme } from '../../context/ThemeContext';
import sidebarProfile from '../../assets/images/sidebar-profile.jpeg';

const navLinks = [
  { name: 'About', href: '#about', icon: User },
  { name: 'Experience', href: '#experience', icon: Briefcase },
  { name: 'Projects', href: '#projects', icon: FolderGit2 },
  { name: 'Certifications', href: '#education', icon: GraduationCap },
  { name: 'Contact', href: '#contact', icon: Send },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSidebarFocused, setIsSidebarFocused] = useState(false);
  const [activeSection, setActiveSection] = useState('#hero');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const isSidebarExpanded = isSidebarHovered || isSidebarFocused;

  useEffect(() => {
    const sectionIds = ['hero', 'about', 'experience', 'projects', 'education', 'contact'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(`#${id}`);
        },
        { threshold: 0.25 }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  const isActiveLink = (href: string) => activeSection === href;

  if (isDesktop) {
    return (
      <aside
        role="navigation"
        aria-label="Primary navigation"
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        onFocusCapture={() => setIsSidebarFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsSidebarFocused(false);
          }
        }}
        style={{
          position: 'fixed',
          top: '50%',
          left: '18px',
          transform: 'translateY(-50%)',
          width: isSidebarExpanded ? '168px' : '62px',
          padding: isSidebarExpanded ? '14px 12px' : '12px 9px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          backgroundColor: isLight ? '#FFFFFF' : '#0A0A0A',
          border: isLight ? '1px solid #E2E8F0' : '1px solid #27272A',
          borderRadius: '14px',
          boxShadow: isLight ? '0 10px 28px rgba(0, 0, 0, 0.08)' : '0 10px 28px rgba(0, 0, 0, 0.45)',
          boxSizing: 'border-box',
          overflow: 'hidden',
          transition: 'width 220ms ease, padding 220ms ease, background-color 0.3s ease, border-color 0.3s ease'
        }}
      >
        <a
          href="#hero"
          aria-label="Back to top"
          title="Back to top"
          style={{
            width: '100%',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
            paddingLeft: isSidebarExpanded ? '10px' : '0',
            gap: isSidebarExpanded ? '10px' : '0',
            color: '#EAB308',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '18px',
            fontWeight: 900,
            letterSpacing: '-1px',
            textDecoration: 'none'
          }}
        >
          <img
            src={sidebarProfile}
            alt=""
            style={{
              width: '34px',
              height: '34px',
              flexShrink: 0,
              borderRadius: '8px',
              border: '1px solid rgba(234, 179, 8, 0.55)',
              objectFit: 'cover',
              objectPosition: '50% 38%'
            }}
          />
          <span style={{
            maxWidth: isSidebarExpanded ? '100px' : '0',
            opacity: isSidebarExpanded ? 1 : 0,
            overflow: 'hidden',
            color: isLight ? '#0F172A' : '#F4F4F5',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: 0,
            whiteSpace: 'nowrap',
            transition: 'max-width 180ms ease, opacity 140ms ease'
          }}>
            {profile.name}
          </span>
        </a>

        <div style={{ width: '100%', height: '1px', margin: '8px 0 12px', backgroundColor: isLight ? '#E2E8F0' : '#27272A' }} />

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActiveLink(link.href);

            return (
              <a
                key={link.name}
                href={link.href}
                aria-label={link.name}
                aria-current={active ? 'page' : undefined}
                title={link.name}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
                  gap: isSidebarExpanded ? '11px' : '0',
                  padding: isSidebarExpanded ? '0 11px' : '0',
                  color: active ? (isLight ? '#D97706' : '#EAB308') : (isLight ? '#64748B' : '#A1A1AA'),
                  backgroundColor: active ? (isLight ? 'rgba(217, 119, 6, 0.1)' : 'rgba(234, 179, 8, 0.08)') : 'transparent',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'color 160ms ease, background-color 160ms ease'
                }}
                onMouseEnter={(event) => {
                  if (!active) {
                    event.currentTarget.style.color = isLight ? '#0F172A' : '#F4F4F5';
                    event.currentTarget.style.backgroundColor = isLight ? '#F1F5F9' : '#18181B';
                  }
                }}
                onMouseLeave={(event) => {
                  if (!active) {
                    event.currentTarget.style.color = isLight ? '#64748B' : '#A1A1AA';
                    event.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: isSidebarExpanded ? '-12px' : '-9px',
                      width: '2px',
                      height: '20px',
                      borderRadius: '0 2px 2px 0',
                      backgroundColor: isLight ? '#D97706' : '#EAB308'
                    }}
                  />
                )}
                <Icon size={19} strokeWidth={1.8} />
                <span style={{
                  maxWidth: isSidebarExpanded ? '100px' : '0',
                  opacity: isSidebarExpanded ? 1 : 0,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  fontSize: '12.5px',
                  fontWeight: active ? 700 : 500,
                  letterSpacing: '0.1px',
                  transition: 'max-width 180ms ease, opacity 140ms ease'
                }}>
                  {link.name}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
          title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
          style={{
            width: '100%',
            height: '38px',
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
            gap: isSidebarExpanded ? '11px' : '0',
            padding: isSidebarExpanded ? '0 11px' : '0',
            backgroundColor: isLight ? '#F1F5F9' : '#18181B',
            color: isLight ? '#D97706' : '#EAB308',
            border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}
        >
          {isLight ? <Moon size={18} strokeWidth={2} /> : <Sun size={18} strokeWidth={2} />}
          <span style={{
            maxWidth: isSidebarExpanded ? '100px' : '0',
            opacity: isSidebarExpanded ? 1 : 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            fontSize: '11.5px',
            fontWeight: 700,
            letterSpacing: '0.3px',
            transition: 'max-width 180ms ease, opacity 140ms ease'
          }}>
            {isLight ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>

      </aside>
    );
  }

  return (
    <nav
      role="navigation"
      aria-label="Mobile navigation"
      style={{
        position: 'fixed',
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 9999,
        backgroundColor: isLight ? '#FFFFFF' : '#000000',
        borderBottom: isLight ? '1px solid #E2E8F0' : '1px solid rgba(234, 179, 8, 0.3)',
        padding: '14px 20px',
        boxSizing: 'border-box',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="#hero" aria-label="Back to top" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src={sidebarProfile}
            alt=""
            style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.55)', objectFit: 'cover', objectPosition: '50% 38%' }}
          />
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
            title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: isLight ? '#F1F5F9' : '#111111',
              border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(234, 179, 8, 0.4)',
              color: isLight ? '#D97706' : '#EAB308',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            style={{ background: 'none', border: 'none', color: isLight ? '#D97706' : '#EAB308', padding: '4px' }}
          >
            <div style={{ width: '22px', height: '2px', backgroundColor: isLight ? '#D97706' : '#EAB308', transition: 'all 0.3s', transform: isOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <div style={{ width: '22px', height: '2px', backgroundColor: isLight ? '#D97706' : '#EAB308', opacity: isOpen ? 0 : 1, margin: '5px 0', transition: 'all 0.3s' }} />
            <div style={{ width: '22px', height: '2px', backgroundColor: isLight ? '#D97706' : '#EAB308', transition: 'all 0.3s', transform: isOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div style={{ backgroundColor: isLight ? '#F8FAFC' : '#111111', borderTop: isLight ? '1px solid #E2E8F0' : '1px solid rgba(234, 179, 8, 0.2)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', color: isActiveLink(link.href) ? (isLight ? '#D97706' : '#EAB308') : (isLight ? '#0F172A' : '#FFFFFF'), textDecoration: 'none', fontSize: '15px', fontWeight: 600, padding: '8px 0' }}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
};
