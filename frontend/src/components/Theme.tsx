import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const themeStorageKey = 'dwellsafe-theme';
const ThemeContext = createContext<ThemeContextValue | null>(null);

function readSavedTheme(): Theme {
  return window.localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(readSavedTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#0d1b2a' : '#ffffff',
    );
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => current === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('ThemeToggle must be used within ThemeProvider.');

  const isDark = context.theme === 'dark';
  return (
    <button
      className="theme-toggle"
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark theme"
      onClick={context.toggleTheme}
    >
      <span className="theme-toggle-track" aria-hidden="true"><span /></span>
      <span>{isDark ? 'Dark' : 'Light'} mode</span>
    </button>
  );
}
