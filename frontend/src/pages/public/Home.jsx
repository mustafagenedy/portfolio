import Hero from '../../components/sections/Hero';
import About from '../../components/sections/About';
import Projects from '../../components/sections/Projects';
import Experience from '../../components/sections/Experience';
import Skills from '../../components/sections/Skills';
import Contact from '../../components/sections/Contact';
import { useDocTitle } from '../../hooks/useDocTitle';

export default function Home() {
  useDocTitle();
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Skills />
      <Contact />
    </>
  );
}
