import { motion } from 'framer-motion';
import { FiArrowRight, FiDownload, FiMail } from 'react-icons/fi';
import { profile } from '../../config/portfolio';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-6 pt-16 overflow-hidden"
    >
      {/* Animated gradient backdrop — pure CSS, GPU-friendly */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bg via-white to-bg dark:from-bg-dark dark:via-surface-dark dark:to-bg-dark" />
        <div
          aria-hidden
          className="blob-1 absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #1D546C 0%, transparent 70%)' }}
        />
        <div
          aria-hidden
          className="blob-2 absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #0C2B4E 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs md:text-sm uppercase tracking-[0.25em] text-accent font-semibold mb-6"
        >
          {profile.location} — Available for work
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary dark:text-white leading-tight tracking-tight"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-lg md:text-xl text-muted font-medium"
        >
          {profile.title}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 max-w-2xl mx-auto text-base md:text-lg text-muted leading-relaxed"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button as="a" href="#projects" variant="primary">
            View Projects <FiArrowRight size={16} />
          </Button>
          <Button as="a" href="#contact" variant="secondary">
            <FiMail size={16} /> Contact Me
          </Button>
          <Button as="a" href={profile.cv} download variant="ghost">
            <FiDownload size={16} /> Download CV
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
