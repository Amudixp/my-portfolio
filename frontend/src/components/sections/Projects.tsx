import { useState, useRef, useCallback } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects } from '../../data/projects';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import type { ProjectData } from '../../types';

interface ColumnProps {
  project: ProjectData;
  isSmallScreen: boolean;
  priority?: boolean;
}

const TextColumn = ({ project, isSmallScreen }: ColumnProps) => {
  const titleSize = isSmallScreen ? 'clamp(24px, 5vw, 32px)' : '42px';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: isSmallScreen ? '0px' : '20px' }}>
      <div>
        <span style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.4px', color: 'var(--accent-green)', display: 'block', marginBottom: '6px', fontFamily: 'Inter, sans-serif' }}>
          {project.subtitle}
        </span>
        <h3 style={{ fontSize: titleSize, fontWeight: '500', color: 'var(--accent-green)', margin: 0, lineHeight: '1.15', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em' }}>
          {project.title}
        </h3>
      </div>

      <p style={{ fontSize: isSmallScreen ? '14px' : '16px', fontWeight: '400', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.7', letterSpacing: '0.2px' }}>
        {project.fullDescription || project.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
        {project.tech.map((tech) => (
          <span
            key={tech}
            style={{
              fontSize: '12px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--surface-pill)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '6px 14px',
              whiteSpace: 'nowrap',
            }}>
            {tech}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        {project.metrics.map((metric, midx) => (
          <div key={midx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
            <div style={{ fontSize: isSmallScreen ? '24px' : '32px', fontWeight: '500', color: 'var(--accent-green)', lineHeight: '1', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em' }}>
              {metric.value}
            </div>
            <div style={{ fontSize: '10px', fontWeight: '500', letterSpacing: '0.2px', color: 'var(--text-secondary)' }}>
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ImageColumn = ({ project, isSmallScreen }: ColumnProps) => {
  const image = (
    <img
      src={project.image}
      alt={project.title}
      width={1280}
      height={720}
      loading="lazy"
      decoding="async"
      className={`w-full h-full object-cover transition-transform duration-500 ease-out ${project.link ? 'group-hover:scale-105' : ''}`}
      style={{ backgroundColor: 'var(--surface-dark)' }}
    />
  );

  const cardStyle = {
    width: '100%',
    height: isSmallScreen ? '220px' : '340px',
    aspectRatio: '16 / 9',
    backgroundColor: 'var(--surface-dark)',
    display: 'flex',
    willChange: 'transform',
  } as const;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
      {project.link ? (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-2xl flex items-center justify-center border border-[#E3E3E0]"
          style={cardStyle}
        >
          {image}
          <div className="absolute inset-0 bg-[rgba(28,42,7,0.4)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none z-10" />
          <div className="absolute top-4 right-4 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out drop-shadow-lg z-20" style={{ color: 'var(--accent-lime)' }}>
            <ExternalLink size={26} strokeWidth={2.5} />
          </div>
        </a>
      ) : (
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border border-[#E3E3E0]"
          style={cardStyle}
          aria-label={`${project.title} preview — Confidential Project`}
        >
          {image}
          <span style={{ position: 'absolute', right: '14px', bottom: '14px', padding: '6px 10px', borderRadius: '999px', backgroundColor: 'rgba(28,42,7,0.72)', border: '1px solid rgba(226, 250, 106, 0.35)', color: '#E2FA6A', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.2px' }}>
            Confidential Project
          </span>
        </div>
      )}
    </div>
  );
};

export const Projects = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isSmallScreen = useMediaQuery('(max-width: 1023px)');
  const isScrollingRef = useRef(false);
  const scrollRafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (scrollRafRef.current !== null) return;
    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;
      if (!scrollContainerRef.current || isScrollingRef.current) return;

      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const containerWidth = scrollContainerRef.current.clientWidth;
      if (containerWidth === 0) return;

      const currentSlide = Math.round(scrollLeft / containerWidth);
      const clampedSlide = Math.max(0, Math.min(currentSlide, projects.length - 1));

      setActiveSlide((prev) => (prev !== clampedSlide ? clampedSlide : prev));
    });
  }, []);

  const scrollToSlide = (index: number) => {
    const targetIndex = Math.max(0, Math.min(index, projects.length - 1));
    if (scrollContainerRef.current) {
      isScrollingRef.current = true;
      const containerWidth = scrollContainerRef.current.clientWidth;

      setActiveSlide(targetIndex);

      scrollContainerRef.current.scrollTo({
        left: targetIndex * containerWidth,
        behavior: 'smooth',
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
  const minHeight = isSmallScreen ? '350px' : '480px';

  // Pagination geometry — kept fluid so the control row never overflows on phones.
  const slotSize = isSmallScreen ? 36 : 42;
  const dotGap = isSmallScreen ? 6 : 8;
  const slotStep = slotSize + dotGap;
  const VISIBLE = 5;
  const dotsContainerWidth = VISIBLE * slotSize + (VISIBLE - 1) * dotGap;
  const trackOffset = (2 - activeSlide) * slotStep;

  return (
    <section id="projects" style={{ padding: sectionPadding, backgroundColor: 'var(--bg-page)', minHeight: 'auto', transition: 'background-color 0.3s ease' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Section Header */}
        <div style={{ marginBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--accent-green)', letterSpacing: '0.3px', fontFamily: 'Inter, sans-serif' }}>
              PORTFOLIO SHOWCASE
            </span>
            <h2 style={{ fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px', fontWeight: '500', color: 'var(--text-primary)', margin: '6px 0 0 0', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em' }}>
              Featured Projects.
            </h2>
            <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--accent-green)', borderRadius: '2px', marginTop: '12px' }} />
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
                margin: 0,
              }}>
              {isSmallScreen || idx % 2 === 0 ? (
                <>
                  <TextColumn project={project} isSmallScreen={isSmallScreen} />
                  <ImageColumn project={project} isSmallScreen={isSmallScreen} />
                </>
              ) : (
                <>
                  <ImageColumn project={project} isSmallScreen={isSmallScreen} />
                  <TextColumn project={project} isSmallScreen={isSmallScreen} />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Navigation: Prev + Pagination Dots + Next */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap: '16px',
          rowGap: '14px',
          marginTop: '32px',
        }}>
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={activeSlide === 0}
            aria-label="Previous project"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              color: activeSlide === 0 ? 'var(--border-subtle)' : 'var(--text-primary)',
              cursor: activeSlide === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              opacity: activeSlide === 0 ? 0.35 : 1,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (activeSlide !== 0) {
                e.currentTarget.style.backgroundColor = 'var(--accent-green)';
                e.currentTarget.style.color = '#FFFFFF';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSlide !== 0) {
                e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Pagination: fixed number badge over a sliding dot track */}
          <div
            role="tablist"
            aria-label="Project slides"
            style={{
              position: 'relative',
              width: `${dotsContainerWidth}px`,
              maxWidth: '100%',
              height: `${slotSize}px`,
              overflow: 'hidden',
              maskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
            }}
          >
            {/* Sliding dot track */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'flex',
                gap: `${dotGap}px`,
                transform: `translateX(${trackOffset}px)`,
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                willChange: 'transform',
              }}
            >
              {projects.map((project, idx) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={activeSlide === idx}
                  aria-label={`Go to project ${idx + 1}: ${project.title}`}
                  onClick={() => scrollToSlide(idx)}
                  style={{
                    width: `${slotSize}px`,
                    height: `${slotSize}px`,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(17, 17, 17, 0.25)',
                      transition: 'background-color 0.3s ease',
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Fixed badge — always at center slot (slot index 2) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: `${2 * slotStep}px`,
                width: `${slotSize}px`,
                height: `${slotSize}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: `${slotSize}px`,
                  height: `${slotSize}px`,
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-green)',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 500,
                  fontFamily: 'Inter Tight, sans-serif',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  boxShadow: '0 2px 14px rgba(59, 82, 23, 0.45)',
                }}
              >
                {activeSlide + 1}
              </span>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={activeSlide === projects.length - 1}
            aria-label="Next project"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              color: activeSlide === projects.length - 1 ? 'var(--border-subtle)' : 'var(--text-primary)',
              cursor: activeSlide === projects.length - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              opacity: activeSlide === projects.length - 1 ? 0.35 : 1,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (activeSlide !== projects.length - 1) {
                e.currentTarget.style.backgroundColor = 'var(--accent-green)';
                e.currentTarget.style.color = '#FFFFFF';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSlide !== projects.length - 1) {
                e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

      </div>
    </section>
  );
};
