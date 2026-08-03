import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import heroBg from '../../assets/images/hero-bg.jpg';
import { profile } from '../../data/profile';

export const Hero = () => {
  const isSmallScreen = useMediaQuery('(max-width: 1023px)');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { scrollY } = useScroll();

  // As user scrolls from top (0px) to 450px, the black overlay smoothly fades in from 0 to 1
  const scrollOpacity = useTransform(scrollY, [0, 450], [0, 1]);
  const heroImageScale = useTransform(scrollY, [0, 500], [1, 1.1]);

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

      {/* LAYER 0: Luminous Hero Background Image */}
      <motion.div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        backgroundColor: '#000000',
        backgroundImage: isImageLoaded ? `url(${heroBg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        pointerEvents: 'none',
        transition: 'opacity 0.8s ease-in-out',
        opacity: isImageLoaded ? 0.85 : 0,
        scale: heroImageScale
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

      {/* LAYER 1: Subtle Top Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.85) 100%)',
        pointerEvents: 'none'
      }} />

      {/* LAYER 2: Smooth Animated Fade-to-Black Overlay on Scroll */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          backgroundColor: '#000000',
          opacity: scrollOpacity,
          pointerEvents: 'none'
        }}
      />

      {/* LAYER 3: Main Content Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ maxWidth: '1000px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isSmallScreen ? '50px 20px' : '80px 40px', position: 'relative', zIndex: 30 }}
      >

        {/* Content - Name & Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '850px' }}
        >
          {/* Subtitle / Name Tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              backdropFilter: 'blur(8px)',
              padding: '8px 20px',
              borderRadius: '5px',
              marginBottom: '24px'
            }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EAB308' }} />
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#FDE047', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              {profile.name} @ {profile.university}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{
              fontSize: isSmallScreen ? 'clamp(32px, 8vw, 44px)' : '64px',
              fontWeight: '900',
              color: '#ffffff',
              fontFamily: 'Poppins, sans-serif',
              lineHeight: '1.15',
              marginBottom: '24px',
              textShadow: '0 4px 20px rgba(0,0,0,0.6)'
            }}
          >
            Building Data-Driven & AI Systems with Impact.
          </motion.h1>

          {/* Sub Heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              fontSize: isSmallScreen ? '15px' : '18px',
              color: '#F3F4F6',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.7',
              marginBottom: '40px',
              fontWeight: '500',
              maxWidth: '720px',
              textShadow: '0 2px 10px rgba(0,0,0,0.7)'
            }}
          >
            Information Systems & Technology student at ITB specializing in AI Systems integration, full SDLC software engineering, and STLC quality assurance.
          </motion.p>

          {/* Action CTA: GPU Accelerated Ultra-Smooth Morphing View Projects Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            <ViewProjectsButton />

          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  );
};

// Ultra-Smooth GPU-Accelerated Morphing View Projects Button
const ViewProjectsButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Exact fixed pixel width for pill text box (170px) vs arrow box (52px)
  const pillWidth = 170;
  const arrowWidth = 52;

  return (
    <a
      href="#projects"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isHovered ? '6px' : '12px',
        textDecoration: 'none',
        transition: 'gap 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer'
      }}>

      {/* LEFT BOX: Default 170px White Text Pill -> Morphs on Hover to 52px Sharp Gold Arrow Square */}
      <div
        style={{
          width: isHovered ? `${arrowWidth}px` : `${pillWidth}px`,
          height: '52px',
          borderRadius: isHovered ? '0px' : '50px',
          backgroundColor: isHovered ? '#EAB308' : '#FFFFFF',
          boxShadow: isHovered ? '0 10px 25px rgba(234, 179, 8, 0.4)' : '0 4px 20px rgba(255, 255, 255, 0.25)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          willChange: 'width, border-radius, background-color, box-shadow'
        }}>

        {/* Text "View Projects" (visible when not hovered) */}
        <span
          style={{
            position: 'absolute',
            color: '#000000',
            fontWeight: '800',
            fontSize: '15px',
            letterSpacing: '0.3px',
            fontFamily: 'Poppins, sans-serif',
            whiteSpace: 'nowrap',
            opacity: isHovered ? 0 : 1,
            transform: isHovered ? 'scale(0.85)' : 'scale(1)',
            transition: 'opacity 0.25s ease, transform 0.25s ease'
          }}>
          View Projects
        </span>

        {/* Arrow Up Right Icon (visible when hovered) */}
        <div
          style={{
            position: 'absolute',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1)' : 'scale(0.6)',
            transition: 'opacity 0.25s ease, transform 0.25s ease'
          }}>
          <ArrowUpRight size={24} strokeWidth={2.5} />
        </div>
      </div>

      {/* RIGHT BOX: Default 52px Gold Arrow Circle -> Morphs on Hover to 170px Sharp White Text Rectangle */}
      <div
        style={{
          width: isHovered ? `${pillWidth}px` : `${arrowWidth}px`,
          height: '52px',
          borderRadius: isHovered ? '0px' : '50%',
          backgroundColor: isHovered ? '#FFFFFF' : '#EAB308',
          boxShadow: isHovered ? '0 10px 25px rgba(255, 255, 255, 0.35)' : '0 4px 15px rgba(234, 179, 8, 0.4)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          willChange: 'width, border-radius, background-color, box-shadow'
        }}>

        {/* Arrow Up Right Icon (visible when not hovered) */}
        <div
          style={{
            position: 'absolute',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isHovered ? 0 : 1,
            transform: isHovered ? 'scale(0.6)' : 'scale(1)',
            transition: 'opacity 0.25s ease, transform 0.25s ease'
          }}>
          <ArrowUpRight size={24} strokeWidth={2.5} />
        </div>

        {/* Text "View Projects" (visible when hovered) */}
        <span
          style={{
            position: 'absolute',
            color: '#000000',
            fontWeight: '800',
            fontSize: '15px',
            letterSpacing: '0.3px',
            fontFamily: 'Poppins, sans-serif',
            whiteSpace: 'nowrap',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1)' : 'scale(0.85)',
            transition: 'opacity 0.25s ease, transform 0.25s ease'
          }}>
          View Projects
        </span>
      </div>

    </a>
  );
};