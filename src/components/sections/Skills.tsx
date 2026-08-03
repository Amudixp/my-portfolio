import { useState } from 'react';
import { motion } from 'framer-motion';
import { skills } from '../../data/skills';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useTheme } from '../../context/ThemeContext';

export const Skills = () => {
  const isSmallScreen = useMediaQuery('(max-width: 767px)');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="skills" style={{ padding: isSmallScreen ? '50px 16px' : '80px 40px', backgroundColor: isLight ? '#F8FAFC' : '#000000', transition: 'background-color 0.3s ease' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px', fontWeight: '900', color: isLight ? '#0F172A' : '#FFFFFF', margin: '0 0 20px 0', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
            Technical Skills.
          </h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: isLight ? '#D97706' : '#EAB308', borderRadius: '2px', margin: '0 auto' }} />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: isSmallScreen ? 'repeat(auto-fit, minmax(150px, 1fr))' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: isSmallScreen ? '20px' : '30px' }}>
          {skills.map((skillGroup) => (
            <SkillCard key={skillGroup.category} skillGroup={skillGroup} itemVariants={itemVariants} isSmallScreen={isSmallScreen} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const SkillCard = ({ skillGroup, itemVariants, isSmallScreen }: { skillGroup: typeof skills[0]; itemVariants: any; isSmallScreen: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <motion.div
      variants={itemVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        backgroundColor: isHovered ? (isLight ? '#F1F5F9' : 'rgba(20, 20, 20, 0.95)') : (isLight ? '#FFFFFF' : '#111111'),
        borderColor: isHovered ? (isLight ? '#D97706' : '#EAB308') : (isLight ? '#CBD5E1' : 'rgba(234, 179, 8, 0.2)'),
        boxShadow: isHovered ? (isLight ? '0 12px 30px rgba(217, 119, 6, 0.15)' : '0 12px 30px rgba(234, 179, 8, 0.25)') : (isLight ? '0 4px 12px rgba(0, 0, 0, 0.04)' : '0 4px 12px rgba(0, 0, 0, 0.3)'),
        y: isHovered ? -5 : 0
      }}
      transition={{ duration: 0.3 }}
      style={{
        borderRadius: '14px',
        borderWidth: '1px',
        borderStyle: 'solid',
        padding: isSmallScreen ? '20px 16px' : '28px',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isSmallScreen ? '14px' : '20px' }}>
        <h3 style={{ fontSize: isSmallScreen ? '16px' : '19px', fontWeight: '800', color: isHovered ? (isLight ? '#D97706' : '#EAB308') : (isLight ? '#0F172A' : '#FFFFFF'), margin: 0, transition: 'color 0.3s ease', fontFamily: 'Poppins, sans-serif' }}>
          {skillGroup.category}
        </h3>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {skillGroup.items.map((item, idx) => (
          <motion.span 
            key={item}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.04 }}
            viewport={{ once: true }}
            style={{ 
              backgroundColor: isHovered ? (isLight ? '#FEF3C7' : 'rgba(234, 179, 8, 0.15)') : (isLight ? '#F1F5F9' : '#000000'), 
              color: isHovered ? (isLight ? '#D97706' : '#FDE047') : (isLight ? '#D97706' : '#EAB308'), 
              border: isHovered ? (isLight ? '1px solid #F59E0B' : '1px solid rgba(234, 179, 8, 0.4)') : (isLight ? '1px solid #CBD5E1' : '1px solid rgba(234, 179, 8, 0.25)'), 
              borderRadius: '20px', 
              padding: '6px 14px', 
              fontSize: '13px', 
              fontWeight: '600', 
              fontFamily: 'system-ui, -apple-system, sans-serif',
              transition: 'all 0.2s ease'
            }}
          >
            {item}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};