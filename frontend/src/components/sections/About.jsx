import { motion } from 'framer-motion';
import Section from '../ui/Section';
import { mindset, stack } from '../../config/portfolio';

export default function About() {
  return (
    <Section id="about" eyebrow="About" title="A systems engineer, first.">
      <div className="grid md:grid-cols-5 gap-10 items-start">
        {/* Bio */}
        <div className="md:col-span-3 space-y-5 text-base md:text-lg leading-relaxed text-muted">
          <p>
            I'm a Full-Stack Software Engineer based in Giza, Egypt. I work across the stack —
            Node.js and ASP.NET Core MVC on the backend, React on the frontend, MongoDB and SQL
            Server for persistence, and scikit-learn with FastAPI when machine learning needs to
            ship as a service.
          </p>
          <p>
            My approach is systems-first. I treat every feature as a contract between layers:
            schemas describe data, services describe behavior, and routes describe access. That
            discipline is what makes a codebase still make sense six months after shipping.
          </p>
          <p>
            Beyond web engineering, I work on IT infrastructure — Windows Server, networking, and
            smart-systems integration — which keeps me grounded in the operational realities that
            most frontend developers never see.
          </p>
        </div>

        {/* Mindset */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-sm uppercase tracking-wider text-accent font-semibold">
            How I build systems
          </h3>
          {mindset.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200/80 dark:border-gray-700 shadow-sm"
            >
              <h4 className="font-semibold text-primary dark:text-white mb-1.5">
                {m.title}
              </h4>
              <p className="text-sm text-muted leading-relaxed">{m.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="mt-20">
        <h3 className="text-sm uppercase tracking-wider text-accent font-semibold mb-6">
          Tech stack
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(stack).map(([group, items]) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200/80 dark:border-gray-700"
            >
              <p className="text-xs uppercase tracking-wider text-muted mb-3">{group}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-primary/5 dark:bg-accent/10 text-primary dark:text-accent"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
