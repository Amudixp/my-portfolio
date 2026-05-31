import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import heroBg from '../../assets/images/hero-bg.jpg';

export const Hero = () => {
  const isSmallScreen = useMediaQuery('(max-width: 1023px)');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(scrollY, [0, 500], [0, 1]);

  return (
    <section id="hero" style={{ 
      minHeight: '100dvh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '0', 
      overflow: 'hidden',
      position: 'relative'
    }}>
      
      {/* LAYER 0: Background Image with loading state */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        zIndex: 0,
        backgroundColor: '#000000',
        backgroundImage: isImageLoaded ? `url(${heroBg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
        backgroundRepeat: 'no-repeat',
        pointerEvents: 'none',
        transition: 'opacity 0.8s ease-in-out',
        opacity: isImageLoaded ? 1 : 0,
      }} />
      
      {/* Hidden img element to detect when background loads */}
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        onLoad={() => setIsImageLoaded(true)}
        style={{ display: 'none' }}
      />

      {/* Loading shimmer (visible before image loads) */}
      {!isImageLoaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: 'linear-gradient(110deg, #0a0a0a 30%, #1a1a1a 50%, #0a0a0a 70%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* LAYER 1: Static Dark Overlay (Base Layer for Text Readability) */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        zIndex: 10,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none'
      }} />

      {/* LAYER 2: Animated Scroll-to-Black Overlay */}
      <motion.div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          zIndex: 20,
          background: 'rgba(0, 0, 0, 1)',
          opacity: scrollOpacity,
          pointerEvents: 'none'
        }}
      />

      {/* LAYER 3: Main Content Container */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ maxWidth: '1400px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isSmallScreen ? '50px 20px' : '80px 60px', position: 'relative', zIndex: 30 }}
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