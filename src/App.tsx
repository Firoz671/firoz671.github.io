import { profile } from './data/portfolio';
import { Header } from './components/sections/Header';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { EducationCertifications } from './components/sections/EducationCertifications';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/sections/Footer';

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-canvas shadow-card transition-transform focus:translate-y-0"
      >
        {profile.ui.skipToContent}
      </a>

      <Header />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <EducationCertifications />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
