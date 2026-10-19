import { useEffect, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useTheme } from '../../context/ThemeContext';
import sidebarProfile from '../../assets/images/sidebar-profile.webp';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#education' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#hero');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const sectionIds = ['hero', 'about', 'experience', 'projects', 'education', 'contact'];
    const visible = new Set<string>();
    const observed = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) {
            visible.add(id);
          } else {
            visible.delete(id);
          }
        });

        const current = sectionIds.find((id) => visible.has(id));
        if (current) setActiveSection(`#${current}`);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    const observeSections = () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element && !observed.has(element)) {
          observed.add(element);
          observer.observe(element);
        }
      });
    };

    observeSections();

    const mutationObserver = new MutationObserver(() => observeSections());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  const showSidebar = activeSection !== '#hero';

  const isActiveLink = (href: string) => activeSection === href;

  if (isDesktop) {
    return (
      <>
        {/* Text-Only Vertical Section Navigation (Hidden on Hero, Appears on Scroll) */}
        <nav
          aria-label="Section navigation"
          style={{
            position: 'fixed',
            top: '50%',
            left: '28px',
            transform: showSidebar ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(-24px)',
            opacity: showSidebar ? 1 : 0,
            visibility: showSidebar ? 'visible' : 'hidden',
            pointerEvents: 'none',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '16px',
            background: 'transparent',
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            padding: 0,
            margin: 0,
            transition: 'opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), transform 300ms cubic-bezier(0.16, 1, 0.3, 1), visibility 300ms ease'
          }}
        >
          {navLinks.map((link) => {
            const active = isActiveLink(link.href);

            return (
              <a
                key={link.name}
                href={link.href}
                aria-label={link.name}
                aria-current={active ? 'location' : undefined}
                className={`sidebar-nav-link ${active ? 'sidebar-nav-link--active' : 'sidebar-nav-link--inactive'}`}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: '20px',
                  textDecoration: 'none',
                  padding: '4px 0',
                  paddingLeft: '14px',
                  cursor: showSidebar ? 'pointer' : 'default',
                  pointerEvents: showSidebar ? 'auto' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {link.name}
              </a>
            );
          })}
        </nav>
      </>
    );
  }

  // Mobile Top Navbar & Drawer
  return (
    <>
      <nav
      aria-label="Mobile navigation"
      style={{
        position: 'fixed',
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 9999,
        backgroundColor: isLight ? 'var(--surface-glass-light)' : 'var(--surface-glass-light)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 18px',
        boxSizing: 'border-box',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="#hero" aria-label="Back to top" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src={sidebarProfile}
            alt="Amudi Purba"
            style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border-subtle)', objectFit: 'cover', objectPosition: '50% 38%' }}
          />
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          {/* Mobile Hamburger Menu Toggle (min 44x44px touch target) */}
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <div style={{ width: '22px', height: '2px', backgroundColor: 'var(--accent-green)', transition: 'all 0.3s', transform: isOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <div style={{ width: '22px', height: '2px', backgroundColor: 'var(--accent-green)', opacity: isOpen ? 0 : 1, margin: '5px 0', transition: 'all 0.3s' }} />
            <div style={{ width: '22px', height: '2px', backgroundColor: 'var(--accent-green)', transition: 'all 0.3s', transform: isOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div style={{
          backgroundColor: isLight ? 'var(--bg-page-light)' : 'var(--bg-page-light)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '16px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          marginTop: '12px'
        }}>
          {navLinks.map((link) => {
            const active = isActiveLink(link.href);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '44px',
                  color: isLight ? 'var(--text-primary)' : 'var(--text-primary)',
                  opacity: active ? 1 : 0.55,
                  textDecoration: 'none',
                  fontSize: '19px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: active ? 600 : 500,
                  padding: '6px 12px',
                  paddingLeft: active ? '16px' : '12px',
                  transition: 'all 200ms ease'
                }}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: '0',
                      width: '3px',
                      height: '18px',
                      borderRadius: '2px',
                      backgroundColor: 'var(--accent-green)'
                    }}
                  />
                )}
                {link.name}
              </a>
            );
          })}
        </div>
      )}
    </nav>
    </>
  );
};
