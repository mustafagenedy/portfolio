import { useState } from 'react';
import Tilt from 'react-parallax-tilt';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiTerminal, FiArrowUpRight } from 'react-icons/fi';

/**
 * ProjectCard — dual-mode:
 *  - Default: card with tilt, summary, tech badges
 *  - Preview mode (flip): simulated terminal / dashboard preview
 */
export default function ProjectCard({ project, onOpen }) {
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <Tilt
      tiltMaxAngleX={4}
      tiltMaxAngleY={4}
      glareEnable
      glareMaxOpacity={0.08}
      glareColor="#ffffff"
      glarePosition="all"
      transitionSpeed={800}
      className="h-full"
    >
      <div className="relative h-full min-h-[380px] rounded-2xl overflow-hidden bg-white dark:bg-surface-dark border border-gray-200/80 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
        <AnimatePresence mode="wait">
          {previewMode ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, rotateY: -15 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 15 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 p-5 bg-primary dark:bg-bg-dark text-green-300 font-mono text-[11px] leading-relaxed overflow-hidden"
            >
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-white/60 text-xs">{project.slug}.sh</span>
              </div>
              <div className="space-y-1">
                <p><span className="text-white/40">$</span> curl -X GET /api/{project.slug}</p>
                <p className="text-white/60">{'{'}</p>
                <p className="pl-3 text-white/80">"status": <span className="text-yellow-300">"ok"</span>,</p>
                <p className="pl-3 text-white/80">"category": <span className="text-yellow-300">"{project.category}"</span>,</p>
                <p className="pl-3 text-white/80">"stack": [</p>
                {project.techStack.slice(0, 4).map((t) => (
                  <p key={t} className="pl-6 text-yellow-300">"{t}",</p>
                ))}
                <p className="pl-3 text-white/80">]</p>
                <p className="text-white/60">{'}'}</p>
                <p className="mt-2"><span className="text-white/40">$</span> <span className="animate-pulse">_</span></p>
              </div>
              <button
                onClick={() => setPreviewMode(false)}
                className="absolute bottom-4 right-4 text-xs text-white/60 hover:text-white"
              >
                ← exit preview
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="front"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-accent bg-accent/10 px-2 py-1 rounded-md">
                  {project.category.replace('-', ' ')}
                </span>
                {project.featured && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/10 px-2 py-1 rounded-md">
                    Featured
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-primary dark:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-5 flex-1">
                {project.summary}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.techStack.slice(0, 5).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-primary/5 dark:bg-accent/10 text-primary dark:text-accent"
                  >
                    {t}
                  </span>
                ))}
                {project.techStack.length > 5 && (
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded-md text-muted">
                    +{project.techStack.length - 5}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <button
                  onClick={() => onOpen(project)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-accent hover:gap-2 transition-all"
                >
                  Case study <FiArrowUpRight size={14} />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewMode(true)}
                    aria-label="System preview"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-muted hover:text-primary dark:hover:text-white transition-colors"
                  >
                    <FiTerminal size={15} />
                  </button>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-muted hover:text-primary dark:hover:text-white transition-colors"
                    >
                      <FiGithub size={15} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Live site"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-muted hover:text-primary dark:hover:text-white transition-colors"
                    >
                      <FiExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Tilt>
  );
}
