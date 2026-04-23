import { motion } from 'framer-motion';
import Section from '../ui/Section';
import { experience } from '../../config/portfolio';

export default function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="What I've shipped.">
      <div className="relative max-w-3xl">
        {/* Timeline spine */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-accent/30 to-transparent" />

        <div className="space-y-10">
          {experience.map((e, i) => (
            <motion.div
              key={`${e.role}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative pl-14"
            >
              {/* Node */}
              <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-white dark:bg-surface-dark border-2 border-accent flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-accent" />
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <h3 className="text-lg md:text-xl font-bold text-primary dark:text-white">
                  {e.role}
                </h3>
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                  {e.period}
                </span>
              </div>
              <p className="text-sm text-muted mb-4">
                {e.company} · {e.location}
              </p>
              <ul className="space-y-2">
                {e.impact.map((item, j) => (
                  <li
                    key={j}
                    className="text-sm md:text-base text-muted leading-relaxed flex gap-2"
                  >
                    <span className="text-accent mt-1.5 shrink-0">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
