import { useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const Education = () => {
  const isSmallScreen = useMediaQuery('(max-width: 767px)');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Certifications data - synced from CV
  const certifications = [
    {
      id: '01',
      title: 'Foundation of Machine Learning',
      issuer: 'DICODING',
      date: 'March 2026',
      link: 'https://www.dicoding.com/certificates/JLX1VL93NZ72'
    },
    {
      id: '02',
      title: 'Introduction to SQL',
      issuer: 'DICODING',
      date: 'March 2026',
      link: 'https://www.dicoding.com/certificates/KEXLQ036WPG2'
    },
    {
      id: '03',
      title: 'Introduction to Data Science',
      issuer: 'DICODING',
      date: 'March 2026',
      link: 'https://www.dicoding.com/certificates/6RPN7W829X2M'
    },
    {
      id: '04',
      title: 'Foundation of Artificial Intelligence',
      issuer: 'DICODING',
      date: 'Feb 2026',
      link: 'https://www.dicoding.com/certificates/0LZ0Y1YRNX65'
    },
    {
      id: '05',
      title: 'Start Code with Python',
      issuer: 'DICODING',
      date: 'Feb 2026',
      link: 'https://www.dicoding.com/certificates/07Z67R73JPQR'
    },
    {
      id: '06',
      title: 'Generative AI Certified',
      issuer: 'MICROSOFT',
      date: 'Jul 2024',
      link: 'https://www.linkedin.com/learning/certificates/6f19bd14f4b9c69179db72c1978a25e8a193200d743b8961f800e79da111e4b6?trk=share_certificate'
    }
  ];


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
        backgroundColor: '#000000',
        position: 'relative',
        overflow: 'hidden'
      }}>
      
      {/* Cursor-following glow background */}
      <motion.div
        animate={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(234, 179, 8, 0.05), transparent 70%)`
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
          style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 20px 0', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
            Certifications & Licenses.
          </h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: '#EAB308', borderRadius: '2px', margin: '0 auto' }} />
        </motion.div>

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
            borderTop: '1px solid rgba(234, 179, 8, 0.15)',
            borderBottom: '1px solid rgba(234, 179, 8, 0.15)'
          }}>
          
          {certifications.map((cert, idx) => (
            <motion.div
              key={cert.id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                borderBottom: '1px solid rgba(234, 179, 8, 0.1)',
                backgroundColor: hoveredIndex === idx ? 'rgba(17, 17, 17, 0.4)' : 'transparent',
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
                  
                  {/* Header Row: Index + Minimalist Arrow */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    {/* Index Number */}
                    <motion.span
                      animate={{
                        color: hoveredIndex === idx ? '#EAB308' : '#444444',
                        fontSize: hoveredIndex === idx ? '18px' : '16px'
                      }}
                      transition={{ duration: 0.2 }}
                      style={{
                        fontWeight: '900',
                        fontFamily: 'monospace',
                        flexShrink: 0,
                        minWidth: isSmallScreen ? 'auto' : '40px',
                        textAlign: 'left'
                      }}>
                      {cert.id}
                    </motion.span>

                    {/* Minimalist Arrow Link - Top Right */}
                    <motion.span
                      animate={{
                        opacity: isSmallScreen ? 1 : (hoveredIndex === idx ? 1 : 0),
                        x: isSmallScreen ? 0 : (hoveredIndex === idx ? 0 : -5)
                      }}
                      transition={{ duration: 0.2 }}
                      style={{
                        fontSize: '18px',
                        color: '#EAB308',
                        fontWeight: '700',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}>
                      ↗
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
                        color: hoveredIndex === idx ? '#EAB308' : '#FFFFFF'
                      }}
                      transition={{ duration: 0.2 }}
                      style={{
                        fontWeight: '700',
                        fontSize: isSmallScreen ? '14px' : '15px',
                        lineHeight: '1.4'
                      }}>
                      {cert.title}
                    </motion.span>
                    
                    {!isSmallScreen && (
                      <span style={{
                        color: '#666666',
                        fontSize: '14px',
                        fontWeight: '400'
                      }}>
                        |
                      </span>
                    )}
                    
                    <span style={{
                      color: '#888888',
                      fontSize: isSmallScreen ? '12px' : '13px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {cert.issuer}
                    </span>
                  </div>

                  {/* Footer: Date in bottom-left corner */}
                  <div style={{
                    textAlign: 'left',
                    fontFamily: 'monospace',
                    fontSize: isSmallScreen ? '12px' : '13px',
                    color: '#888888',
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