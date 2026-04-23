export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-bg-dark">
      <div className="flex items-center gap-2 text-muted">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <div
          className="w-2 h-2 rounded-full bg-accent animate-pulse"
          style={{ animationDelay: '150ms' }}
        />
        <div
          className="w-2 h-2 rounded-full bg-accent animate-pulse"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
}
