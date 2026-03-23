import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Projects } from './components/sections/Projects';
import { Experience } from './components/sections/Experience';
import { Education } from './components/sections/Education';
import { Contact } from './components/sections/Contact';

function App() {
  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', fontFamily: 'sans-serif', overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
      <Navbar />
      <main style={{ paddingTop: '80px', overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;