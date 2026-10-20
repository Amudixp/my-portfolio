import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, Bookmark, Users, Compass, X } from 'lucide-react';
import { profile } from '../../data/profile';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useTheme } from '../../context/ThemeContext';
import ScrollReveal from '../ui/ScrollReveal';

import tecRecruitment from '../../assets/images/aboutme/tec-recruitment.webp';
import tecComvis from '../../assets/images/aboutme/tec-comvis.webp';
import hmifWispril from '../../assets/images/aboutme/hmif-wispril.webp';
import oskmLapangan from '../../assets/images/aboutme/oskm-lapangan.webp';
import hmifComvis from '../../assets/images/aboutme/hmif-comvis.webp';
import tecComvisMicrosoft from '../../assets/images/aboutme/tec-comvis-microsoft.webp';
import itbAsprak from '../../assets/images/aboutme/itb-asprak.webp';

// Intrinsic dimensions after image optimisation (used as width/height hints).
const ACTIVITY_IMAGE_SIZE: Record<string, { width: number; height: number }> = {
  [tecRecruitment]: { width: 488, height: 868 },
  [tecComvis]: { width: 488, height: 276 },
  [hmifWispril]: { width: 488, height: 651 },
  [oskmLapangan]: { width: 488, height: 868 },
  [hmifComvis]: { width: 488, height: 651 },
  [tecComvisMicrosoft]: { width: 488, height: 651 },
  [itbAsprak]: { width: 488, height: 651 },
};

