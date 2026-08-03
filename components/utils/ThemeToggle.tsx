'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
        aria-hidden="true"
      />
    );
  }

  // Use resolvedTheme (never 'system') so the icon and the next theme are
  // always derived from what is actually applied.
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-muted dark:bg-cardBg dark:text-textSecondary dark:hover:bg-darkBgHidden"
      aria-label={isDark ? 'روشن کردن حالت روز' : 'روشن کردن حالت شب'}
      title={isDark ? 'تغییر به حالت روز' : 'تغییر به حالت شب'}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-myGolden" />
      ) : (
        <Moon className="h-5 w-5 text-mySecondary" />
      )}
    </button>
  );
}
