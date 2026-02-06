'use client';

import { useTheme, THEMES } from '../context/ThemeContext';

export default function ThemePicker() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-lg font-semibold text-gray-700">Choose a Theme</h2>
      <div className="flex gap-3">
        {THEMES.map((t) => (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            title={t.label}
            className={`
              w-10 h-10 rounded-full border-2 transition-all
              ${theme === t.name
                ? 'border-gray-900 scale-110 ring-2 ring-offset-2 ring-gray-400'
                : 'border-gray-300 hover:scale-105'
              }
            `}
            style={{ backgroundColor: t.preview }}
            aria-label={`${t.label} theme`}
            aria-pressed={theme === t.name}
          />
        ))}
      </div>
      <p className="text-sm text-gray-500">
        Current: <span className="font-medium text-accent-600">{THEMES.find(t => t.name === theme)?.label}</span>
      </p>
    </div>
  );
}
