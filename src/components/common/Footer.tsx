import { profile } from '../../data/profile';
import { useTheme } from '../../context/ThemeContext';

export const Footer = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <footer style={{ 
      backgroundColor: isLight ? '#FFFFFF' : '#000000', 
      padding: '30px 20px', 
      borderTop: isLight ? '1px solid #E2E8F0' : '1px solid #333333', 
      textAlign: 'center',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <p style={{ color: isLight ? '#475569' : '#94a3b8', fontSize: '14px' }}>
        Designed & Built by <span style={{ color: isLight ? '#D97706' : '#EAB308', fontWeight: 'bold' }}>{profile.name}</span>
      </p>
      <p style={{ color: isLight ? '#94A3B8' : '#64748b', fontSize: '12px', marginTop: '10px' }}>
        © {new Date().getFullYear()} All Rights Reserved.
      </p>
    </footer>
  );
};
