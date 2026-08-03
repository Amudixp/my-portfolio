import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, Bookmark, Users, Compass, X } from 'lucide-react';
import { profile } from '../../data/profile';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useTheme } from '../../context/ThemeContext';
import ScrollReveal from '../ui/ScrollReveal';

import tecRecruitment from '../../assets/images/aboutme/tec-recruitment.jpeg';
import tecComvis from '../../assets/images/aboutme/tec-comvis.jpeg';
import hmifWispril from '../../assets/images/aboutme/hmif-wispril.jpeg';
import oskmLapangan from '../../assets/images/aboutme/oskm-lapangan.jpeg';
import hmifComvis from '../../assets/images/aboutme/hmif-comvis.jpeg';
import tecComvisMicrosoft from '../../assets/images/aboutme/tec-comvis-microsoft.jpeg';
import itbAsprak from '../../assets/images/aboutme/itb-asprak.jpeg';

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
    <section id="about" style={{ padding: isSmallScreen ? '50px 12px' : '90px 40px', backgroundColor: isLight ? '#F8FAFC' : '#000000', transition: 'background-color 0.3s ease' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '50px', textAlign: 'center' }}>
          <h2 style={{ fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px', fontWeight: '900', color: isLight ? '#0F172A' : '#FFFFFF', margin: '0 0 16px 0', fontFamily: 'Poppins, sans-serif' }}>
            About Me.
          </h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: isLight ? '#D97706' : '#EAB308', borderRadius: '2px', margin: '0 auto 16px auto' }} />
          <p style={{ fontSize: isSmallScreen ? '14px' : '16px', color: isLight ? '#64748B' : '#9CA3AF', margin: 0, fontFamily: 'Inter, sans-serif' }}>
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
            whileHover={{ y: -4, borderColor: isLight ? '#D97706' : '#EAB308', boxShadow: isLight ? '0 12px 30px rgba(217, 119, 6, 0.15)' : '0 12px 30px rgba(234, 179, 8, 0.2)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: isLight ? '#FFFFFF' : '#111111',
              border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(234, 179, 8, 0.25)',
              borderRadius: '16px',
              padding: isSmallScreen ? '24px' : '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.06)' : '0 10px 30px rgba(0,0,0,0.4)',
              cursor: 'pointer'
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isLight ? '#D97706' : '#EAB308' }} />
              <span style={{ fontSize: '12px', fontWeight: '800', color: isLight ? '#D97706' : '#EAB308', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                BACKGROUND & PHILOSOPHY
              </span>
            </div>

            <ScrollReveal
              baseOpacity={0.2}
              enableBlur={true}
              blurStrength={3}
              style={{
                fontSize: isSmallScreen ? '15px' : '18px',
                lineHeight: '1.8',
                color: isLight ? '#1E293B' : '#E5E7EB',
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
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
            
            <StatCard label="CURRENT CGPA" value="3.64 / 4.00" subtext="128 Academic Credits" valueColor={isLight ? '#D97706' : '#EAB308'} isLight={isLight} />
            <StatCard label="INSTITUTION" value="ITB" subtext="Class of 2027 (Expected)" valueColor={isLight ? '#0F172A' : '#FFFFFF'} isLight={isLight} />
            <StatCard label="CORE FOCUS" value="AI & Engineering" subtext="AI Systems, SDLC & STLC Focus" valueColor={isLight ? '#0F172A' : '#FFFFFF'} isLight={isLight} />
            <StatCard label="LOCATION" value="Bandung, ID" subtext="Open to Remote & On-site" valueColor={isLight ? '#D97706' : '#EAB308'} isLight={isLight} />

          </motion.div>
        </div>

        {/* INSTAGRAM STYLE CAMPUS LIFE GALLERY */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: isLight ? '#D97706' : '#EAB308', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              @AMUDIPURBA FEED
            </span>
            <h3 style={{ fontSize: isSmallScreen ? '22px' : '28px', fontWeight: '800', color: isLight ? '#0F172A' : '#FFFFFF', margin: '4px 0 0 0', fontFamily: 'Poppins, sans-serif' }}>
              Campus Life & Exposure
            </h3>
          </div>

          {/* Instagram Web Tab Navigation Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderTop: isLight ? '1px solid #CBD5E1' : '1px solid rgba(255, 255, 255, 0.12)',
            marginBottom: '4px'
          }}>
            <div style={{
              display: 'flex',
              gap: isSmallScreen ? '20px' : '40px'
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
                      borderTop: isSelected ? (isLight ? '2px solid #D97706' : '2px solid #EAB308') : '2px solid transparent',
                      padding: '14px 4px 10px 4px',
                      color: isSelected ? (isLight ? '#0F172A' : '#FFFFFF') : (isLight ? '#64748B' : '#8E8E8E'),
                      fontSize: '12px',
                      fontWeight: '700',
                      letterSpacing: '1px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.color = isLight ? '#0F172A' : '#D1D5DB';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.color = isLight ? '#64748B' : '#8E8E8E';
                    }}>
                    <IconComponent size={14} color={isSelected ? (isLight ? '#D97706' : '#EAB308') : (isLight ? '#64748B' : '#8E8E8E')} />
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
            backgroundColor: isLight ? '#F8FAFC' : '#000000',
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
        backgroundColor: isLight ? '#E2E8F0' : '#111111',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer'
      }}>
      {/* Photo Image */}
      <img
        src={activity.image}
        alt={activity.title}
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
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
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
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
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
          backgroundColor: '#000000',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          overflow: 'hidden',
          maxWidth: '1000px',
          width: '100%',
          maxHeight: '90vh',
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1.2fr 0.8fr' : '1fr',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
        }}>
        
        {/* Left Side: Photo */}
        <div style={{
          backgroundColor: '#050505',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: isDesktop ? '500px' : '300px',
          maxHeight: '70vh'
        }}>
          <img
            src={activity.image}
            alt={activity.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              maxHeight: '70vh'
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
            <h4 style={{ fontSize: isDesktop ? '22px' : '18px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 16px 0', fontFamily: 'Poppins, sans-serif', lineHeight: '1.4' }}>
              {activity.title}
            </h4>
            <p style={{ fontSize: isDesktop ? '15px' : '14px', color: '#D1D5DB', lineHeight: '1.8', margin: 0, fontFamily: 'Inter, sans-serif' }}>
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
        backgroundColor: isLight ? (isHovered ? '#F1F5F9' : '#FFFFFF') : (isHovered ? 'rgba(20, 20, 20, 0.95)' : '#111111'),
        borderColor: isHovered ? (isLight ? '#D97706' : '#EAB308') : (isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.1)'),
        boxShadow: isHovered ? (isLight ? '0 10px 25px rgba(217, 119, 6, 0.15)' : '0 10px 25px rgba(234, 179, 8, 0.2)') : (isLight ? '0 4px 12px rgba(0,0,0,0.03)' : 'none'),
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
      <span style={{ fontSize: '11px', color: isLight ? '#64748B' : '#9CA3AF', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {label}
      </span>
      <span style={{ fontSize: '20px', fontWeight: '900', color: isHovered ? (isLight ? '#D97706' : '#EAB308') : valueColor, marginTop: '6px', fontFamily: 'Poppins, sans-serif', transition: 'color 0.2s' }}>
        {value}
      </span>
      <span style={{ fontSize: '11px', color: isLight ? '#94A3B8' : '#6B7280', marginTop: '4px' }}>
        {subtext}
      </span>
    </motion.div>
  );
};
