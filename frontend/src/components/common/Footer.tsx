import { profile } from '../../data/profile';
import { useTheme } from '../../context/ThemeContext';

export const Footer = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <footer style={{ 
      backgroundColor: isLight ? 'var(--bg-page-light)' : 'var(--bg-page-light)', 
      padding: '30px 20px', 
      borderTop: isLight ? '1px solid var(--border-subtle)' : '1px solid var(--border-subtle)', 
      textAlign: 'center',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <p style={{ color: isLight ? 'var(--text-secondary)' : 'var(--text-secondary)', fontSize: '14px' }}>
        Designed & Built by <span style={{ color: 'var(--accent-green)', fontWeight: '500' }}>{profile.name}</span>
      </p>
      <p style={{ color: isLight ? 'var(--text-secondary)' : 'var(--text-secondary)', fontSize: '12px', marginTop: '10px' }}>
        © {new Date().getFullYear()} All Rights Reserved.
      </p>
    </footer>
  );
};
