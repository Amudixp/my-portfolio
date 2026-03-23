import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';
import { profile } from '../../data/profile';
import profileImage from '../../assets/images/profil.jpg';
import qrLinkedin from '../../assets/images/qr-linkedin.png';
import BorderGlow from '../ui/BorderGlow';

export const Contact = () => {
  const [isSmallScreen, setIsSmallScreen] = React.useState(window.innerWidth < 768);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isFlipping, setIsFlipping] = React.useState(false);
  const contactSectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle border animation sync during flip
  const handleCardFlip = () => {
    setIsFlipping(true);
    setIsFlipped(!isFlipped);
    // Resume animation after flip completes (0.6s)
    setTimeout(() => {
      setIsFlipping(false);
    }, 600);
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
    <section id="contact" ref={contactSectionRef} style={{ padding: isSmallScreen ? '60px 16px' : '90px 40px', backgroundColor: '#000000', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background Decorative Elements */}
      {!isSmallScreen && (
      <svg style={{ position: 'absolute', top: '0', right: '0', opacity: 0.05, width: '400px', height: '400px', pointerEvents: 'none' }} viewBox="0 0 200 200">
        <defs>
          <linearGradient id="codeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#d4a000" />
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
          <h2 style={{ fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 20px 0', fontFamily: 'Poppins, sans-serif' }}>
            Get In Touch.
          </h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: '#EAB308', borderRadius: '2px', margin: '0 auto' }} />
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
            <h1 style={{
              fontSize: isSmallScreen ? 'clamp(24px, 6vw, 32px)' : '56px',
              fontWeight: '900',
              color: '#FFFFFF',
              fontFamily: 'Poppins, sans-serif',
              lineHeight: '1.1',
              marginBottom: '40px',
              textAlign: isSmallScreen ? 'center' : 'left'
            }}>
              LET'S BUILD
              <br />
              SOLUTIONS
              <br />
              TOGETHER.
            </h1>

            {/* Description */}
            <p style={{
              color: '#A3A3A3',
              fontSize: isSmallScreen ? '14px' : '16px',
              lineHeight: '1.8',
              marginBottom: '40px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textAlign: isSmallScreen ? 'center' : 'left'
            }}>
              Saya selalu terbuka untuk diskusi mengenai peluang magang Data/AI, proyek kolaborasi, atau sekadar menyapa. Kotak masuk saya selalu terbuka!
            </p>

            {/* Primary CTA */}
            <motion.div style={{ marginBottom: '30px', display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start' }}>
              <motion.a 
                href={profile.resume || `mailto:${profile.email}`}
                target={profile.resume ? "_blank" : "_self"}
                rel={profile.resume ? "noreferrer" : ""}
                whileHover={{ scale: 1.05, boxShadow: '0 15px 40px rgba(234, 179, 8, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  backgroundColor: '#EAB308',
                  color: '#000000',
                  padding: isSmallScreen ? '12px 24px' : '14px 32px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: '900',
                  fontSize: isSmallScreen ? '12px' : '15px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'Poppins, sans-serif'
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
                  border: '2px solid #4B5563',
                  color: '#9CA3AF',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'transparent',
                  boxShadow: '0 0 0px rgba(234, 179, 8, 0)'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#EAB308';
                  (e.currentTarget as HTMLElement).style.color = '#EAB308';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(234, 179, 8, 0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#4B5563';
                  (e.currentTarget as HTMLElement).style.color = '#9CA3AF';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0px rgba(234, 179, 8, 0)';
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
                  border: '2px solid #4B5563',
                  color: '#9CA3AF',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'transparent',
                  boxShadow: '0 0 0px rgba(234, 179, 8, 0)'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#EAB308';
                  (e.currentTarget as HTMLElement).style.color = '#EAB308';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(234, 179, 8, 0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#4B5563';
                  (e.currentTarget as HTMLElement).style.color = '#9CA3AF';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0px rgba(234, 179, 8, 0)';
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
                  border: '2px solid #4B5563',
                  color: '#9CA3AF',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'transparent',
                  boxShadow: '0 0 0px rgba(234, 179, 8, 0)'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#EAB308';
                  (e.currentTarget as HTMLElement).style.color = '#EAB308';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(234, 179, 8, 0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#4B5563';
                  (e.currentTarget as HTMLElement).style.color = '#9CA3AF';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0px rgba(234, 179, 8, 0)';
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
                  background: 'radial-gradient(circle, rgba(234, 179, 8, 0.08) 0%, transparent 70%)',
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
                  glowColor="45 95% 50%"
                  colors={['#ca8a04', '#eab308', '#fef08a']}
                  backgroundColor="#000000"
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
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                        backgroundColor: 'transparent',
                        cursor: 'pointer'
                      }}>
                      
                      {/* Photo */}
                      <img
                        src={profileImage}
                        alt="Amudi Purba"
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
                        backgroundColor: 'rgba(20, 20, 25, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        padding: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        backfaceVisibility: 'hidden',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
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
                        style={{
                          width: '160px',
                          height: '160px',
                          border: '3px solid #EAB308',
                          borderRadius: '12px',
                          backgroundColor: '#FFFFFF',
                          padding: '10px',
                          objectFit: 'contain'
                        }}
                      />

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: '#EAB308', fontWeight: '800', fontFamily: 'Poppins, sans-serif', marginBottom: '6px' }}>
                          SCAN ME
                        </div>
                        <div style={{ fontSize: '11px', color: '#A3A3A3', fontFamily: 'system-ui, sans-serif' }}>
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
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    fontFamily: 'Poppins, sans-serif',
                    margin: '0'
                  }}>
                    Amudi Purba
                  </h3>
                  
                  <p style={{
                    fontSize: '14px',
                    color: '#A3A3A3',
                    fontFamily: 'system-ui, sans-serif',
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
                      color: '#EAB308',
                      fontFamily: 'monospace',
                      fontWeight: '600',
                      marginTop: '16px',
                      letterSpacing: '0.05em',
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
                  glowColor="45 95% 50%"
                  colors={['#ca8a04', '#eab308', '#fef08a']}
                  backgroundColor="#000000"
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
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                        backgroundColor: 'transparent'
                      }}>
                      
                      {/* Photo */}
                      <img
                        src={profileImage}
                        alt="Amudi Purba"
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
                        backgroundColor: 'rgba(20, 20, 25, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '14px',
                        backfaceVisibility: 'hidden',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        rotateY: '180deg'
                      }}>
                      
                      {/* QR Code Image */}
                      <img
                        src={qrLinkedin}
                        alt="LinkedIn QR Code"
                        style={{
                          width: '120px',
                          height: '120px',
                          border: '2px solid rgba(234, 179, 8, 0.7)',
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          objectFit: 'contain'
                        }}
                      />

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: '700', marginBottom: '4px', fontFamily: 'Poppins, sans-serif' }}>
                          SCAN ME
                        </div>
                        <div style={{ fontSize: '11px', color: '#A3A3A3', fontFamily: 'Poppins, sans-serif' }}>
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
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    fontFamily: 'Poppins, sans-serif',
                    margin: '0'
                  }}>
                    Amudi Purba
                  </h3>
                  
                  <p style={{
                    fontSize: '12px',
                    color: '#A3A3A3',
                    fontFamily: 'system-ui, sans-serif',
                    margin: '6px 0 0 0'
                  }}>
                    Information System & Technology at ITB | Based in Bandung, ID
                  </p>
                  
                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      fontSize: '11px',
                      color: '#EAB308',
                      fontFamily: 'monospace',
                      fontWeight: '600',
                      marginTop: '12px',
                      letterSpacing: '0.05em',
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