import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { experiences } from '../../data/experience';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useTheme } from '../../context/ThemeContext';

export const Experience = () => {
  const isSmallScreen = useMediaQuery('(max-width: 767px)');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section 
      id="experience" 
      style={{ 
        padding: isSmallScreen ? '50px 16px 70px 16px' : '90px 40px 100px 40px', 
        backgroundColor: isLight ? '#F8FAFC' : '#000000',
        position: 'relative',
        transition: 'background-color 0.3s ease'
      }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '60px', textAlign: 'center' }}>
          <h2 style={{ fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px', fontWeight: '900', color: isLight ? '#0F172A' : '#FFFFFF', margin: '0 0 16px 0', fontFamily: 'Poppins, sans-serif' }}>
            Experience.
          </h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: isLight ? '#D97706' : '#EAB308', borderRadius: '2px', margin: '0 auto 16px auto' }} />
          <p style={{ fontSize: isSmallScreen ? '14px' : '16px', color: isLight ? '#64748B' : '#9CA3AF', margin: 0, fontFamily: 'Inter, sans-serif' }}>
            Leadership roles, technical projects, and academic excellence.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div style={{ position: 'relative', paddingTop: '20px', paddingBottom: '20px' }}>
          {/* Timeline Line with Glowing Gold Gradient */}
          <motion.div 
            initial={{ scaleY: 0, transformOrigin: 'top' }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            viewport={{ once: true, margin: isSmallScreen ? '0px' : '-100px' }}
            style={{
              position: 'absolute',
              left: isSmallScreen ? '24px' : '50%',
              transform: isSmallScreen ? 'none' : 'translateX(-50%)',
              top: '0',
              bottom: '0',
              width: '2px',
              background: `linear-gradient(to bottom, 
                rgba(234, 179, 8, 0) 0%,
                rgba(234, 179, 8, ${isSmallScreen ? '0.5' : '0.3'}) 15%,
                rgba(234, 179, 8, ${isSmallScreen ? '1' : '0.8'}) 50%,
                rgba(234, 179, 8, ${isSmallScreen ? '0.5' : '0.3'}) 85%,
                rgba(234, 179, 8, 0) 100%)`,
              zIndex: 0,
              filter: isSmallScreen ? 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.6))' : 'drop-shadow(0 0 12px rgba(234, 179, 8, 0.4))',
              boxShadow: isSmallScreen ? '0 0 12px rgba(234, 179, 8, 0.5)' : '0 0 20px rgba(234, 179, 8, 0.3)'
            }} 
          />

          {/* Timeline Items */}
          <div 
            style={{ display: 'flex', flexDirection: 'column', gap: '50px', position: 'relative', zIndex: 1 }}>
            {experiences.map((exp, index) => {
              const isLeftCard = !isSmallScreen && index % 2 === 0;
              const isRightCard = !isSmallScreen && index % 2 === 1;
              const isMobileCard = isSmallScreen;
              const isActiveNode = index === 0;

              return (
                <motion.div
                  key={exp.id}
                  initial={{ 
                    opacity: 0, 
                    x: isLeftCard ? -60 : isRightCard ? 60 : 0
                  }}
                  whileInView={{ 
                    opacity: 1, 
                    x: 0 
                  }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: isMobileCard ? 'flex-start' : isLeftCard ? 'flex-start' : 'flex-end',
                    alignItems: 'flex-start',
                    position: 'relative'
                  }}>
                  
                  {/* Timeline Node */}
                  <div
                    style={{
                      position: 'absolute',
                      left: isSmallScreen ? '17px' : '50%',
                      transform: isSmallScreen ? 'none' : 'translateX(-50%)',
                      top: '20px',
                      zIndex: 10
                    }}>
                    
                    {isActiveNode && (
                      <motion.div
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          left: '-8px',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '2px solid rgba(234, 179, 8, 0.4)',
                          zIndex: -1
                        }}
                      />
                    )}

                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      viewport={{ once: true }}
                      style={{
                        position: 'relative',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#EAB308',
                        border: '4px solid #000000',
                        boxShadow: `0 0 0 2px #EAB308, 0 4px 12px rgba(234, 179, 8, 0.4)`,
                        zIndex: 20
                      }}
                    />
                  </div>

                  {/* Card Container */}
                  <div 
                    style={{
                      width: isMobileCard ? 'calc(100% - 55px)' : '46%',
                      marginLeft: isMobileCard ? '55px' : '0',
                      marginRight: '0'
                    }}>
                    <CardContent exp={exp} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// Signature Card Component: Solid Box with Theme Adaptation
const CardContent = ({ exp }: { exp: typeof experiences[0] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const isInverted = isHovered || isExpanded;

  return (
    <motion.div
      onClick={toggleExpand}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        backgroundColor: isInverted ? '#F59E0B' : (isLight ? '#FFFFFF' : '#111111'),
        borderColor: isInverted ? '#000000' : (isLight ? '#CBD5E1' : 'rgba(234, 179, 8, 0.35)'),
        boxShadow: isInverted 
          ? '0 16px 45px rgba(245, 158, 11, 0.4), 0 0 0 2px #000000' 
          : (isLight ? '0 4px 20px rgba(0, 0, 0, 0.05)' : '0 4px 20px rgba(0, 0, 0, 0.4)')
      }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'relative',
        borderRadius: '18px',
        borderWidth: '2px',
        borderStyle: 'solid',
        padding: '26px 28px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>

      {/* CARD BODY CONTENT */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Top Row: Year / Period Badge */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <motion.span 
              animate={{ backgroundColor: isInverted ? '#000000' : (isLight ? '#D97706' : '#EAB308') }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '6px', height: '6px', borderRadius: '50%' }} 
            />
            <motion.span 
              animate={{ color: isInverted ? '#000000' : (isLight ? '#D97706' : '#EAB308') }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                letterSpacing: '1px',
                fontWeight: '800',
                textTransform: 'uppercase'
              }}>
              {exp.year}
            </motion.span>
          </div>
        </div>

        {/* Title Row: Jabatan + Plus Toggle Button Right Next to Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <motion.h3 
            animate={{ color: isInverted ? '#000000' : (isLight ? '#0F172A' : '#FFFFFF') }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: '22px',
              fontWeight: '800',
              margin: 0,
              fontFamily: 'Poppins, sans-serif',
              lineHeight: '1.25'
            }}>
            {exp.title}
          </motion.h3>

          {/* Plus / Close Toggle Button next to Title */}
          <motion.button
            onClick={toggleExpand}
            animate={{
              scale: isInverted ? 1.08 : 1,
              backgroundColor: isInverted ? '#000000' : (isLight ? '#F1F5F9' : 'rgba(255, 255, 255, 0.1)'),
              color: isInverted ? '#F59E0B' : (isLight ? '#0F172A' : '#FFFFFF')
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
              boxShadow: isInverted ? '0 4px 14px rgba(0, 0, 0, 0.3)' : 'none'
            }}>
            {isExpanded ? (
              <X size={18} strokeWidth={2.5} />
            ) : (
              <Plus size={18} strokeWidth={2.5} />
            )}
          </motion.button>
        </div>

        {/* Organization Name */}
        <motion.p 
          animate={{ color: isInverted ? '#000000' : (isLight ? '#D97706' : '#EAB308') }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: '15px',
            fontWeight: '800',
            margin: '6px 0 0 0',
            fontFamily: 'Inter, sans-serif'
          }}>
          {exp.organization}
        </motion.p>

        {/* Expandable Details Container: Logo Component + Description + Skill Tags */}
        <motion.div
          animate={{
            height: isExpanded ? 'auto' : '0px',
            opacity: isExpanded ? 1 : 0,
            marginTop: isExpanded ? '20px' : '0px'
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ overflow: 'hidden' }}>
          
          {/* Detail Panel in Solid Black Background with Crisp White Text */}
          <motion.div 
            animate={{
              backgroundColor: '#000000',
              borderColor: isInverted ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.15)'
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              padding: '18px 20px',
              borderRadius: '14px',
              borderWidth: '1px',
              borderStyle: 'solid',
              marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}>
            {/* Header inside Detail View: Logo Badge Component + Org Name */}
            {exp.logoImagePath && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <motion.div 
                  animate={{
                    backgroundColor: '#1A1A1A',
                    borderColor: isInverted ? '#F59E0B' : 'rgba(234, 179, 8, 0.4)'
                  }}
                  transition={{ duration: 0.45 }}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}>
                  <img 
                    src={exp.logoImagePath} 
                    alt={exp.organization}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '6px'
                    }}
                  />
                </motion.div>
                <div>
                  <motion.h4 
                    animate={{ color: '#FFFFFF' }}
                    transition={{ duration: 0.45 }}
                    style={{ margin: 0, fontSize: '15px', fontWeight: '800', fontFamily: 'Poppins, sans-serif' }}>
                    {exp.organization}
                  </motion.h4>
                </div>
              </div>
            )}

            {/* Description Text */}
            <motion.p 
              animate={{ color: '#FFFFFF' }}
              transition={{ duration: 0.45 }}
              style={{
                fontSize: '13.5px',
                fontWeight: '500',
                lineHeight: '1.7',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
              {exp.description}
            </motion.p>
          </motion.div>

          {/* Skill Tag Pills inside Detail view */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {exp.tags && exp.tags.map((tag, idx) => (
              <motion.span
                key={idx}
                animate={{
                  backgroundColor: isInverted ? '#000000' : 'rgba(234, 179, 8, 0.08)',
                  borderColor: isInverted ? '#000000' : 'rgba(234, 179, 8, 0.35)',
                  color: isInverted ? '#FFFFFF' : '#FDE047'
                }}
                transition={{ duration: 0.45 }}
                style={{
                  borderWidth: '1.5px',
                  borderStyle: 'solid',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '800',
                  letterSpacing: '0.5px',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                {tag}
              </motion.span>
            ))}
          </div>

        </motion.div>
      </div>

    </motion.div>
  );
};