export const About = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Organization' | 'Event' | 'Visit'>('All');
  const [activeModalItem, setActiveModalItem] = useState<typeof activities[0] | null>(null);
  const isSmallScreen = useMediaQuery('(max-width: 767px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const activities = [
    {
      id: 1,
      category: 'Organization',
      tag: 'LEADERSHIP',
      title: 'Head of Field Division at TEC Recruitment',
      description: 'Directed field operations and ensured seamless execution of recruitment activities for Techno Entrepreneur Club ITB.',
      image: tecRecruitment,
      date: 'OCT 2024'
    },
    {
      id: 2,
      category: 'Visit',
      tag: 'INDUSTRY VISIT',
      title: 'TEC Company Visit to Blibli',
      description: 'Explored tech industry insights and startup scaling strategies during an exclusive company visit to Blibli Indonesia.',
      image: tecComvis,
      date: 'NOV 2024'
    },
    {
      id: 3,
      category: 'Event',
      tag: 'EVENT COMMITTEE',
      title: 'Flag Bearer at HMIF Graduation 2025',
      description: 'Served in the ceremonial flag troop to honor and celebrate the graduating class of Informatics students.',
      image: hmifWispril,
      date: 'JAN 2025'
    },
    {
      id: 4,
      category: 'Event',
      tag: 'CAMPUS EVENT',
      title: 'Field Staff at OSKM ITB 2024',
      description: 'Ensured the safety and smooth execution of field activities. Coordinated logistics and crowd flow.',
      image: oskmLapangan,
      date: 'AUG 2024'
    },
    {
      id: 5,
      category: 'Visit',
      tag: 'INDUSTRY VISIT',
      title: 'HMIF Company Visit to GoTo',
      description: 'Gained industry exposure and networking opportunities during a visit to GoTo headquarters with HMIF ITB.',
      image: hmifComvis,
      date: 'DEC 2024'
    },
    {
      id: 6,
      category: 'Visit',
      tag: 'INDUSTRY VISIT',
      title: 'TEC Company Visit to Microsoft',
      description: 'Discovered enterprise-level technological innovations and professional environments at Microsoft Indonesia.',
      image: tecComvisMicrosoft,
      date: 'FEB 2025'
    },
    {
      id: 7,
      category: 'Organization',
      tag: 'ACADEMIC',
      title: 'Basic Physics Lab Assistant',
      description: 'Guided first-year students through experimental sessions, evaluated lab reports, and demonstrated practical concepts.',
      image: itbAsprak,
      date: 'SEP 2024'
    },
  ];

  // Filter activities based on selected category tab
  const filteredActivities = useMemo(() => {
    if (selectedCategory === 'All') return activities;
    return activities.filter((act) => act.category === selectedCategory);
  }, [selectedCategory]);

  const categoryTabs: Array<{ id: 'All' | 'Organization' | 'Event' | 'Visit'; label: string; icon: any }> = [
    { id: 'All', label: 'POSTS', icon: Grid },
    { id: 'Organization', label: 'ORGANIZATION', icon: Users },
    { id: 'Event', label: 'EVENTS', icon: Compass },
    { id: 'Visit', label: 'VISITS', icon: Bookmark }
  ];

  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section id="about" style={{ padding: isSmallScreen ? '50px 12px' : '90px 40px', backgroundColor: isLight ? 'var(--bg-page)' : 'var(--bg-page)', transition: 'background-color 0.3s ease' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '50px', textAlign: 'center' }}>
          <h2 style={{ fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px', fontWeight: '500', color: isLight ? 'var(--text-primary)' : 'var(--text-primary)', margin: '0 0 16px 0', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em' }}>
            About Me.
          </h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: isLight ? 'var(--accent-green)' : 'var(--accent-green)', borderRadius: '2px', margin: '0 auto 16px auto' }} />
          <p style={{ fontSize: isSmallScreen ? '14px' : '16px', color: isLight ? 'var(--text-secondary)' : 'var(--text-secondary)', margin: 0, fontFamily: 'Inter, sans-serif' }}>
            Driven by curiosity, powered by systems thinking.
          </p>
        </motion.div>

        {/* Top Grid: Bio Statement & Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isSmallScreen ? '1fr' : '1.3fr 0.7fr',
          gap: isSmallScreen ? '24px' : '32px',
          marginBottom: '60px',
          alignItems: 'stretch'
        }}>
          
          {/* Bio Container */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ y: -4, borderColor: 'var(--accent-green)', boxShadow: '0 12px 30px rgba(59, 82, 23, 0.18)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: isLight ? 'var(--surface-card)' : 'var(--surface-card)',
              border: isLight ? '1px solid var(--border-subtle)' : '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: isSmallScreen ? '24px' : '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.06)' : '0 10px 30px rgba(0,0,0,0.4)',
              cursor: 'pointer'
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isLight ? 'var(--accent-green)' : 'var(--accent-green)' }} />
              <span style={{ fontSize: '12px', fontWeight: '500', color: isLight ? 'var(--accent-green)' : 'var(--accent-green)', letterSpacing: '0.3px', textTransform: 'none', fontFamily: 'Inter, sans-serif' }}>
                BACKGROUND & PHILOSOPHY
              </span>
            </div>

            <ScrollReveal
              baseOpacity={0.2}
              enableBlur={true}
              blurStrength={3}
              wordChunkSize={3}
              style={{
                fontSize: isSmallScreen ? '15px' : '18px',
                lineHeight: '1.8',
                color: isLight ? 'var(--text-secondary)' : 'var(--text-secondary)',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {profile.shortBio}
            </ScrollReveal>
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px'
            }}>
            
            <StatCard label="CURRENT CGPA" value="3.64 / 4.00" subtext="128 Academic Credits" valueColor="var(--accent-green)" isLight={isLight} />
            <StatCard label="INSTITUTION" value="ITB" subtext="Class of 2027 (Expected)" valueColor="var(--accent-green)" isLight={isLight} />
            <StatCard label="CORE FOCUS" value="AI & Engineering" subtext="AI Systems, SDLC & STLC Focus" valueColor="var(--accent-green)" isLight={isLight} />
            <StatCard label="LOCATION" value="Bandung, ID" subtext="Open to Remote & On-site" valueColor="var(--accent-green)" isLight={isLight} />

          </motion.div>
        </div>

        {/* INSTAGRAM STYLE CAMPUS LIFE GALLERY */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: '500', color: isLight ? 'var(--accent-green)' : 'var(--accent-green)', letterSpacing: '0.3px', textTransform: 'none', fontFamily: 'Inter, sans-serif' }}>
              @AMUDIPURBA FEED
            </span>
            <h3 style={{ fontSize: isSmallScreen ? '22px' : '28px', fontWeight: '500', color: isLight ? 'var(--text-primary)' : 'var(--text-primary)', margin: '4px 0 0 0', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em' }}>
              Campus Life & Exposure
            </h3>
          </div>

          {/* Instagram Web Tab Navigation Header */}
          <div style={{
            display: 'flex',
            justifyContent: isSmallScreen ? 'flex-start' : 'center',
            alignItems: 'center',
            borderTop: isLight ? '1px solid var(--border-subtle)' : '1px solid var(--border-subtle)',
            marginBottom: '4px',
            overflowX: 'auto',
            maxWidth: '100%',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}>
            <div style={{
              display: 'flex',
              gap: isSmallScreen ? '18px' : '40px',
              flexShrink: 0
            }}>
              {categoryTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isSelected = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderTop: isSelected ? '2px solid var(--accent-green)' : '2px solid transparent',
                      padding: '14px 4px 10px 4px',
                      minHeight: '44px',
                      color: isSelected ? (isLight ? 'var(--text-primary)' : 'var(--text-primary)') : (isLight ? 'var(--text-secondary)' : 'var(--text-secondary)'),
                      fontSize: '12px',
                      fontWeight: '500',
                      letterSpacing: '0.2px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.color = 'var(--text-secondary)';
                    }}>
                    <IconComponent size={14} color={isSelected ? (isLight ? 'var(--accent-green)' : 'var(--accent-green)') : (isLight ? 'var(--text-secondary)' : 'var(--text-secondary)')} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instagram Photo Grid: 5 Columns on Laptop, 3 Columns on Mobile */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isSmallScreen ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
            gap: isSmallScreen ? '6px' : '10px',
            backgroundColor: isLight ? 'var(--bg-page)' : 'var(--bg-page)',
            paddingTop: '4px',
            transition: 'background-color 0.3s ease'
          }}>
            {filteredActivities.map((act) => (
              <InstagramTile
                key={act.id}
                activity={act}
                onClick={() => setActiveModalItem(act)}
              />
            ))}
          </div>

        </motion.div>

        {/* Instagram Post Detail Modal Popup */}
        <AnimatePresence>
          {activeModalItem && (
            <InstagramModal
              activity={activeModalItem}
              onClose={() => setActiveModalItem(null)}
              isDesktop={isDesktop}
            />
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

// Clean Instagram Photo Square Tile Component (No overlay icons / no metrics)
const InstagramTile = ({
  activity,
  onClick
}: {
  activity: {
    id: number;
    category: string;
    tag: string;
    title: string;
    description: string;
    image: string;
  };
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '100%', // 1:1 Aspect Ratio Square
        backgroundColor: isLight ? 'var(--surface-card)' : 'var(--surface-card)',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer'
      }}>
      {/* Photo Image */}
      <img
        src={activity.image}
        alt={activity.title}
        width={ACTIVITY_IMAGE_SIZE[activity.image]?.width ?? 488}
        height={ACTIVITY_IMAGE_SIZE[activity.image]?.height ?? 651}
        loading="lazy"
        decoding="async"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.3s ease'
        }}
      />

      {/* Clean Subtle Dark Overlay on Hover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(28, 42, 7, 0.35)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
          zIndex: 3
        }}
      />
    </div>
  );
};

// Post Detail Modal Component - Displays Title & Description only
const InstagramModal = ({
  activity,
  onClose,
  isDesktop
}: {
  activity: any;
  onClose: () => void;
  isDesktop: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(17, 17, 17, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isDesktop ? '40px' : '16px'
      }}>
      
      {/* Close Button */}
      <button
        onClick={onClose}
        aria-label="Tutup pratinjau aktivitas"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '44px',
          height: '44px',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#FFFFFF',
          cursor: 'pointer',
          zIndex: 100000
        }}>
        <X size={32} />
      </button>

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface-dark)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '16px',
          overflowY: 'auto',
          maxWidth: '1000px',
          width: '100%',
          maxHeight: '90vh',
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1.2fr 0.8fr' : '1fr',
          alignContent: 'start',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
        }}>
        
        {/* Left Side: Photo */}
        <div style={{
          backgroundColor: 'var(--surface-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: isDesktop ? '500px' : '200px',
          maxHeight: isDesktop ? '70vh' : '45vh'
        }}>
          <img
            src={activity.image}
            alt={activity.title}
            width={ACTIVITY_IMAGE_SIZE[activity.image]?.width ?? 488}
            height={ACTIVITY_IMAGE_SIZE[activity.image]?.height ?? 651}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              maxHeight: isDesktop ? '70vh' : '45vh'
            }}
          />
        </div>

        {/* Right Side: Title & Description Only */}
        <div style={{
          padding: isDesktop ? '36px 30px' : '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderLeft: isDesktop ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          overflowY: 'auto'
        }}>
          <div>
            <h4 style={{ fontSize: isDesktop ? '22px' : '18px', fontWeight: '500', color: 'var(--text-on-dark)', margin: '0 0 16px 0', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em', lineHeight: '1.4' }}>
              {activity.title}
            </h4>
            <p style={{ fontSize: isDesktop ? '15px' : '14px', color: 'var(--text-muted-on-dark)', lineHeight: '1.8', margin: 0, fontFamily: 'Inter, sans-serif' }}>
              {activity.description}
            </p>
          </div>
        </div>

      </motion.div>

    </motion.div>
  );
};

