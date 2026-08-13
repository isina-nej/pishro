export default function Template({ children }: { children: React.ReactNode }) {
  // بدون PageTransition — انیمیشن کلاینتی موقع soft-nav باعث Application error می‌شد.
  return children;
}
