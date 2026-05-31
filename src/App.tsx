import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ScrollToTop } from './components/common/ScrollToTop';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Projects } from './components/sections/Projects';
import { Experience } from './components/sections/Experience';
import { Education } from './components/sections/Education';
import { Contact } from './components/sections/Contact';

function App() {
  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', fontFamily: 'sans-serif', overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
      {/* Skip to Content — Accessibility: lets keyboard users jump past the navbar */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          top: '-100px',
          left: '16px',
          zIndex: 99999,
          backgroundColor: '#EAB308',
          color: '#000000',
          padding: '12px 24px',
          borderRadius: '0 0 8px 8px',
          fontWeight: '700',
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
      <main id="main-content" style={{ paddingTop: '80px', overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>
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
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;