const StatCard = ({ label, value, subtext, valueColor, isLight = false }: { label: string; value: string; subtext: string; valueColor: string; isLight?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        backgroundColor: isHovered ? (isLight ? 'var(--surface-pill)' : 'var(--surface-pill)') : (isLight ? 'var(--surface-card)' : 'var(--surface-card)'),
        borderColor: isHovered ? (isLight ? 'var(--accent-green)' : 'var(--accent-green)') : (isLight ? 'var(--border-subtle)' : 'var(--border-subtle)'),
        boxShadow: isHovered ? '0 10px 25px rgba(59, 82, 23, 0.18)' : 'none',
        y: isHovered ? -4 : 0
      }}
      transition={{ duration: 0.2 }}
      style={{
        borderRadius: '14px',
        borderWidth: '1px',
        borderStyle: 'solid',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        cursor: 'pointer'
      }}>
      <span style={{ fontSize: '11px', color: isLight ? 'var(--text-secondary)' : 'var(--text-secondary)', fontWeight: '500', textTransform: 'none', letterSpacing: '0.2px' }}>
        {label}
      </span>
      <span style={{ fontSize: '20px', fontWeight: '500', color: isHovered ? (isLight ? 'var(--text-primary)' : 'var(--text-primary)') : valueColor, marginTop: '6px', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em', transition: 'color 0.2s' }}>
        {value}
      </span>
      <span style={{ fontSize: '11px', color: isLight ? 'var(--text-secondary)' : 'var(--text-secondary)', marginTop: '4px' }}>
        {subtext}
      </span>
    </motion.div>
  );
};
