'use client';

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemesProviderProps } from 'next-themes';
import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
  attribute?: 'class' | 'data-theme' | 'data-mode';
  defaultTheme?: string;
  enableSystem?: boolean;
  enableColorScheme?: boolean;
  disableTransitionOnChange?: boolean;
}

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider {...(props as Omit<NextThemesProviderProps, 'children'>)}>
      {children}
    </NextThemesProvider>
  );
}
