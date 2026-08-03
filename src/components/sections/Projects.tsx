import { useState, useRef, useCallback } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects } from '../../data/projects';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useTheme } from '../../context/ThemeContext';

export const Projects = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isSmallScreen = useMediaQuery('(max-width: 1023px)');
  const isScrollingRef = useRef(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isScrollingRef.current) return;
    
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const containerWidth = scrollContainerRef.current.clientWidth;
    if (containerWidth === 0) return;
    
    const currentSlide = Math.round(scrollLeft / containerWidth);
    const clampedSlide = Math.max(0, Math.min(currentSlide, projects.length - 1));
    
    setActiveSlide((prev) => (prev !== clampedSlide ? clampedSlide : prev));
  }, []);

  const scrollToSlide = (index: number) => {
    const targetIndex = Math.max(0, Math.min(index, projects.length - 1));
    if (scrollContainerRef.current) {
      isScrollingRef.current = true;
      const containerWidth = scrollContainerRef.current.clientWidth;
      
      setActiveSlide(targetIndex);
      
      scrollContainerRef.current.scrollTo({
        left: targetIndex * containerWidth,
        behavior: 'smooth'
      });

      // Release scrolling flag after smooth scroll completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 400);
    }
  };

  const handlePrev = () => {
    if (activeSlide > 0) {
      scrollToSlide(activeSlide - 1);
    }
  };

  const handleNext = () => {
    if (activeSlide < projects.length - 1) {
      scrollToSlide(activeSlide + 1);
    }
  };

  const sectionPadding = isSmallScreen ? '50px 16px' : '80px 40px';
  const titleSize = isSmallScreen ? 'clamp(24px, 5vw, 32px)' : '42px';
  const minHeight = isSmallScreen ? '350px' : '480px';

  const TextColumn = ({ project }: { project: typeof projects[number] }) => (
    <div
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '14px',
        paddingLeft: isSmallScreen ? '0px' : '20px'
      }}>
      
      <div>
        <span style={{
          fontSize: '11px',
          fontWeight: '800',
          letterSpacing: '2.5px',
          color: isLight ? '#D97706' : '#EAB308',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '6px',
          fontFamily: 'monospace'
        }}>
          {project.subtitle}
        </span>
        <h3 style={{
          fontSize: titleSize,
          fontWeight: '900',
          color: isLight ? '#D97706' : '#EAB308',
          margin: 0,
          lineHeight: '1.15',
          fontFamily: 'Poppins, sans-serif'
        }}>
          {project.title}
        </h3>
      </div>

      <p style={{
        fontSize: isSmallScreen ? '14px' : '16px',
        fontWeight: '400',
        color: isLight ? '#334155' : '#D1D5DB',
        margin: 0,
        lineHeight: '1.7',
        letterSpacing: '0.2px'
      }}>
        {project.fullDescription || project.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
        {project.tech.map((tech) => (
          <span
            key={tech}
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: isLight ? '#0F172A' : '#FFFFFF',
              backgroundColor: isLight ? '#F1F5F9' : 'rgba(17, 17, 17, 0.6)',
              border: isLight ? '1px solid #CBD5E1' : '1px solid #444444',
              borderRadius: '20px',
              padding: '6px 14px',
              whiteSpace: 'nowrap'
            }}>
            {tech}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '32px', marginTop: '12px', borderTop: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
        {project.metrics.map((metric, midx) => (
          <div key={midx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{
              fontSize: isSmallScreen ? '24px' : '32px',
              fontWeight: '900',
              color: isLight ? '#0F172A' : '#FFFFFF',
              lineHeight: '1',
              fontFamily: 'Poppins, sans-serif'
            }}>
              {metric.value}
            </div>
            <div style={{
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '1.2px',
              color: isLight ? '#64748B' : '#9CA3AF',
              textTransform: 'uppercase'
            }}>
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ImageColumn = ({ project }: { project: typeof projects[number] }) => {
    const image = (
      <img
        src={project.image}
        alt={project.title}
        loading="eager"
        className={`w-full h-full object-cover transition-transform duration-500 ease-out ${project.link ? 'group-hover:scale-105' : ''}`}
        style={{ backgroundColor: '#0a0a0a' }}
      />
    );

    const cardStyle = {
      width: '100%',
      height: isSmallScreen ? '220px' : '340px',
      aspectRatio: '16 / 9',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      willChange: 'transform'
    } as const;

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-2xl flex items-center justify-center border border-neutral-800"
            style={cardStyle}
          >
            {image}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none z-10" />
            <div className="absolute top-4 right-4 text-yellow-500 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out drop-shadow-lg z-20" style={{ color: '#EAB308' }}>
              <ExternalLink size={26} strokeWidth={2.5} />
            </div>
          </a>
        ) : (
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border border-neutral-800"
            style={cardStyle}
            aria-label={`${project.title} preview — Confidential Project`}
          >
            {image}
            <span style={{ position: 'absolute', right: '14px', bottom: '14px', padding: '6px 10px', borderRadius: '999px', backgroundColor: 'rgba(0,0,0,0.72)', border: '1px solid rgba(234,179,8,0.35)', color: '#FDE047', fontFamily: 'monospace', fontSize: '10px', fontWeight: 800, letterSpacing: '0.8px' }}>
              Confidential Project
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="projects" style={{ padding: sectionPadding, backgroundColor: isLight ? '#F8FAFC' : '#000000', minHeight: 'auto', transition: 'background-color 0.3s ease' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Section Header with Navigation Controls */}
        <div style={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isSmallScreen ? 'center' : 'flex-end',
          marginBottom: '40px',
          gap: '20px'
        }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: isLight ? '#D97706' : '#EAB308', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              PORTFOLIO SHOWCASE
            </span>
            <h2 style={{ fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px', fontWeight: '900', color: isLight ? '#0F172A' : '#FFFFFF', margin: '6px 0 0 0', fontFamily: 'Poppins, sans-serif' }}>
              Featured Projects.
            </h2>
            <div style={{ width: '80px', height: '4px', backgroundColor: isLight ? '#D97706' : '#EAB308', borderRadius: '2px', marginTop: '12px' }} />
          </div>

          {/* Navigation Control Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handlePrev}
              disabled={activeSlide === 0}
              aria-label="Previous project"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: isLight ? '#FFFFFF' : '#111111',
                border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(234, 179, 8, 0.3)',
                color: activeSlide === 0 ? (isLight ? '#CBD5E1' : '#444444') : (isLight ? '#0F172A' : '#FFFFFF'),
                cursor: activeSlide === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                opacity: activeSlide === 0 ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (activeSlide > 0) {
                  e.currentTarget.style.backgroundColor = isLight ? '#D97706' : '#EAB308';
                  e.currentTarget.style.color = isLight ? '#FFFFFF' : '#000000';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSlide > 0) {
                  e.currentTarget.style.backgroundColor = isLight ? '#FFFFFF' : '#111111';
                  e.currentTarget.style.color = isLight ? '#0F172A' : '#FFFFFF';
                }
              }}>
              <ChevronLeft size={22} />
            </button>

            <span style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: '800', color: isLight ? '#D97706' : '#EAB308' }}>
              {String(activeSlide + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>

            <button
              onClick={handleNext}
              disabled={activeSlide === projects.length - 1}
              aria-label="Next project"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: isLight ? '#FFFFFF' : '#111111',
                border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(234, 179, 8, 0.3)',
                color: activeSlide === projects.length - 1 ? (isLight ? '#CBD5E1' : '#444444') : (isLight ? '#0F172A' : '#FFFFFF'),
                cursor: activeSlide === projects.length - 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                opacity: activeSlide === projects.length - 1 ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (activeSlide < projects.length - 1) {
                  e.currentTarget.style.backgroundColor = isLight ? '#D97706' : '#EAB308';
                  e.currentTarget.style.color = isLight ? '#FFFFFF' : '#000000';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSlide < projects.length - 1) {
                  e.currentTarget.style.backgroundColor = isLight ? '#FFFFFF' : '#111111';
                  e.currentTarget.style.color = isLight ? '#0F172A' : '#FFFFFF';
                }
              }}>
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Scrollable Carousel Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            gap: '0',
            paddingBottom: '20px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            willChange: 'scroll-position'
          }}>
          {projects.map((project, idx) => (
            <div
              key={project.id}
              style={{
                flex: '0 0 100%',
                display: 'grid',
                gridTemplateColumns: isSmallScreen ? '1fr' : '1.2fr 1fr',
                gap: isSmallScreen ? '30px' : '50px',
                alignItems: 'center',
                minHeight: minHeight,
                scrollSnapAlign: 'start',
                padding: isSmallScreen ? '0 10px' : '0 20px',
                boxSizing: 'border-box',
                margin: 0
              }}>
              {isSmallScreen ? (
                <>
                  <TextColumn project={project} />
                  <ImageColumn project={project} />
                </>
              ) : idx % 2 === 0 ? (
                <>
                  <TextColumn project={project} />
                  <ImageColumn project={project} />
                </>
              ) : (
                <>
                  <ImageColumn project={project} />
                  <TextColumn project={project} />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Pagination Dots Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '20px'
        }} role="tablist" aria-label="Project slides">
          {projects.map((project, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={activeSlide === idx}
              aria-label={`Go to project ${idx + 1}: ${project.title}`}
              onClick={() => scrollToSlide(idx)}
              style={{
                width: activeSlide === idx ? '32px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: activeSlide === idx ? '#EAB308' : '#333333',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
