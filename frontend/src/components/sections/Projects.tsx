import { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects } from '../../data/projects';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import type { ProjectData } from '../../types';

interface ColumnProps {
  project: ProjectData;
  isSmallScreen: boolean;
  priority?: boolean;
}

/** Mobile line budget — fixed heights are derived from these so every slide
 *  reserves the exact same vertical space and the image always starts at the
 *  same y. Desktop ignores them entirely. */
const TITLE_LINES = 2;
const DESC_LINES = 5;
const TAG_ROWS = 2;
const DESC_LINE_HEIGHT = 1.7;
const TITLE_LINE_HEIGHT = 1.15;

/** Measures whether a clamped element overflows its visible box. Re-runs on
 *  resize (ResizeObserver) and once web fonts finish loading, since both can
 *  change the number of wrapped lines. */
function useOverflow(ref: React.RefObject<HTMLElement | null>, deps: unknown[]) {
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      setOverflowing(el.scrollHeight - el.clientHeight > 1);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return overflowing;
}

const TextColumn = ({ project, isSmallScreen, expanded, onToggleExpand }: ColumnProps & { expanded?: boolean; onToggleExpand?: () => void }) => {
  const titleSize = isSmallScreen ? 'clamp(22px, 6vw, 32px)' : '42px';
  const descRef = useRef<HTMLParagraphElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const descOverflows = useOverflow(descRef, [project.id, isSmallScreen, expanded]);
  const tagsOverflow = useOverflow(tagsRef, [project.id, isSmallScreen]);

  const descText = project.fullDescription || project.description;

  // ── Desktop: unchanged — renders every field at natural height. ──
  if (!isSmallScreen) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '20px', minWidth: 0, width: '100%' }}>
        <div style={{ minWidth: 0 }}>
          <span style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.4px', color: 'var(--accent-green)', display: 'block', marginBottom: '6px', fontFamily: 'Inter, sans-serif', overflowWrap: 'anywhere' }}>
            {project.subtitle}
          </span>
          <h3 style={{ fontSize: titleSize, fontWeight: '500', color: 'var(--accent-green)', margin: 0, lineHeight: String(TITLE_LINE_HEIGHT), fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em', overflowWrap: 'anywhere' }}>
            {project.title}
          </h3>
        </div>

        <p style={{ fontSize: '16px', fontWeight: '400', color: 'var(--text-secondary)', margin: 0, lineHeight: String(DESC_LINE_HEIGHT), letterSpacing: '0.2px', overflowWrap: 'anywhere', minWidth: 0 }}>
          {descText}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', minWidth: 0 }}>
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
                maxWidth: '100%',
                overflowWrap: 'anywhere',
              }}>
              {tech}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', minWidth: 0 }}>
          {project.metrics.map((metric, midx) => (
            <div key={midx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
              <div style={{ fontSize: '32px', fontWeight: '500', color: 'var(--accent-green)', lineHeight: '1', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em', overflowWrap: 'anywhere' }}>
                {metric.value}
              </div>
              <div style={{ fontSize: '10px', fontWeight: '500', letterSpacing: '0.2px', color: 'var(--text-secondary)', overflowWrap: 'anywhere' }}>
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Mobile: fixed-height zones so the image always starts at the same y. ──
  const titleClamp = {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical' as const,
    WebkitLineClamp: TITLE_LINES,
    overflow: 'hidden',
  };
  const descClamp = expanded
    ? {}
    : {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical' as const,
        WebkitLineClamp: DESC_LINES,
        overflow: 'hidden',
      };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '0px', minWidth: 0, width: '100%' }}>
      <div style={{ minWidth: 0 }}>
        <span style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.4px', color: 'var(--accent-green)', display: 'block', marginBottom: '6px', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {project.subtitle}
        </span>
        <h3 style={{ fontSize: titleSize, fontWeight: '500', color: 'var(--accent-green)', margin: 0, lineHeight: String(TITLE_LINE_HEIGHT), fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em', overflowWrap: 'anywhere', minHeight: `${TITLE_LINES * TITLE_LINE_HEIGHT}em`, ...titleClamp }}>
          {project.title}
        </h3>
      </div>

      <div style={{ minWidth: 0 }}>
        <p
          id={`project-desc-${project.id}`}
          ref={descRef}
          style={{ fontSize: '14px', fontWeight: '400', color: 'var(--text-secondary)', margin: 0, lineHeight: String(DESC_LINE_HEIGHT), letterSpacing: '0.2px', overflowWrap: 'anywhere', minWidth: 0, minHeight: expanded ? undefined : `${DESC_LINES * DESC_LINE_HEIGHT}em`, ...descClamp }}>
          {descText}
        </p>
        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={expanded}
          aria-controls={`project-desc-${project.id}`}
          style={{
            marginTop: '4px',
            padding: '10px 0',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--accent-green)',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.2px',
            visibility: descOverflows || expanded ? 'visible' : 'hidden',
          }}>
          {expanded ? 'Show less' : 'Show more'}
        </button>
      </div>

      <div ref={tagsRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', minWidth: 0, minHeight: `calc(${TAG_ROWS} * (12px * 1.2 + 12px) + ${TAG_ROWS - 1} * 8px)`, maxHeight: `calc(${TAG_ROWS} * (12px * 1.2 + 12px) + ${TAG_ROWS - 1} * 8px)`, overflow: 'hidden', alignContent: 'flex-start' }}>
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
              maxWidth: '100%',
              overflowWrap: 'anywhere',
              lineHeight: 1.2,
              height: 'fit-content',
            }}>
            {tech}
          </span>
        ))}
        {tagsOverflow && (
          <span
            aria-hidden="true"
            style={{
              fontSize: '12px',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--surface-pill)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '6px 14px',
              lineHeight: 1.2,
              height: 'fit-content',
            }}>
            +more
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '20px', marginTop: '4px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', minWidth: 0, height: 'calc(16px + 3.1em)', overflow: 'hidden' }}>
        {project.metrics.map((metric, midx) => (
          <div key={midx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, flex: '1 1 0' }}>
            <div style={{ fontSize: '24px', fontWeight: '500', color: 'var(--accent-green)', lineHeight: '1', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {metric.value}
            </div>
            <div style={{ fontSize: '10px', fontWeight: '500', letterSpacing: '0.2px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ImageColumn = ({ project, isSmallScreen }: ColumnProps) => {
  const objectPosition = project.objectPosition || 'center';
  const image = (
    <img
      src={project.image}
      alt={project.title}
      width={1280}
      height={720}
      loading="lazy"
      decoding="async"
      className={`w-full h-full transition-transform duration-500 ease-out ${project.link ? 'group-hover:scale-105' : ''}`}
      style={{ objectFit: 'cover', objectPosition, backgroundColor: 'var(--surface-dark)' }}
    />
  );

  const cardStyle = isSmallScreen
    ? {
        width: '100%',
        maxWidth: '100%',
        aspectRatio: 'var(--project-media-ratio, 16 / 9)',
        backgroundColor: 'var(--surface-dark)',
        display: 'flex',
        willChange: 'transform',
      }
    : {
        width: '100%',
        maxWidth: '100%',
        height: '340px',
        aspectRatio: '16 / 9',
        backgroundColor: 'var(--surface-dark)',
        display: 'flex',
        willChange: 'transform',
      };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: isSmallScreen ? 'auto' : '100%', width: '100%', minWidth: 0 }}>
      {project.link ? (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center border border-[#E3E3E0] ${isSmallScreen ? 'shadow-md' : 'shadow-2xl'}`}
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
          className={`relative rounded-2xl overflow-hidden flex items-center justify-center border border-[#E3E3E0] ${isSmallScreen ? 'shadow-md' : 'shadow-2xl'}`}
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
  // Only one slide can be expanded at a time; reset whenever the slide changes.
  const [expandedSlide, setExpandedSlide] = useState<number | null>(null);
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

      setActiveSlide((prev) => {
        if (prev !== clampedSlide) {
          // Collapse any expanded description so the carousel height stays uniform.
          setExpandedSlide(null);
          return clampedSlide;
        }
        return prev;
      });
    });
  }, []);

  const scrollToSlide = (index: number) => {
    const targetIndex = Math.max(0, Math.min(index, projects.length - 1));
    if (scrollContainerRef.current) {
      isScrollingRef.current = true;
      const containerWidth = scrollContainerRef.current.clientWidth;

      setActiveSlide(targetIndex);
      setExpandedSlide(null);

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

  const sectionPadding = isSmallScreen
    ? 'var(--section-gap) 16px var(--section-gap) 16px'
    : 'var(--section-gap) 40px 80px 40px';
  const slideMinHeight = '480px';

  // Pagination geometry — kept fluid so the control row never overflows on phones.
  const slotSize = isSmallScreen ? 36 : 42;
  const dotGap = isSmallScreen ? 6 : 8;
  const slotStep = slotSize + dotGap;
  const VISIBLE = 5;
  const dotsContainerWidth = VISIBLE * slotSize + (VISIBLE - 1) * dotGap;
  const trackOffset = (2 - activeSlide) * slotStep;

  return (
    <section id="projects" style={{ padding: sectionPadding, backgroundColor: 'var(--bg-page)', minHeight: 'auto', transition: 'background-color 0.3s ease' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', minWidth: 0 }}>

        {/* Section Header */}
        <div style={{ marginBottom: isSmallScreen ? '24px' : '40px' }}>
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
            paddingBottom: isSmallScreen ? '0px' : '20px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
          }}>
          {projects.map((project, idx) => (
            <div
              key={project.id}
              style={{
                flex: '0 0 100%',
                display: 'grid',
                gridTemplateColumns: isSmallScreen ? 'minmax(0, 1fr)' : 'minmax(0, 1.2fr) minmax(0, 1fr)',
                gap: isSmallScreen ? '18px' : '50px',
                alignItems: isSmallScreen ? 'start' : 'center',
                minHeight: isSmallScreen ? '0px' : slideMinHeight,
                scrollSnapAlign: 'start',
                padding: isSmallScreen ? '0 10px' : '0 20px',
                boxSizing: 'border-box',
                margin: 0,
                minWidth: 0,
                maxWidth: '100%',
                width: '100%',
              }}>
              {isSmallScreen || idx % 2 === 0 ? (
                <>
                  <TextColumn
                    project={project}
                    isSmallScreen={isSmallScreen}
                    expanded={expandedSlide === project.id}
                    onToggleExpand={() => setExpandedSlide((prev) => (prev === project.id ? null : project.id))}
                  />
                  <ImageColumn project={project} isSmallScreen={isSmallScreen} />
                </>
              ) : (
                <>
                  <ImageColumn project={project} isSmallScreen={isSmallScreen} />
                  <TextColumn
                    project={project}
                    isSmallScreen={isSmallScreen}
                    expanded={expandedSlide === project.id}
                    onToggleExpand={() => setExpandedSlide((prev) => (prev === project.id ? null : project.id))}
                  />
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
          marginTop: isSmallScreen ? '14px' : '32px',
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
