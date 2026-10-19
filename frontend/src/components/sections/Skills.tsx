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
    <section id="skills" style={{ padding: isSmallScreen ? '50px 16px' : '80px 40px', backgroundColor: isLight ? 'var(--bg-page)' : 'var(--bg-page)', transition: 'background-color 0.3s ease' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px', fontWeight: '500', color: isLight ? 'var(--text-primary)' : 'var(--text-primary)', margin: '0 0 20px 0', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em', textAlign: 'center' }}>
            Technical Skills.
          </h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: isLight ? 'var(--accent-green)' : 'var(--accent-green)', borderRadius: '2px', margin: '0 auto' }} />
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
        backgroundColor: isHovered ? (isLight ? 'var(--surface-pill)' : 'var(--surface-pill)') : (isLight ? 'var(--surface-card)' : 'var(--surface-card)'),
        borderColor: isHovered ? (isLight ? 'var(--accent-green)' : 'var(--accent-green)') : (isLight ? 'var(--border-subtle)' : 'var(--border-subtle)'),
        boxShadow: isHovered ? '0 12px 30px rgba(59, 82, 23, 0.18)' : '0 4px 12px rgba(0, 0, 0, 0.05)',
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
        <h3 style={{ fontSize: isSmallScreen ? '16px' : '19px', fontWeight: '500', color: isHovered ? (isLight ? 'var(--accent-green)' : 'var(--accent-green)') : (isLight ? 'var(--text-primary)' : 'var(--text-primary)'), margin: 0, transition: 'color 0.3s ease', fontFamily: 'Inter Tight, sans-serif', letterSpacing: '-0.02em' }}>
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
              backgroundColor: isHovered ? (isLight ? 'var(--surface-pill)' : 'var(--surface-pill)') : (isLight ? 'var(--surface-pill)' : 'var(--surface-pill)'), 
              color: isHovered ? (isLight ? 'var(--accent-green)' : 'var(--accent-green)') : (isLight ? 'var(--accent-green)' : 'var(--accent-green)'), 
              border: isHovered ? (isLight ? '1px solid var(--accent-green)' : '1px solid var(--accent-green)') : (isLight ? '1px solid var(--border-subtle)' : '1px solid var(--border-subtle)'), 
              borderRadius: '20px', 
              padding: '6px 14px', 
              fontSize: '13px', 
              fontWeight: '500', 
              fontFamily: 'Inter, sans-serif',
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