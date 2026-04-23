import { useEffect } from 'react';

const SUFFIX = 'Mostafa Genidy';

/** Set document.title while the component is mounted, then restore on unmount. */
export function useDocTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — ${SUFFIX}` : SUFFIX;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
