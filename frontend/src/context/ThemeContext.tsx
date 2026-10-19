import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'portfolio_theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Light/dark toggle is temporarily disabled — always start in dark mode.
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      document.body.style.backgroundColor = 'var(--bg-page)';
      document.body.style.color = 'var(--text-primary)';
    } else {
      root.setAttribute('data-theme', 'dark');
      document.body.style.backgroundColor = 'var(--bg-page)';
      document.body.style.color = 'var(--text-primary)';
    }
    localStorage.removeItem(THEME_STORAGE_KEY);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
