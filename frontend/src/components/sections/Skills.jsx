import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiEye, FiFolder, FiUsers, FiTrendingUp } from 'react-icons/fi';
import Section from '../ui/Section';
import { stack } from '../../config/portfolio';
import api from '../../lib/api';

/** Public endpoint — returns { totalVisits, userCount, projectCount, topProjects }. */
const fetchPublicStats = async () => {
  const { data } = await api.get('/analytics/public');
  return data;
};

export default function Skills() {
  const { data: stats } = useQuery({
    queryKey: ['public-stats'],
    queryFn: fetchPublicStats,
    retry: false,
    staleTime: 60 * 1000,
  });

  return (
    <Section id="skills" eyebrow="Skills" title="The tools I reach for.">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Categorized skills */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {Object.entries(stack).map(([group, items], i) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200/80 dark:border-gray-700 hover:border-accent/40 transition-colors duration-300"
            >
              <h3 className="text-sm font-bold text-primary dark:text-white mb-4">
                {group}
              </h3>
              <div className="flex flex-wrap gap-1.5">
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

        {/* Real site stats — not fake metrics */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="p-6 rounded-2xl bg-primary dark:bg-surface-dark text-white border border-transparent dark:border-gray-700"
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <p className="text-xs uppercase tracking-wider text-white/60 font-semibold">
              Site activity
            </p>
          </div>

          {stats ? (
            <div className="space-y-4">
              <Stat icon={FiEye} label="Total visits" value={stats.totalVisits} />
              <Stat icon={FiTrendingUp} label="Last 7 days" value={stats.weeklyVisits} />
              <Stat icon={FiFolder} label="Projects" value={stats.projectCount} />
              <Stat icon={FiUsers} label="Registered users" value={stats.userCount} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-5 bg-white/5 rounded animate-pulse" />
              <div className="h-5 bg-white/5 rounded animate-pulse" />
              <div className="h-5 bg-white/5 rounded animate-pulse" />
              <div className="h-5 bg-white/5 rounded animate-pulse" />
            </div>
          )}

          <p className="mt-5 text-[11px] text-white/50 leading-relaxed">
            Live numbers from this site's database — updated on every visit.
          </p>
        </motion.div>
      </div>
    </Section>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-baseline justify-between pb-3 border-b border-white/10 last:border-0">
      <span className="flex items-center gap-2 text-sm text-white/70">
        <Icon size={14} /> {label}
      </span>
      <span className="font-mono font-bold text-lg text-accent dark:text-accent">{value}</span>
    </div>
  );
}
