import { lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ScrollToTop } from './components/common/ScrollToTop';
import { Hero } from './components/sections/Hero';
import { useMediaQuery } from './hooks/useMediaQuery';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const About = lazy(() => import('./components/sections/About').then(m => ({ default: m.About })));
const Experience = lazy(() => import('./components/sections/Experience').then(m => ({ default: m.Experience })));
const Projects = lazy(() => import('./components/sections/Projects').then(m => ({ default: m.Projects })));
const Education = lazy(() => import('./components/sections/Education').then(m => ({ default: m.Education })));
const Contact = lazy(() => import('./components/sections/Contact').then(m => ({ default: m.Contact })));

function MainAppContent() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { theme } = useTheme();

  return (
    <div style={{ 
      backgroundColor: theme === 'light' ? 'var(--bg-page)' : 'var(--bg-page)', 
      color: theme === 'light' ? 'var(--text-primary)' : 'var(--text-primary)', 
      fontFamily: 'var(--font-body)', 
      overflowX: 'hidden', 
      width: '100%', 
      maxWidth: '100vw',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      {/* Skip to Content — Accessibility */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          top: '-100px',
          left: '16px',
          zIndex: 99999,
          backgroundColor: 'var(--accent-green)',
          color: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: '0 0 8px 8px',
          fontWeight: '500',
          fontSize: '14px',
          textDecoration: 'none',
          transition: 'top 0.3s ease',
        }}
        onFocus={(e) => { (e.currentTarget as HTMLAnchorElement).style.top = '0'; }}
        onBlur={(e) => { (e.currentTarget as HTMLAnchorElement).style.top = '-100px'; }}
      >
        Skip to Content
      </a>

      <Navbar />

      <main 
        id="main-content" 
        style={{ 
          paddingLeft: '0px', 
          paddingTop: isDesktop ? '0px' : '65px', 
          overflowX: 'hidden', 
          width: '100%', 
          boxSizing: 'border-box'
        }}>
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>
        <Suspense fallback={null}>
          <ErrorBoundary>
            <About />
          </ErrorBoundary>
          <ErrorBoundary>
            <Experience />
          </ErrorBoundary>
          <ErrorBoundary>
            <Projects />
          </ErrorBoundary>
          <ErrorBoundary>
            <Education />
          </ErrorBoundary>
          <ErrorBoundary>
            <Contact />
          </ErrorBoundary>
        </Suspense>
        <Footer />
      </main>
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
      <Analytics />
    </ThemeProvider>
  );
}

export default App;
