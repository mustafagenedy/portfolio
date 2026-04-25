import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

/** Keep the browser tab favicon in sync with the current theme. */
const updateFavicon = (dark) => {
  // Invert: light mode → dark icon (contrast); dark mode → light icon (contrast)
  const href = dark ? '/light.png' : '/dark.png';

  // Replace all existing icon links so there's no stale fallback
  document.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());

  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = href;
  document.head.appendChild(link);

  // Apple touch icon — same logic
  let touchLink = document.querySelector("link[rel='apple-touch-icon']");
  if (!touchLink) {
    touchLink = document.createElement('link');
    touchLink.rel = 'apple-touch-icon';
    document.head.appendChild(touchLink);
  }
  touchLink.href = href;
};

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    updateFavicon(dark);
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
