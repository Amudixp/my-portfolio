import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { projects } from '../../data/projects';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const Projects = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isSmallScreen = useMediaQuery('(max-width: 1023px)');



  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const containerWidth = scrollContainerRef.current.clientWidth;
      const currentSlide = Math.round(scrollLeft / containerWidth);
      
      // Set active slide without looping
      setActiveSlide(Math.min(currentSlide, projects.length - 1));
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: index * containerWidth,
        behavior: 'smooth'
      });
      setActiveSlide(index);
    }
  };

  const sectionPadding = isSmallScreen ? '50px 16px' : '80px 40px';
  const titleSize = isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px';
  const minHeight = isSmallScreen ? '350px' : '500px';

  // Function to render text column
  const TextColumn = ({ project, idx }: { project: typeof projects[number]; idx: number }) => (
    <motion.div
      initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        paddingLeft: isSmallScreen ? '0px' : '40px'
      }}>
      
      {/* Title Header */}
      <div>
        <div>
          <h3 style={{
            fontSize: titleSize,
            fontWeight: '900',
            color: '#EAB308',
            margin: 0,
            lineHeight: '1.1'
          }}>
            {project.title}
          </h3>
        </div>
        <p style={{
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '3px',
          color: '#EAB308',
          textTransform: 'uppercase',
          margin: 0,
          marginTop: '0'
        }}>
          {project.subtitle}
        </p>
      </div>

      {/* Description */}
      <p style={{
        fontSize: isSmallScreen ? '15px' : '17px',
        fontWeight: '500',
        color: '#D1D5DB',
        margin: 0,
        lineHeight: '1.7',
        letterSpacing: '0.3px'
      }}>
        {project.description}
      </p>

      {/* Tech Stack Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '4px' }}>
        {project.tech.map((tech) => (
          <span
            key={tech}
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#FFFFFF',
              backgroundColor: 'rgba(17, 17, 17, 0.6)',
              border: '1px solid #444444',
              borderRadius: '20px',
              padding: '7px 14px',
              whiteSpace: 'nowrap'
            }}>
            {tech}
          </span>
        ))}
      </div>

      {/* Metrics */}
      <div style={{ display: 'flex', gap: '40px', marginTop: '6px' }}>
        {project.metrics.map((metric, midx) => (
          <motion.div
            key={midx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: midx * 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{
              fontSize: isSmallScreen ? '32px' : '42px',
              fontWeight: '900',
              color: '#FFFFFF',
              lineHeight: '1'
            }}>
              {metric.value}
            </div>
            <div style={{
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              color: '#9CA3AF',
              textTransform: 'uppercase'
            }}>
              {metric.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // Function to render image column
  const ImageColumn = ({ project, idx }: { project: typeof projects[number]; idx: number }) => (
    <motion.div
      initial={{ opacity: 0, x: idx % 2 === 0 ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
      }}>
      {/* Zero-Crop Image Wrapper - Fixed size matching slide 2 */}
      <a 
        href={project.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative rounded-2xl overflow-hidden border border-neutral-800 cursor-pointer shadow-2xl flex items-center justify-center"
        style={{
          width: '100%',
          height: isSmallScreen ? '200px' : '320px',
          aspectRatio: '16 / 9',
          backgroundColor: '#0a0a0a',
          display: 'flex'
        }}>
        
        {/* Image - Using object-cover zooms image to fill container with uniform ratio */}
        <img 
          src={project.image} 
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          style={{
            backgroundColor: '#0a0a0a'
          }}
        />
        
        {/* Dark Overlay (Fades in on card hover) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none z-10"></div>
        
        {/* Corner External Link Icon (Appears in top-right on card hover) */}
        <div className="absolute top-4 right-4 text-yellow-500 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out drop-shadow-lg z-20" style={{ color: '#EAB308' }}>
          <ExternalLink size={28} strokeWidth={2.5} />
        </div>
      </a>
    </motion.div>
  );

  return (
    <section id="projects" style={{ padding: sectionPadding, backgroundColor: '#000000', minHeight: 'auto' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 20px 0', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
            Featured Projects.
          </h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: '#EAB308', borderRadius: '2px', margin: '0 auto' }} />
        </motion.div>

        {/* Scrollable Carousel Container - Bento Box Style */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            gap: '0',
            paddingBottom: '20px',
            marginTop: '0px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}>
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className="group"
              style={{
                flex: '0 0 100%',
                display: 'grid',
                gridTemplateColumns: isSmallScreen ? '1fr' : '1.2fr 1fr',
              gap: isSmallScreen ? '30px' : '50px',
                alignItems: 'center',
                minHeight: minHeight,
                scrollSnapAlign: 'start',
                padding: isSmallScreen ? '0 20px' : '0 40px',
                boxSizing: 'border-box',
                margin: 0
              }}>
              {/* Mobile: Always text on top, image below | Desktop: Alternating layout */}
              {isSmallScreen ? (
                <>
                  <TextColumn project={project} idx={0} />
                  <ImageColumn project={project} idx={0} />
                </>
              ) : idx % 2 === 0 ? (
                <>
                  <TextColumn project={project} idx={idx} />
                  <ImageColumn project={project} idx={idx} />
                </>
              ) : (
                <>
                  <ImageColumn project={project} idx={idx} />
                  <TextColumn project={project} idx={idx} />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Slide Counter & Pagination Dots */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '30px',
          marginTop: '15px',
          flexWrap: 'wrap'
        }}>
          {/* Slide Counter */}
          <div style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#A3A3A3',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            {String(activeSlide + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </div>

          {/* Pagination Dots */}
          <div style={{ display: 'flex', gap: '12px' }} role="tablist" aria-label="Project slides">
            {projects.map((project, idx) => (
              <button
                key={idx}
                role="tab"
                aria-selected={activeSlide === idx}
                aria-label={`Go to project ${idx + 1}: ${project.title}`}
                onClick={() => scrollToSlide(idx)}
                style={{
                  width: activeSlide === idx ? '28px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: activeSlide === idx ? '#EAB308' : '#444444',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  if (activeSlide !== idx) e.currentTarget.style.backgroundColor = '#666666';
                }}
                onMouseLeave={(e) => {
                  if (activeSlide !== idx) e.currentTarget.style.backgroundColor = '#444444';
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};