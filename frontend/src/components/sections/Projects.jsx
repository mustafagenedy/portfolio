import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '../ui/Section';
import ProjectCard from './ProjectCard';
import CaseStudyModal from './CaseStudyModal';
import api from '../../lib/api';
import { fallbackProjects } from '../../config/portfolio';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'full-stack', label: 'Full-Stack' },
  { id: 'backend', label: 'Backend' },
  { id: 'machine-learning', label: 'Machine Learning' },
  { id: 'it-systems', label: 'IT Systems' },
];

const fetchProjects = async () => {
  try {
    const { data } = await api.get('/projects');
    return data?.length ? data : fallbackProjects;
  } catch {
    return fallbackProjects;
  }
};

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [activeProject, setActiveProject] = useState(null);

  const { data: projects = fallbackProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const filtered = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [projects, filter]
  );

  const featured = projects.filter((p) => p.featured);

  return (
    <Section id="projects" eyebrow="Selected work" title="Projects as case studies.">
      {/* Featured horizontal scroll */}
      {featured.length > 0 && (
        <div className="mb-14">
          <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-4">
            Featured
          </p>
          <div className="relative -mx-6 md:-mx-10">
            <div className="flex gap-5 overflow-x-auto pb-4 px-6 md:px-10 snap-x snap-mandatory scrollbar-thin">
              {featured.map((p) => (
                <div
                  key={p._id}
                  className="snap-start shrink-0 w-[340px] md:w-[420px]"
                >
                  <ProjectCard project={p} onOpen={setActiveProject} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              filter === f.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white dark:bg-surface-dark text-muted hover:text-primary dark:hover:text-white border border-gray-200 dark:border-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div
              key={p._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={p} onOpen={setActiveProject} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-muted py-10">No projects match this filter.</p>
      )}

      <CaseStudyModal project={activeProject} onClose={() => setActiveProject(null)} />
    </Section>
  );
}
