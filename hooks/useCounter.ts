// hooks/useCounter.ts
import { useEffect, useState } from "react";

export function useCounter(target: number, duration: number = 2000): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16)); // ~60fps
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setCount(start);
    }, 16);

    return () => clearInterval(interval);
  }, [target, duration]);

  return count;
}
