export default function StatCard({ label, value, accent = 'primary', icon: Icon }) {
  const accentClass =
    accent === 'accent'
      ? 'text-accent'
      : accent === 'green'
      ? 'text-green-600 dark:text-green-400'
      : accent === 'amber'
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-primary dark:text-white';

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wider text-muted font-semibold">{label}</p>
        {Icon && <Icon size={16} className="text-muted" />}
      </div>
      <p className={`text-3xl font-bold ${accentClass}`}>{value}</p>
    </div>
  );
}
