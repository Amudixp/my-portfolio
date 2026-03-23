import { useState, useEffect } from 'react';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#education' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when clicking on a link
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed',
      width: isSmallScreen ? '100%' : isScrolled ? 'calc(100% - 60px)' : '100%',
      top: isSmallScreen ? '0' : isScrolled ? '20px' : '0',
      left: isSmallScreen ? '0' : isScrolled ? '30px' : '0',
      right: isSmallScreen ? '0' : isScrolled ? '30px' : 'auto',
      zIndex: 9999,
      backgroundColor: isSmallScreen ? '#000000' : isScrolled ? '#000000' : 'rgba(0, 0, 0, 0)',
      backdropFilter: isSmallScreen ? 'none' : isScrolled ? 'blur(10px)' : 'none',
      borderRadius: isSmallScreen ? '0px' : isScrolled ? '12px' : '0px',
      border: isSmallScreen ? 'none' : isScrolled ? '1px solid rgba(234, 179, 8, 0.3)' : 'none',
      boxShadow: isSmallScreen ? 'none' : isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.8)' : 'none',
      padding: isSmallScreen ? '20px' : isScrolled ? '15px 30px' : '25px 30px',
      transition: 'all 0.3s ease',
      willChange: 'background-color'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="#" style={{ fontSize: isSmallScreen ? '20px' : '24px', fontWeight: 'bold', color: '#EAB308', textDecoration: 'none', flexShrink: 0 }}>
          AP.
        </a>

        {/* Desktop Nav Links - Centered */}
        {!isSmallScreen && (
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                style={{ 
                  color: '#FFFFFF', 
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = '#EAB308'}
                onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = '#FFFFFF'}
              >
                {link.name}
              </a>
            ))}
          </div>
        )}

        {/* Desktop Contact Button */}
        {!isSmallScreen && (
          <div style={{ flexShrink: 0 }}>
            <a 
              href="#contact" 
              style={{ 
                backgroundColor: '#EAB308', 
                color: '#000000', 
                padding: '10px 20px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '13px',
                transition: 'all 0.2s',
                cursor: 'pointer',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 16px rgba(234, 179, 8, 0.5)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              }}
            >
              Contact
            </a>
          </div>
        )}

        {/* Mobile Hamburger Menu */}
        {isSmallScreen && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            title={isOpen ? "Close menu" : "Open menu"}
            style={{
              background: 'none',
              border: 'none',
              color: '#EAB308',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5'
            }}>
            <div style={{ width: '24px', height: '3px', backgroundColor: '#EAB308', transition: 'all 0.3s', transform: isOpen ? 'rotate(45deg) translateY(10px)' : 'rotate(0)' }} />
            <div style={{ width: '24px', height: '3px', backgroundColor: '#EAB308', opacity: isOpen ? 0 : 1, transition: 'all 0.3s' }} />
            <div style={{ width: '24px', height: '3px', backgroundColor: '#EAB308', transition: 'all 0.3s', transform: isOpen ? 'rotate(-45deg) translateY(-10px)' : 'rotate(0)' }} />
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isSmallScreen && isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          backgroundColor: '#111111',
          borderTop: '1px solid rgba(234, 179, 8, 0.3)',
          padding: '20px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginTop: isScrolled ? '10px' : '20px',
          animation: 'slideDown 0.3s ease'
        }}>
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              style={{
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                padding: '10px 0',
                borderBottom: '1px solid rgba(234, 179, 8, 0.1)',
                transition: 'color 0.2s',
                display: 'block'
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.color = '#EAB308'}
              onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.color = '#FFFFFF'}
              onClick={handleLinkClick}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            style={{
              backgroundColor: '#EAB308',
              color: '#000000',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '13px',
              textAlign: 'center',
              marginTop: '10px',
              cursor: 'pointer',
              display: 'block'
            }}
            onClick={handleLinkClick}
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};