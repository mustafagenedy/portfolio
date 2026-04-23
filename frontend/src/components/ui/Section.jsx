import { motion } from 'framer-motion';

/** Reusable section wrapper: id, fade-up on scroll, standardized padding. */
export default function Section({ id, title, eyebrow, children, className = '' }) {
  return (
    <section id={id} className={`py-24 px-6 md:px-10 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {(eyebrow || title) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-14"
          >
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white">
                {title}
              </h2>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
