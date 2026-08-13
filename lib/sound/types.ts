export type SoundId =
  | "click"
  | "ui"
  | "navigate"
  | "cart"
  | "chat"
  | "premium"
  | "auth"
  | "toggle"
  | "send"
  | "success"
  | "market"
  | "share"
  | "bookmark";

export const SOUND_IDS: SoundId[] = [
  "click",
  "ui",
  "navigate",
  "cart",
  "chat",
  "premium",
  "auth",
  "toggle",
  "send",
  "success",
  "market",
  "share",
  "bookmark",
];

export function isSoundId(value: string): value is SoundId {
  return (SOUND_IDS as string[]).includes(value);
}

export const SOUND_MUTE_KEY = "pishro-ui-sound-muted";
