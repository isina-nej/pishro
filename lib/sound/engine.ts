import type { SoundId } from "./types";

type Tone = {
  freq: number;
  type?: OscillatorType;
  dur?: number;
  gain?: number;
  delay?: number;
};

const PRESETS: Record<SoundId, Tone[]> = {
  click: [{ freq: 640, dur: 0.045, gain: 0.032 }],
  ui: [{ freq: 520, type: "triangle", dur: 0.055, gain: 0.028 }],
  navigate: [
    { freq: 392, dur: 0.09, gain: 0.024 },
    { freq: 523.25, dur: 0.13, gain: 0.028, delay: 0.05 },
  ],
  cart: [
    { freq: 349.23, type: "triangle", dur: 0.1, gain: 0.036 },
    { freq: 523.25, type: "triangle", dur: 0.12, gain: 0.03, delay: 0.07 },
  ],
  chat: [
    { freq: 659.25, dur: 0.08, gain: 0.028 },
    { freq: 880, dur: 0.1, gain: 0.026, delay: 0.055 },
  ],
  premium: [
    { freq: 440, dur: 0.11, gain: 0.03 },
    { freq: 554.37, dur: 0.13, gain: 0.028, delay: 0.075 },
    { freq: 659.25, dur: 0.15, gain: 0.026, delay: 0.15 },
  ],
  auth: [
    { freq: 493.88, dur: 0.09, gain: 0.028 },
    { freq: 659.25, dur: 0.12, gain: 0.028, delay: 0.065 },
  ],
  toggle: [
    { freq: 480, dur: 0.04, gain: 0.022 },
    { freq: 720, dur: 0.05, gain: 0.02, delay: 0.035 },
  ],
  send: [
    { freq: 440, dur: 0.055, gain: 0.026 },
    { freq: 554.37, dur: 0.08, gain: 0.024, delay: 0.045 },
  ],
  success: [
    { freq: 523.25, dur: 0.09, gain: 0.03 },
    { freq: 659.25, dur: 0.11, gain: 0.028, delay: 0.07 },
    { freq: 783.99, dur: 0.14, gain: 0.026, delay: 0.14 },
  ],
  market: [
    { freq: 880, type: "square", dur: 0.03, gain: 0.012 },
    { freq: 1174.66, type: "square", dur: 0.035, gain: 0.01, delay: 0.03 },
  ],
  // پرتاب کوتاه رو به بالا — حس اشتراک‌گذاری
  share: [
    { freq: 523.25, type: "triangle", dur: 0.06, gain: 0.026 },
    { freq: 698.46, type: "triangle", dur: 0.08, gain: 0.024, delay: 0.045 },
    { freq: 932.33, type: "sine", dur: 0.1, gain: 0.018, delay: 0.1 },
  ],
  // پاپ نرم پر/خالی شدن بوکمارک
  bookmark: [
    { freq: 392, type: "sine", dur: 0.055, gain: 0.028 },
    { freq: 587.33, type: "triangle", dur: 0.09, gain: 0.03, delay: 0.04 },
    { freq: 784, type: "sine", dur: 0.07, gain: 0.016, delay: 0.11 },
  ],
};

type AudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

export class UiSoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private unlocked = false;

  private ensureContext() {
    if (typeof window === "undefined") return null;
    if (this.ctx) return this.ctx;
    const Ctor =
      window.AudioContext || (window as AudioWindow).webkitAudioContext;
    if (!Ctor) return null;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.85;
    this.master.connect(this.ctx.destination);
    return this.ctx;
  }

  async unlock() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        return;
      }
    }
    this.unlocked = true;
  }

  play(id: SoundId, volume = 1) {
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    if (ctx.state === "suspended") {
      void ctx.resume().then(() => {
        this.unlocked = true;
        this.playNow(id, volume);
      });
      return;
    }
    this.unlocked = true;
    this.playNow(id, volume);
  }

  private playNow(id: SoundId, volume: number) {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;

    const now = ctx.currentTime;
    const tones = PRESETS[id];
    for (const tone of tones) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = tone.delay ?? 0;
      const dur = tone.dur ?? 0.08;
      const peak = Math.max(0.0001, (tone.gain ?? 0.03) * volume);

      osc.type = tone.type ?? "sine";
      osc.frequency.setValueAtTime(tone.freq, now + delay);
      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(peak, now + delay + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now + delay);
      osc.stop(now + delay + dur + 0.04);
    }
  }

  get isUnlocked() {
    return this.unlocked;
  }
}
