import { profile } from '../../data/profile';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#000000', padding: '30px 20px', borderTop: '1px solid #333333', textAlign: 'center' }}>
      <p style={{ color: '#94a3b8', fontSize: '14px' }}>
        Designed & Built by <span style={{ color: '#EAB308', fontWeight: 'bold' }}>{profile.name}</span>
      </p>
      <p style={{ color: '#64748b', fontSize: '12px', marginTop: '10px' }}>
        © {new Date().getFullYear()} All Rights Reserved.
      </p>
    </footer>
  );
};