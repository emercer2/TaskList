'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemeName = 'blue' | 'purple' | 'green' | 'rose' | 'amber';

export const THEMES: { name: ThemeName; label: string; preview: string }[] = [
  { name: 'blue',   label: 'Blue',   preview: '#2563eb' },
  { name: 'purple', label: 'Purple', preview: '#9333ea' },
  { name: 'green',  label: 'Green',  preview: '#16a34a' },
  { name: 'rose',   label: 'Rose',   preview: '#e11d48' },
  { name: 'amber',  label: 'Amber',  preview: '#d97706' },
];

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('blue');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as ThemeName | null;
    if (stored && THEMES.some(t => t.name === stored)) {
      setThemeState(stored);
    }
  }, []);

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
