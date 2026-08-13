'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { UiSoundEngine } from '@/lib/sound/engine';
import { SOUND_MUTE_KEY, type SoundId } from '@/lib/sound/types';

type SoundContextValue = {
  muted: boolean;
  setMuted: (value: boolean) => void;
  toggleMuted: () => void;
  play: (id: SoundId, options?: { volume?: number }) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<UiSoundEngine | null>(null);
  const [muted, setMutedState] = useState(false);

  if (!engineRef.current) {
    engineRef.current = new UiSoundEngine();
  }

  useEffect(() => {
    try {
      setMutedState(localStorage.getItem(SOUND_MUTE_KEY) === '1');
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const unlock = () => {
      void engineRef.current?.unlock();
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const setMuted = useCallback((value: boolean) => {
    setMutedState(value);
    try {
      localStorage.setItem(SOUND_MUTE_KEY, value ? '1' : '0');
    } catch {
      // ignore
    }
  }, []);

  const toggleMuted = useCallback(() => {
    setMutedState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_MUTE_KEY, next ? '1' : '0');
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const play = useCallback(
    (id: SoundId, options?: { volume?: number }) => {
      if (muted) return;
      engineRef.current?.play(id, options?.volume ?? 1);
    },
    [muted]
  );

  const value = useMemo(
    () => ({ muted, setMuted, toggleMuted, play }),
    [muted, setMuted, toggleMuted, play]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    return {
      muted: true,
      setMuted: () => undefined,
      toggleMuted: () => undefined,
      play: () => undefined,
    } satisfies SoundContextValue;
  }
  return ctx;
}
