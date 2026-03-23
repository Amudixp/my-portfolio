import React from 'react';
import { motion } from 'framer-motion';
import { experiences } from '../../data/experience';

export const Experience = () => {
  const [isSmallScreen, setIsSmallScreen] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section 
      id="experience" 
      style={{ 
        padding: isSmallScreen ? '50px 16px 70px 16px' : '80px 40px 90px 40px', 
        backgroundColor: '#000000'
      }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 20px 0', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
            Experience.
          </h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: '#EAB308', borderRadius: '2px', margin: '0 auto' }} />
        </motion.div>

        {/* Timeline Container */}
        <div style={{ position: 'relative', paddingTop: '20px', paddingBottom: '20px' }}>
          {/* Premium Timeline Line with Glow Effect */}
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
              const isActiveNode = index === 0; // First item is active

              return (
                <motion.div
                  key={exp.id}
                  initial={{ 
                    opacity: 0, 
                    x: isLeftCard ? -100 : isRightCard ? 100 : 0
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
                  
                  {/* Premium Timeline Node with Halo Effect */}
                  <div
                    style={{
                      position: 'absolute',
                      left: isSmallScreen ? '17px' : '50%',
                      transform: isSmallScreen ? 'none' : 'translateX(-50%)',
                      top: '6px',
                      zIndex: 10
                    }}>
                    
                    {/* Halo/Glow Ring (for active node) */}
                    {isActiveNode && (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '2px solid rgba(234, 179, 8, 0.3)',
                          zIndex: -1
                        }}
                      />
                    )}

                    {/* Main Node Structure */}
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

                    {/* Connector Dash to Card (Optional) */}
                    {!isMobileCard && (
                      <motion.div
                        initial={{ scaleX: 0, transformOrigin: isLeftCard ? 'right' : 'left' }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          [isLeftCard ? 'right' : 'left']: '16px',
                          width: '20px',
                          height: '2px',
                          backgroundColor: '#EAB308',
                          opacity: 0.6
                        }}
                      />
                    )}
                  </div>

                  {/* Card Container */}
                  <div 
                    style={{
                      width: isMobileCard ? 'calc(100% - 55px)' : '45%',
                      marginLeft: isMobileCard ? '55px' : isLeftCard ? '0' : '0',
                      marginRight: isRightCard ? '0' : '0'
                    }}>
                    <CardContent 
                      exp={exp} 
                      isLeftAligned={!isLeftCard && (isMobileCard || isRightCard)}
                      index={index}
                    />
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

// Card Component - Watermark Logos Implementation
const CardContent = ({ 
  exp, 
  isLeftAligned,
  index
}: { 
  exp: typeof experiences[0]; 
  isLeftAligned: boolean;
  index: number;
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(234, 179, 8, 0.15)' }}
      transition={{ duration: 0.3 }}
      className="relative group overflow-hidden rounded-lg"
      style={{
        backgroundColor: '#111111',
        border: '1px solid rgba(234, 179, 8, 0.2)',
        borderRadius: '12px',
        padding: '32px',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        textAlign: isLeftAligned ? 'left' : 'right'
      }}>
      
      {/* ========================================================= */}
      {/* HORIZONTAL FADE WATERMARK (Edge to Center) */}
      {/* ========================================================= */}
      {exp.logoImagePath && (
        <div className={`absolute inset-y-0 w-1/2 z-0 pointer-events-none overflow-hidden
          ${index % 2 === 0 ? 'left-0' : 'right-0'}`}
        >
          <div 
            className="relative w-full h-full opacity-10 transition-opacity duration-700 group-hover:opacity-20"
            style={{
              WebkitMaskImage: index % 2 === 0 
                ? 'linear-gradient(to right, black 0%, transparent 100%)'
                : 'linear-gradient(to left, black 0%, transparent 100%)',
              maskImage: index % 2 === 0 
                ? 'linear-gradient(to right, black 0%, transparent 100%)'
                : 'linear-gradient(to left, black 0%, transparent 100%)'
            }}
          >
            <img 
              src={exp.logoImagePath} 
              alt=""
              className="w-full h-full object-cover"
              style={{
                mixBlendMode: 'screen'
              }}
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TEXT CONTENT LAYER (Sitting On Top of the Logo) */}
      {/* ========================================================= */}
      <div className="relative z-10 flex flex-col gap-3">
        {/* Year Badge */}
        <span 
          style={{
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#EAB308',
            letterSpacing: '0.8px',
            fontWeight: 600,
            textTransform: 'uppercase'
          }}
        >
          {exp.year}
        </span>
        
        {/* Title */}
        <h3 
          style={{
            fontSize: '20px',
            fontWeight: '900',
            color: '#FFFFFF',
            margin: '8px 0 0 0',
            fontFamily: 'Poppins, sans-serif',
            lineHeight: '1.3'
          }}
        >
          {exp.title}
        </h3>
        
        {/* Organization */}
        <p 
          style={{
            fontSize: '14px',
            color: '#EAB308',
            margin: '4px 0 0 0',
            lineHeight: '1.5',
            fontWeight: '600'
          }}
        >
          {exp.organization}
        </p>
        
        {/* Description (Guaranteed Legible with Semi-Dark Background) */}
        {exp.description && (
          <p 
            style={{
              fontSize: '13px',
              color: '#D1D5DB',
              margin: '12px 0 0 0',
              lineHeight: '1.6',
              fontWeight: '400',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              padding: '12px',
              borderRadius: '8px',
              backdropFilter: 'blur(4px)'
            }}
          >
            {exp.description}
          </p>
        )}

        {/* Skills Tags */}
        {exp.tags && exp.tags.length > 0 && (
          <div 
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '12px',
              justifyContent: isLeftAligned ? 'flex-start' : 'flex-end'
            }}
          >
            {exp.tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(23, 23, 23, 0.8)',
                  border: '1px solid rgba(234, 179, 8, 0.25)',
                  color: '#D1D5DB',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};