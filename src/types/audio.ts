export type AudioMood =
  "lobby" | "lesson" | "playground" | "challenge" | "celebration";
export interface MusicProfile {
  title: string;
  bpm: number;
  level: number;
  melody: number[];
  bass: number[];
  wave: OscillatorType;
}
export interface EffectProfile {
  notes: number[];
  wave: OscillatorType;
  duration: number;
  spacing: number;
  gain: number;
}
