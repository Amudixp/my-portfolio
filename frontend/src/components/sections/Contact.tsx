import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';
import { profile } from '../../data/profile';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useTheme } from '../../context/ThemeContext';
import profileImage from '../../assets/images/profil.webp';
import qrLinkedin from '../../assets/images/qr-linkedin.webp';
import BorderGlow from '../ui/BorderGlow';

export const Contact = () => {
  const isSmallScreen = useMediaQuery('(max-width: 767px)');
  const [isFlipped, setIsFlipped] = useState(false);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  return (
    <section id="contact" ref={contactSectionRef} style={{ padding: isSmallScreen ? '60px 16px' : '90px 40px', backgroundColor: isLight ? 'var(--bg-page)' : 'var(--bg-page)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', transition: 'background-color 0.3s ease' }}>
      {/* Background Decorative Elements */}
      {!isSmallScreen && (
      <svg style={{ position: 'absolute', top: '0', right: '0', opacity: 0.05, width: '400px', height: '400px', pointerEvents: 'none' }} viewBox="0 0 200 200">
        <defs>
          <linearGradient id="codeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? 'var(--accent-green)' : 'var(--accent-green)'} />
            <stop offset="100%" stopColor="#6F716B" />
          </linearGradient>
        </defs>
        <text x="20" y="40" fontSize="12" fill="url(#codeGradient)" fontFamily="monospace">&lt;AI /&gt;</text>
        <text x="40" y="80" fontSize="12" fill="url(#codeGradient)" fontFamily="monospace">Data</text>
        <text x="60" y="120" fontSize="12" fill="url(#codeGradient)" fontFamily="monospace">{'{Model}'}</text>
        <circle cx="100" cy="100" r="40" fill="none" stroke="url(#codeGradient)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="url(#codeGradient)" strokeWidth="0.3" />
      </svg>
      )}


      <div style={{ maxWidth: '1300px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Section Header - Centered */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '80px', textAlign: 'center' }}>
          <h2 style={{ fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px', fontWeight: '500', color: isLight ? 'var(--text-primary)' : 'var(--text-primary)', margin: '0 0 20px 0', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em' }}>
            Get In Touch.
          </h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: isLight ? 'var(--accent-green)' : 'var(--accent-green)', borderRadius: '2px', margin: '0 auto' }} />
        </motion.div>

        {/* Main Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isSmallScreen ? '1fr' : '1fr 1fr',
          gap: isSmallScreen ? '60px' : '100px',
          alignItems: 'center'
        }}>
          {/* Left Column - Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            
            {/* Massive Typography */}
            <h2 style={{
              fontSize: isSmallScreen ? 'clamp(24px, 6vw, 32px)' : '56px',
              fontWeight: '500',
              color: isLight ? 'var(--text-primary)' : 'var(--text-primary)',
              fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em',
              lineHeight: '1.1',
              marginBottom: '40px',
              textAlign: isSmallScreen ? 'center' : 'left'
            }}>
              LET'S BUILD
              <br />
              SOLUTIONS
              <br />
              TOGETHER.
            </h2>

            {/* Description */}
            <p style={{
              color: isLight ? 'var(--text-secondary)' : 'var(--text-secondary)',
              fontSize: isSmallScreen ? '14px' : '16px',
              lineHeight: '1.8',
              marginBottom: '40px',
              fontFamily: 'Inter, sans-serif',
              textAlign: isSmallScreen ? 'center' : 'left'
            }}>
              Saya selalu terbuka untuk diskusi mengenai peluang magang Data/AI and Engineering, proyek kolaborasi, atau sekadar menyapa. Kotak masuk saya selalu terbuka!
            </p>

            {/* Primary CTA */}
            <motion.div style={{ marginBottom: '30px', display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start' }}>
              <motion.a 
                href={profile.resume || `mailto:${profile.email}`}
                target={profile.resume ? "_blank" : "_self"}
                rel={profile.resume ? "noreferrer" : ""}
                whileHover={{ scale: 1.05, boxShadow: '0 15px 40px rgba(59, 82, 23, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  backgroundColor: '#1E1E1E',
                  color: '#FFFFFF',
                  padding: isSmallScreen ? '12px 24px' : '14px 32px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: isSmallScreen ? '12px' : '15px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em'
                }}>
                DOWNLOAD CV ↗
              </motion.a>
            </motion.div>

            {/* Secondary Contact Links - Circular Icon Buttons */}
            <motion.div 
              style={{ display: 'flex', gap: '16px', justifyContent: isSmallScreen ? 'center' : 'flex-start', marginTop: '24px' }}
              initial="hidden"
              whileInView="visible"
              variants={containerVariants}
              viewport={{ once: true }}>
              {/* Email / Say Hello */}
              <motion.a 
                href={`mailto:${profile.email}`}
                aria-label="Email"
                variants={buttonVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isSmallScreen ? '40px' : '48px',
                  height: isSmallScreen ? '40px' : '48px',
                  borderRadius: '9999px',
                  border: '2px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'transparent',
                  boxShadow: '0 0 0px rgba(59, 82, 23, 0)'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-green)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--accent-green)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(59, 82, 23, 0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0px rgba(59, 82, 23, 0)';
                }}>
                <Mail size={isSmallScreen ? 18 : 20} />
              </motion.a>

              {/* LinkedIn */}
              <motion.a 
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                variants={buttonVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isSmallScreen ? '40px' : '48px',
                  height: isSmallScreen ? '40px' : '48px',
                  borderRadius: '9999px',
                  border: '2px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'transparent',
                  boxShadow: '0 0 0px rgba(59, 82, 23, 0)'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-green)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--accent-green)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(59, 82, 23, 0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0px rgba(59, 82, 23, 0)';
                }}>
                <Linkedin size={isSmallScreen ? 18 : 20} />
              </motion.a>

              {/* GitHub */}
              <motion.a 
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                variants={buttonVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isSmallScreen ? '40px' : '48px',
                  height: isSmallScreen ? '40px' : '48px',
                  borderRadius: '9999px',
                  border: '2px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'transparent',
                  boxShadow: '0 0 0px rgba(59, 82, 23, 0)'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-green)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--accent-green)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(59, 82, 23, 0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0px rgba(59, 82, 23, 0)';
                }}>
                <Github size={isSmallScreen ? 18 : 20} />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column - Simple Flip Card */}
          {!isSmallScreen && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ perspective: '1200px', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '40px' }}>
              
              {/* Background Radial Glow */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  width: '500px',
                  height: '500px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(59, 82, 23, 0.08) 0%, transparent 70%)',
                  zIndex: 2
                }} />

              {/* Floating Card Container */}
              <motion.div
                animate={{
                  y: [0, -15, 0]
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{
                  perspective: '1200px',
                  position: 'relative',
                  zIndex: 10
                }}>
                
                {/* Card Flip Container */}
                <BorderGlow
                  glowColor="71 92% 70%"
                  colors={['#3B5217', '#E2FA6A', '#F7F7F6']}
                  backgroundColor="var(--surface-dark)"
                  borderRadius={20}
                  edgeSensitivity={40}
                  className="block"
                  style={{
                    width: '350px',
                    height: '420px'
                  }}
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    onClick={() => handleCardFlip()}
                    style={{
                      width: '100%',
                      height: '100%',
                      transformStyle: 'preserve-3d',
                      position: 'relative',
                      cursor: 'pointer',
                      pointerEvents: 'auto'
                    }}>
                    
                    {/* Card Front - Photo */}
                    <motion.div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backfaceVisibility: 'hidden',
                        boxShadow: '0 20px 50px rgba(28, 42, 7, 0.18)',
                        backgroundColor: 'transparent',
                        cursor: 'pointer'
                      }}>
                      
                      {/* Photo */}
                      <img
                        src={profileImage}
                        alt="Amudi Purba"
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '20px',
                          objectFit: 'cover'
                        }}
                      />
                    </motion.div>

                    {/* Card Back - QR Code */}
                    <motion.div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'var(--surface-glass)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        padding: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        backfaceVisibility: 'hidden',
                        boxShadow: '0 20px 50px rgba(28, 42, 7, 0.18)',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        rotateY: '180deg',
                        cursor: 'pointer'
                      }}>
                      
                      {/* QR Code Image */}
                      <img
                        src={qrLinkedin}
                        alt="LinkedIn QR Code"
                        loading="lazy"
                        style={{
                          width: '160px',
                          height: '160px',
                          border: '3px solid rgba(226, 250, 106, 0.8)',
                          borderRadius: '12px',
                          backgroundColor: '#FFFFFF',
                          padding: '10px',
                          objectFit: 'contain'
                        }}
                      />

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: '#E2FA6A', fontWeight: '500', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                          SCAN ME
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted-on-dark)', fontFamily: 'Inter, sans-serif' }}>
                          Connect on LinkedIn
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </BorderGlow>
                
                {/* Typography Container */}
                <div style={{
                  marginTop: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <h3 style={{
                    fontSize: '28px',
                    fontWeight: '500',
                    color: '#FFFFFF',
                    fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em',
                    margin: '0'
                  }}>
                    Amudi Purba
                  </h3>
                  
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--text-muted-on-dark)',
                    fontFamily: 'Inter, sans-serif',
                    marginTop: '8px',
                    margin: '8px 0 0 0'
                  }}>
                    Information System & Technology at ITB | Based in Bandung, ID
                  </p>
                  
                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      fontSize: '12px',
                      color: '#E2FA6A',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '500',
                      marginTop: '16px',
                      letterSpacing: '0.02em',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleCardFlip()}>
                    ↻ CLICK PHOTO TO FLIP
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Mobile Flip Card */}
          {isSmallScreen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              
              {/* Floating Parent */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 'min(320px, calc(100vw - 40px))', height: 'auto', aspectRatio: '320/380', perspective: '1200px' }}>
                
                {/* Card Flip Container */}
                <BorderGlow
                  glowColor="71 92% 70%"
                  colors={['#3B5217', '#E2FA6A', '#F7F7F6']}
                  backgroundColor="var(--surface-dark)"
                  borderRadius={16}
                  edgeSensitivity={40}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    onClick={() => handleCardFlip()}
                    style={{
                      width: '100%',
                      height: '100%',
                      transformStyle: 'preserve-3d',
                      position: 'relative',
                      cursor: 'pointer',
                      pointerEvents: 'auto'
                    }}>
                    
                    {/* Card Front - Photo */}
                    <motion.div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backfaceVisibility: 'hidden',
                        boxShadow: '0 20px 50px rgba(28, 42, 7, 0.18)',
                        backgroundColor: 'transparent'
                      }}>
                      
                      {/* Photo */}
                      <img
                        src={profileImage}
                        alt="Amudi Purba"
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '16px',
                          objectFit: 'cover'
                        }}
                      />
                    </motion.div>

                    {/* Card Back - QR Code */}
                    <motion.div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'var(--surface-glass)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '14px',
                        backfaceVisibility: 'hidden',
                        boxShadow: '0 20px 50px rgba(28, 42, 7, 0.18)',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        rotateY: '180deg'
                      }}>
                      
                      {/* QR Code Image */}
                      <img
                        src={qrLinkedin}
                        alt="LinkedIn QR Code"
                        loading="lazy"
                        style={{
                          width: '120px',
                          height: '120px',
                          border: '2px solid rgba(226, 250, 106, 0.7)',
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          objectFit: 'contain'
                        }}
                      />

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: '500', marginBottom: '4px', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em' }}>
                          SCAN ME
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted-on-dark)', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em' }}>
                          Connect on LinkedIn
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </BorderGlow>
                
                {/* Typography Container */}
                <div style={{
                  marginTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '500',
                    color: '#FFFFFF',
                    fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em',
                    margin: '0'
                  }}>
                    Amudi Purba
                  </h3>
                  
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--text-muted-on-dark)',
                    fontFamily: 'Inter, sans-serif',
                    margin: '6px 0 0 0'
                  }}>
                    Information System & Technology at ITB | Based in Bandung, ID
                  </p>
                  
                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      fontSize: '11px',
                      color: '#E2FA6A',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '500',
                      marginTop: '12px',
                      letterSpacing: '0.02em',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleCardFlip()}>
                    ↻ CLICK PHOTO TO FLIP
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
