import React from 'react';
import { motion } from 'framer-motion';
import { profile } from '../../data/profile';
import ScrollReveal from '../ui/ScrollReveal';
import tecRecruitment from '../../assets/images/aboutme/tec-recruitment.jpeg';
import tecComvis from '../../assets/images/aboutme/tec-comvis.jpeg';
import hmifWispril from '../../assets/images/aboutme/hmif-wispril.jpeg';
import oskmLapangan from '../../assets/images/aboutme/oskm-lapangan.jpeg';
import hmifComvis from '../../assets/images/aboutme/hmif-comvis.jpeg';
import tecComvisMicrosoft from '../../assets/images/aboutme/tec-comvis-microsoft.jpeg';
import itbAsprak from '../../assets/images/aboutme/itb-asprak.jpeg';
import inkamOskm from '../../assets/images/aboutme/inkam-oskm.JPG?url';

export const About = () => {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [isSmallScreen, setIsSmallScreen] = React.useState(window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const experiences = [
    {
      tag: '✦ LEADERSHIP',
      title: 'Head of Field Division at TEC Recruitment',
      description: 'Directed field operations and ensured seamless execution of recruitment activities for Techno Entrepreneur Club ITB.',
      image: tecRecruitment,
      bgImage: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)'
    },
    {
      tag: '✦ INDUSTRY VISIT',
      title: 'TEC Company Visit to Blibli',
      description: 'Explored tech industry insights and startup scaling strategies during an exclusive company visit to Blibli Indonesia.',
      image: tecComvis,
      bgImage: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)'
    },
    {
      tag: '✦ EVENT COMMITTEE',
      title: 'Flag Bearer at HMIF Graduation 2025',
      description: 'Served in the ceremonial flag troop to honor and celebrate the graduating class of Informatics students.',
      image: hmifWispril,
      bgImage: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)'
    },
    {
      tag: '✦ ACTIVITIES',
      title: 'Field Staff at OSKM ITB 2024',
      description: 'Ensured the safety and smooth execution of field activities. Coordinated logistics and crowd flow.',
      image: oskmLapangan,
      bgImage: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)'
    },
    {
      tag: '✦ INDUSTRY VISIT',
      title: 'HMIF Company Visit to GoTo',
      description: 'Gained industry exposure and networking opportunities during a visit to GoTo headquarters with HMIF ITB.',
      image: hmifComvis,
      bgImage: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)'
    },
    {
      tag: '✦ INDUSTRY VISIT',
      title: 'TEC Company Visit to Microsoft',
      description: 'Discovered enterprise-level technological innovations and professional environments at Microsoft Indonesia.',
      image: tecComvisMicrosoft,
      bgImage: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)'
    },
    {
      tag: '✦ ACADEMIC',
      title: 'Basic Physics Lab Assistant',
      description: 'Guided first-year students through experimental sessions, evaluated lab reports, and demonstrated practical concepts.',
      image: itbAsprak,
      bgImage: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)'
    },
    {
      tag: '✦ ORGANIZATION',
      title: 'HMIF Intracampus Introduction',
      description: 'Represented the Informatics Student Union (HMIF) to introduce organizational culture to new students during OSKM ITB.',
      image: inkamOskm,
      bgImage: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)'
    }
  ];

  return (
    <section id="about" style={{ padding: isSmallScreen ? '60px 20px' : '80px 40px', backgroundColor: '#000000', minHeight: 'auto' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Section Header with ScrollReveal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 20px 0', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
            About Me.
          </h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: '#EAB308', borderRadius: '2px', margin: '0 auto' }} />
        </motion.div>

        {/* Activities Card and Bio Text - Side by Side */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isSmallScreen ? '1fr' : '1fr 1fr',
          gap: isSmallScreen ? '40px' : '60px',
          alignItems: 'center',
          marginBottom: '80px',
          marginTop: '20px'
        }}>
          {/* Left: Activities Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              backgroundColor: '#111111',
              boxShadow: 'inset 0 0 0 1px rgba(234, 179, 8, 0.2)',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              backgroundImage: `url(${experiences[activeSlide].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              minHeight: isSmallScreen ? '450px' : '700px'
            }}>
            
            {/* Navigation Arrows */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setActiveSlide((prev) => (prev - 1 + experiences.length) % experiences.length)}
                style={{
                  width: isSmallScreen ? '36px' : '40px',
                  height: isSmallScreen ? '36px' : '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: isSmallScreen ? '14px' : '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(234, 179, 8, 0.8)'; }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.6)'; }}>
                ‹
              </button>
              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % experiences.length)}
                style={{
                  width: isSmallScreen ? '36px' : '40px',
                  height: isSmallScreen ? '36px' : '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: isSmallScreen ? '14px' : '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(234, 179, 8, 0.8)'; }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.6)'; }}>
                ›
              </button>
            </div>

            {/* 1. Pure Gradient Background Layer (Separated) */}
            <div style={{
              position: 'absolute',
              bottom: '-1px',
              left: '-1px',
              right: '-1px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.2) 70%, transparent 100%)',
              height: 'calc(55% + 1px)',
              pointerEvents: 'none',
              zIndex: 1
            }} />

            {/* 2. Text Content Container Layer (Sitting on top of the gradient) */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              padding: '0 24px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              height: '55%',
              zIndex: 10
            }}>
              
              {/* Inner Wrappers for spacing without breaking layout */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Activity Label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#EAB308', letterSpacing: '1px' }}>
                    {experiences[activeSlide].tag}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 12px 0' }}>
                    {experiences[activeSlide].title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#A3A3A3', lineHeight: '1.6', margin: 0 }}>
                    {experiences[activeSlide].description}
                  </p>
                </div>

                {/* Pagination Dots */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '8px' }}>
                  {experiences.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        width: index === activeSlide ? '24px' : '6px',
                        height: '6px',
                        backgroundColor: index === activeSlide ? '#EAB308' : '#555555',
                        borderRadius: '3px',
                        transition: 'all 0.3s',
                        cursor: 'pointer'
                      }}
                      onClick={() => setActiveSlide(index)}
                    />
                  ))}
                </div>
                
              </div>
            </div>
          </motion.div>

          {/* Right: ScrollReveal Component */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', minHeight: isSmallScreen ? 'auto' : '700px' }}>
            <ScrollReveal 
              baseOpacity={0.1} 
              enableBlur={true} 
              baseRotation={2} 
              blurStrength={4}
              textClassName="text-neutral-300 font-sans tracking-tight"
              containerClassName='text-[clamp(1.8rem,4vw,2.5rem)] leading-relaxed'
            >
              {profile.shortBio}
            </ScrollReveal>
          </motion.div>
        </div>

      </div>
    </section>
  );
};