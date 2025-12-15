// hooks/useCounter.ts
import { useEffect, useState } from "react";

export function useCounter(target: number, duration: number = 2000): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;

      // elapsed time since animation started
      const elapsed = timestamp - startTimestamp;

      // progress ratio (0 → 1)
      const progress = Math.min(elapsed / duration, 1);

      // interpolate count value
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);

    // reset count when target changes
    return () => setCount(0);
  }, [target, duration]);

  return count;
}
