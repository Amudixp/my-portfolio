import { useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import heroBg from '../../assets/images/hero-bg.webp';

export const Hero = () => {
  const isSmallScreen = useMediaQuery('(max-width: 1023px)');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
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
      position: 'relative',
      width: '100%'
    }}>

      {/* LAYER 0: Hero background rendered as a real <img> so it is painted
          immediately as an LCP candidate and fetched at high priority. */}
      <motion.img
        src={heroBg}
        alt=""
        aria-hidden="true"
        width={1280}
        height={853}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onLoad={() => setIsImageLoaded(true)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          backgroundColor: '#0A0A0A',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.85,
          scale: heroImageScale
        }}
      />

      {/* Loading placeholder — stays mounted and crossfades out to avoid a flash */}
      <motion.div
        aria-hidden="true"
        animate={
          isImageLoaded
            ? { opacity: 0 }
            : shouldReduceMotion
              ? { opacity: 0.7 }
              : { opacity: [0.3, 0.7, 0.3] }
        }
        transition={
          isImageLoaded
            ? { duration: 0.5, ease: 'easeOut' }
            : { duration: 1.5, repeat: shouldReduceMotion ? 0 : Infinity, ease: 'easeInOut' }
        }
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundColor: 'var(--surface-dark)',
          pointerEvents: 'none',
        }}
      />

      {/* LAYER 1: Subtle Top Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        background: 'linear-gradient(180deg, rgba(20,26,10,0.08) 0%, rgba(20,26,10,0.22) 45%, rgba(20,26,10,0.5) 75%, rgba(20,26,10,0.78) 100%)',
        pointerEvents: 'none'
      }} />

      {/* LAYER 2: Smooth Animated Fade-to-Page Overlay on Scroll */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          backgroundColor: 'var(--bg-page)',
          opacity: scrollOpacity,
          pointerEvents: 'none'
        }}
      />

      {/* LAYER 3: Main Content Container
          NOTE: The hero heading is the LCP element — it must be painted at
          first render. We therefore animate only `y` (a composited transform)
          and never gate it behind opacity: 0, so Lighthouse can detect it. */}
      <div
        style={{
          maxWidth: '1000px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isSmallScreen ? '50px 20px' : '80px 40px',
          position: 'relative',
          zIndex: 30
        }}
      >

        {/* Content - Name & Headline */}
        <motion.div
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '850px' }}
        >
          {/* Main Heading (LCP element — visible on first paint) */}
          <motion.h1
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: isSmallScreen ? 'clamp(32px, 8vw, 44px)' : '64px',
              fontWeight: '500',
              color: 'var(--text-on-dark)',
              fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em',
              lineHeight: '1.05',
              marginBottom: '24px',
              textShadow: '0 4px 20px rgba(28,42,7,0.6)'
            }}
          >
            Hi! i am Amudi Purba
          </motion.h1>

          {/* Sub Heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              fontSize: isSmallScreen ? '15px' : '18px',
              color: 'var(--text-muted-on-dark)',
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

      </div>
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
          backgroundColor: isHovered ? '#E2FA6A' : '#F7F7F6',
          boxShadow: isHovered ? '0 10px 25px rgba(226, 250, 106, 0.3)' : '0 4px 20px rgba(10, 10, 10, 0.35)',
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
            color: 'var(--text-primary)',
            fontWeight: '500',
            fontSize: '15px',
            letterSpacing: '0.2px',
            fontFamily: 'Inter Tight, sans-serif',
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
            color: 'var(--text-primary)',
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
          backgroundColor: isHovered ? '#F7F7F6' : 'var(--accent-green)',
          boxShadow: isHovered ? '0 10px 25px rgba(10, 10, 10, 0.3)' : '0 4px 15px rgba(10, 10, 10, 0.35)',
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
            color: '#E2FA6A',
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
            color: 'var(--text-primary)',
            fontWeight: '500',
            fontSize: '15px',
            letterSpacing: '0.2px',
            fontFamily: 'Inter Tight, sans-serif',
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