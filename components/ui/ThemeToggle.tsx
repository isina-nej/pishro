'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch: theme is only known on the client.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a stable, non-interactive placeholder on the server and first
  // client render so the markup matches and layout does not shift.
  if (!mounted) {
    return (
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
        aria-hidden="true"
      />
    );
  }

  // resolvedTheme is always 'light' | 'dark' (it resolves 'system' to the
  // actual applied theme), unlike `theme` which can be 'system'. Using it
  // fixes the toggle being a no-op / showing the wrong icon under system mode.
  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      data-sound="toggle"
      data-sound-role="toggle"
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-slate-700 transition-all duration-300 hover:bg-gray-200 dark:bg-cardBg dark:text-textSecondary dark:hover:bg-darkBgHidden"
      aria-label={isDark ? 'روشن کردن حالت روز' : 'روشن کردن حالت شب'}
      title={isDark ? 'تغییر به حالت روز' : 'تغییر به حالت شب'}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-myGolden transition-transform duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-mySecondary transition-transform duration-300" />
      )}
    </button>
  );
}
