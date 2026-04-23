import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiGithub, FiExternalLink } from 'react-icons/fi';

const Block = ({ label, body }) => {
  if (!body) return null;
  return (
    <div>
      <h4 className="text-xs uppercase tracking-wider font-semibold text-accent mb-2">
        {label}
      </h4>
      <p className="text-sm md:text-base text-muted leading-relaxed">{body}</p>
    </div>
  );
};

export default function CaseStudyModal({ project, onClose }) {
  // ESC to close + lock body scroll
  useEffect(() => {
    if (!project) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.article
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-surface-dark shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/70 dark:bg-surface-dark/70 backdrop-blur hover:bg-gray-100 dark:hover:bg-gray-800 z-10"
            >
              <FiX size={20} />
            </button>

            {/* Header */}
            <div className="p-8 md:p-10 bg-gradient-to-br from-primary to-secondary text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70 font-semibold mb-3">
                {project.category.replace('-', ' ')}
              </p>
              <h2 id="case-study-title" className="text-2xl md:text-4xl font-bold mb-3">
                {project.title}
              </h2>
              <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-2xl">
                {project.summary}
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                {project.techStack.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/10 text-white border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
                  >
                    <FiGithub size={16} /> Source
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent/80 text-white text-sm font-semibold transition-colors"
                  >
                    <FiExternalLink size={16} /> Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-8 md:p-10 space-y-8">
              <Block label="Overview" body={project.description} />
              <Block label="Problem" body={project.problem} />
              <Block label="Solution" body={project.solution} />
              <Block label="Architecture" body={project.architecture} />
              <Block label="Challenges & Trade-offs" body={project.challenges} />

              {/* Screenshots */}
              {project.images?.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-accent mb-3">
                    Screenshots
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {project.images.map((img) => (
                      <img
                        key={img.url || img}
                        src={img.url || img}
                        alt={`${project.title} screenshot`}
                        loading="lazy"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
