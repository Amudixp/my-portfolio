import { motion } from 'framer-motion';
import { skills } from '../../data/skills';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const Skills = () => {
  const isSmallScreen = useMediaQuery('(max-width: 767px)');

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
    <section id="skills" style={{ padding: isSmallScreen ? '50px 16px' : '80px 40px', backgroundColor: '#000000' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px', fontWeight: '900', color: '#FFFFFF', margin: '0 0 20px 0', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
            Technical Skills.
          </h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: '#EAB308', borderRadius: '2px', margin: '0 auto' }} />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: isSmallScreen ? 'repeat(auto-fit, minmax(150px, 1fr))' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: isSmallScreen ? '20px' : '30px' }}>
          {skills.map((skillGroup) => (
            <motion.div
              key={skillGroup.category}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(234, 179, 8, 0.15)' }}
              style={{ backgroundColor: '#111111', padding: isSmallScreen ? '20px 16px' : '30px', borderRadius: '12px', border: '1px solid #333333', cursor: 'pointer' }}
            >
              <h3 style={{ fontSize: isSmallScreen ? '16px' : '20px', fontWeight: 'bold', marginBottom: isSmallScreen ? '14px' : '20px', color: '#FFFFFF' }}>
                {skillGroup.category}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {skillGroup.items.map((item, idx) => (
                  <motion.span 
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    style={{ 
                      backgroundColor: '#000000', 
                      color: '#EAB308', 
                      padding: '6px 12px', 
                      borderRadius: '16px',
                      fontSize: '12px'
                    }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};