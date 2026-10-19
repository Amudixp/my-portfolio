import { useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { education } from '../../data/profile';
import { useTheme } from '../../context/ThemeContext';

export const Education = () => {
  const isSmallScreen = useMediaQuery('(max-width: 767px)');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      id="education"
      style={{
        padding: isSmallScreen ? '50px 16px' : '90px 60px',
        backgroundColor: isLight ? 'var(--bg-page)' : 'var(--bg-page)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease'
      }}>
      
      {/* Cursor-following glow background */}
      <motion.div
        animate={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, ${'rgba(59, 82, 23, 0.06)'}, transparent 70%)`
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}
        transition={{ type: 'tween', ease: 'linear', duration: 0 }}
      />

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px', fontWeight: '500', color: isLight ? 'var(--text-primary)' : 'var(--text-primary)', margin: '0 0 20px 0', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em', textAlign: 'center' }}>
            Education & Qualifications.
          </h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: isLight ? 'var(--accent-green)' : 'var(--accent-green)', borderRadius: '2px', margin: '0 auto' }} />
        </motion.div>

        {/* Education Level Card */}
        <EducationCard eduData={education} isSmallScreen={isSmallScreen} />

        {/* Honors & Awards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '50px' }}>
          <h3 style={{ fontSize: isSmallScreen ? '20px' : '26px', fontWeight: '500', color: isLight ? 'var(--text-primary)' : 'var(--text-primary)', marginBottom: '24px', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em' }}>
            Honors & Awards
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : '1fr 1fr', gap: '20px' }}>
            {education.awards.map((award) => (
              <AwardCard key={award.id} award={award} />
            ))}
          </div>
        </motion.div>

        {/* Certifications Heading */}
        <div style={{ marginBottom: '30px', textAlign: 'left' }}>
          <h3 style={{ fontSize: isSmallScreen ? '20px' : '26px', fontWeight: '500', color: isLight ? 'var(--text-primary)' : 'var(--text-primary)', margin: 0, fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em' }}>
            Certifications & Licenses
          </h3>
        </div>

        {/* Credential Ledger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
            borderTop: isLight ? '1px solid var(--border-subtle)' : '1px solid var(--border-subtle)',
            borderBottom: isLight ? '1px solid var(--border-subtle)' : '1px solid var(--border-subtle)'
          }}>
          
          {education.certifications.map((cert, idx) => (
            <motion.div
              key={cert.id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                borderBottom: isLight ? '1px solid var(--border-subtle)' : '1px solid var(--border-subtle)',
                backgroundColor: hoveredIndex === idx ? (isLight ? 'var(--surface-pill)' : 'var(--surface-pill)') : 'transparent',
                transition: 'background-color 0.3s ease'
              }}>
              
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  width: '100%'
                }}>
                <motion.div
                  animate={{
                    paddingTop: hoveredIndex === idx ? (isSmallScreen ? '16px' : '20px') : (isSmallScreen ? '8px' : '12px'),
                    paddingBottom: hoveredIndex === idx ? (isSmallScreen ? '16px' : '20px') : (isSmallScreen ? '8px' : '12px')
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    paddingLeft: isSmallScreen ? '16px' : '24px',
                    paddingRight: isSmallScreen ? '16px' : '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '80px',
                    position: 'relative'
                  }}>
                  
                  {/* Header Row: Index Number */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <motion.span
                      animate={{
                        color: hoveredIndex === idx ? (isLight ? 'var(--accent-green)' : 'var(--accent-green)') : (isLight ? 'var(--text-secondary)' : 'var(--text-secondary)'),
                        fontSize: hoveredIndex === idx ? '18px' : '16px'
                      }}
                      transition={{ duration: 0.2 }}
                      style={{
                        fontWeight: '500',
                        fontFamily: 'Inter, sans-serif',
                        flexShrink: 0,
                        minWidth: isSmallScreen ? 'auto' : '40px',
                        textAlign: 'left'
                      }}>
                      {cert.id}
                    </motion.span>
                  </div>

                  {/* Identity Section (Name | Issuer) */}
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    alignItems: isSmallScreen ? 'flex-start' : 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <motion.span
                      animate={{
                        color: hoveredIndex === idx ? (isLight ? 'var(--accent-green)' : 'var(--accent-green)') : (isLight ? 'var(--text-primary)' : 'var(--text-primary)')
                      }}
                      transition={{ duration: 0.2 }}
                      style={{
                        fontWeight: '500',
                        fontSize: isSmallScreen ? '14px' : '15px',
                        lineHeight: '1.4'
                      }}>
                      {cert.title}
                    </motion.span>
                    
                    {!isSmallScreen && (
                      <span style={{
                        color: isLight ? 'var(--border-subtle)' : 'var(--text-secondary)',
                        fontSize: '14px',
                        fontWeight: '400'
                      }}>
                        |
                      </span>
                    )}
                    
                    <span style={{
                      color: isLight ? 'var(--text-secondary)' : 'var(--text-secondary)',
                      fontSize: isSmallScreen ? '12px' : '13px',
                      fontWeight: '500',
                      textTransform: 'none',
                      letterSpacing: '0.1px'
                    }}>
                      {cert.issuer}
                    </span>
                  </div>

                  {/* Footer: Date */}
                  <div style={{
                    textAlign: 'left',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: isSmallScreen ? '12px' : '13px',
                    color: isLight ? 'var(--text-secondary)' : 'var(--text-secondary)',
                    fontWeight: '500'
                  }}>
                    {cert.date}
                  </div>
                </motion.div>
              </a>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

// Signature Education Card with Theme Adaptation
const EducationCard = ({ eduData, isSmallScreen }: { eduData: typeof education; isSmallScreen: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        backgroundColor: isHovered ? 'var(--accent-green)' : (isLight ? 'var(--surface-card)' : 'var(--surface-card)'),
        borderColor: isHovered ? 'var(--accent-green)' : (isLight ? 'var(--border-subtle)' : 'var(--border-subtle)'),
        boxShadow: isHovered 
          ? '0 12px 30px rgba(59, 82, 23, 0.25)' 
          : (isLight ? '0 4px 20px rgba(0, 0, 0, 0.05)' : '0 4px 20px rgba(0, 0, 0, 0.2)'),
        y: 0
      }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: '24px',
        borderWidth: '2px',
        borderStyle: 'solid',
        padding: isSmallScreen ? '24px' : '36px',
        marginBottom: '50px',
        cursor: 'pointer'
      }}>
      <div style={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', justifyContent: 'space-between', alignItems: isSmallScreen ? 'flex-start' : 'center', gap: '16px', marginBottom: '20px' }}>
        <div>
          <motion.span 
            animate={{ color: isHovered ? '#FFFFFF' : (isLight ? 'var(--accent-green)' : 'var(--accent-green)') }}
            transition={{ duration: 0.45 }}
            style={{ fontSize: '12px', fontWeight: '500', letterSpacing: '0.2px', textTransform: 'none', fontFamily: 'Inter, sans-serif' }}>
            EDUCATION LEVEL
          </motion.span>
          <motion.h3 
            animate={{ color: isHovered ? '#FFFFFF' : (isLight ? 'var(--text-primary)' : 'var(--text-primary)') }}
            transition={{ duration: 0.45 }}
            style={{ fontSize: isSmallScreen ? '22px' : '28px', fontWeight: '500', margin: '6px 0 4px 0', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em' }}>
            {eduData.institution}
          </motion.h3>
          <motion.p 
            animate={{ color: isHovered ? '#FFFFFF' : (isLight ? 'var(--text-secondary)' : 'var(--text-secondary)') }}
            transition={{ duration: 0.45 }}
            style={{ fontSize: isSmallScreen ? '14px' : '16px', margin: 0, fontWeight: '500', fontFamily: 'Inter, sans-serif' }}>
            {eduData.degree}
          </motion.p>
        </div>
        <div style={{ textAlign: isSmallScreen ? 'left' : 'right' }}>
          <motion.div 
            animate={{ color: isHovered ? '#FFFFFF' : (isLight ? 'var(--accent-green)' : 'var(--accent-green)') }}
            transition={{ duration: 0.45 }}
            style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
            {eduData.period}
          </motion.div>
          <motion.div 
            animate={{ color: isHovered ? '#FFFFFF' : (isLight ? 'var(--text-primary)' : 'var(--text-primary)') }}
            transition={{ duration: 0.45 }}
            style={{ fontSize: '15px', fontWeight: '500', marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>
            CGPA: {eduData.gpa}
          </motion.div>
        </div>
      </div>

      {/* Relevant Coursework */}
      <motion.div 
        animate={{ borderColor: isHovered ? 'rgba(255, 255, 255, 0.4)' : (isLight ? 'var(--border-subtle)' : 'var(--border-subtle)') }}
        transition={{ duration: 0.45 }}
        style={{ borderTopWidth: '1px', borderTopStyle: 'dashed', paddingTop: '20px', marginTop: '20px' }}>
        <motion.h4 
          animate={{ color: isHovered ? 'rgba(255, 255, 255, 0.8)' : (isLight ? 'var(--text-secondary)' : 'var(--text-secondary)') }}
          transition={{ duration: 0.45 }}
          style={{ fontSize: '13px', textTransform: 'none', letterSpacing: '0.2px', marginBottom: '12px', fontWeight: '500', fontFamily: 'Inter, sans-serif' }}>
          Relevant Courseworks
        </motion.h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {eduData.relevantCourseworks.map((course: string, idx: number) => (
            <motion.span
              key={idx}
              animate={{
                backgroundColor: idx === 0 && isHovered ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                borderColor: isHovered ? 'rgba(255, 255, 255, 0.5)' : (isLight ? 'var(--border-subtle)' : 'var(--border-subtle)'),
                color: idx === 0 && isHovered ? '#FFFFFF' : (isHovered ? '#FFFFFF' : (isLight ? 'var(--accent-green)' : 'var(--accent-green)'))
              }}
              transition={{ duration: 0.45 }}
              style={{
                borderWidth: '1.5px',
                borderStyle: 'solid',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '500',
                fontFamily: 'Inter, sans-serif',
                display: 'inline-block',
                boxShadow: isHovered ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
              }}>
              {course}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Clean Award Card
const AwardCard = ({ award }: { award: typeof education.awards[0] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        backgroundColor: isHovered ? 'var(--accent-green)' : (isLight ? 'var(--surface-card)' : 'var(--surface-card)'),
        borderColor: isHovered ? 'var(--accent-green)' : (isLight ? 'var(--border-subtle)' : 'var(--border-subtle)'),
        boxShadow: isHovered 
          ? '0 12px 30px rgba(59, 82, 23, 0.25)' 
          : (isLight ? '0 4px 20px rgba(0, 0, 0, 0.05)' : '0 4px 20px rgba(0, 0, 0, 0.2)'),
        y: 0
      }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: '24px',
        borderWidth: '2px',
        borderStyle: 'solid',
        padding: '24px 26px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer'
      }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <motion.span 
            animate={{
              backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : (isLight ? 'var(--surface-pill)' : 'var(--surface-pill)'),
              color: isHovered ? '#FFFFFF' : (isLight ? 'var(--accent-green)' : 'var(--accent-green)')
            }}
            transition={{ duration: 0.45 }}
            style={{ fontSize: '11px', fontWeight: '500', padding: '4px 12px', borderRadius: '12px', textTransform: 'none', fontFamily: 'Inter, sans-serif' }}>
            {award.tag}
          </motion.span>
          <motion.span 
            animate={{ color: isHovered ? '#FFFFFF' : (isLight ? 'var(--text-secondary)' : 'var(--text-secondary)') }}
            transition={{ duration: 0.45 }}
            style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
            {award.year}
          </motion.span>
        </div>
        <motion.h4 
          animate={{ color: isHovered ? '#FFFFFF' : (isLight ? 'var(--text-primary)' : 'var(--text-primary)') }}
          transition={{ duration: 0.45 }}
          style={{ fontSize: '17px', fontWeight: '500', margin: '0 0 10px 0', lineHeight: '1.4', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em' }}>
          {award.title}
        </motion.h4>

        {award.description && (
          <motion.p 
            animate={{ color: isHovered ? 'rgba(255, 255, 255, 0.85)' : (isLight ? 'var(--text-secondary)' : 'var(--text-secondary)') }}
            transition={{ duration: 0.45 }}
            style={{ fontSize: '13.5px', margin: 0, lineHeight: '1.6', fontWeight: isHovered ? '600' : '400', fontFamily: 'Inter, sans-serif' }}>
            {award.description}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};
