import React from 'react';
import { motion } from 'framer-motion';

export const Hero = () => {
  const [isSmallScreen, setIsSmallScreen] = React.useState(window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="hero" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '0', 
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#000000',
      backgroundImage: 'url(/hero-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      
      {/* Dark Overlay Background */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        zIndex: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Main Content Container */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ maxWidth: '1400px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isSmallScreen ? '50px 20px' : '80px 60px', position: 'relative', zIndex: 2 }}
      >
        
        {/* Content - Logo & Typography */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: isSmallScreen ? 'center' : 'center', maxWidth: '700px' }}
        >
          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{ fontSize: isSmallScreen ? 'clamp(28px, 7vw, 40px)' : '58px', fontWeight: '900', color: '#ffffff', fontFamily: 'Poppins, sans-serif', lineHeight: '1.2', marginBottom: '30px' }}
          >
            Strategic data solutions for a connected world.
          </motion.h1>

          {/* Sub Heading */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{ fontSize: '16px', color: '#cbd5e1', fontFamily: 'Inter, sans-serif', lineHeight: '1.8', marginBottom: '0', fontWeight: '500' }}
          >
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  );
};