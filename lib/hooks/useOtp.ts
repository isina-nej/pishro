import { useState, useEffect } from "react";

export function useOtpTimer(initial: number = 120) {
  const [countdown, setCountdown] = useState(initial);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const reset = () => setCountdown(initial);

  return { countdown, reset };
}
