import { audioEffects, audioProfiles } from "../data/mockData";
import type { AudioMood } from "../types/audio";
type Effect = keyof typeof audioEffects;
let context: AudioContext | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let effectsBus: GainNode | null = null;
let effects = true,
  music = false,
  volume = 0.4;
let mood: AudioMood = "lobby";
let ducked = false;
let backgroundAllowed = false;
let interval: ReturnType<typeof setInterval> | undefined;
const nodes = new Map<OscillatorNode, boolean>();
const variations: Partial<Record<Effect, number>> = {};
export async function initializeAudio() {
  try {
    if (!context || context.state === "closed") {
      context = new AudioContext();
      master = context.createGain();
      master.gain.value = volume;
      master.connect(context.destination);
      musicBus = context.createGain();
      musicBus.connect(master);
      effectsBus = context.createGain();
      effectsBus.gain.value = effects ? 1 : 0;
      effectsBus.connect(master);
    }
    if (context.state === "suspended") await context.resume();
    if (music && (backgroundAllowed || !document.hidden)) startMusic();
    return context.state === "running";
  } catch {
    return false;
  }
}
function tone(
  frequency: number,
  delay: number,
  duration: number,
  isMusic: boolean,
  wave: OscillatorType = "sine",
  amplitude = 0.1,
) {
  if (!context || context.state !== "running" || !frequency) return;
  const oscillator = context.createOscillator(),
    gain = context.createGain(),
    start = context.currentTime + delay;
  oscillator.type = wave;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(amplitude, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect((isMusic ? musicBus : effectsBus)!);
  nodes.set(oscillator, isMusic);
  oscillator.onended = () => {
    nodes.delete(oscillator);
    oscillator.disconnect();
    gain.disconnect();
  };
  oscillator.start(start);
  oscillator.stop(start + duration + 0.015);
}
export function playEffect(name: Effect, pitchIndex?: number) {
  if (!effects) return;
  const profile = audioEffects[name];
  const variation = variations[name] ?? 0;
  variations[name] = variation + 1;
  const scale = [1, 1.12246, 1.25992, 1.33484, 1.49831, 1.68179, 1.88775, 2];
  const factor =
    name === "count"
      ? scale[((pitchIndex ?? variation) - 1 + scale.length) % scale.length]
      : name === "pop"
        ? [1, 1.12246, 1.25992, 1.49831][variation % 4]
        : 1;
  profile.notes.forEach((n, i) =>
    tone(
      n * factor,
      i * profile.spacing,
      profile.duration,
      false,
      profile.wave,
      profile.gain,
    ),
  );
}
function stopNodes(isMusic: boolean) {
  for (const [node, musical] of nodes) {
    if (musical === isMusic) {
      try {
        node.stop();
      } catch {
        /* Already stopped. */
      }
    }
  }
}
function stopMusic() {
  clearInterval(interval);
  interval = undefined;
  stopNodes(true);
}
function startMusic() {
  if (interval || !context || context.state !== "running") return;
  const profile = audioProfiles[mood];
  if (musicBus)
    musicBus.gain.setValueAtTime(
      profile.level * (ducked ? 0.22 : 1),
      context.currentTime,
    );
  let beat = 0;
  const tick = () => {
    tone(
      profile.melody[beat % profile.melody.length],
      0,
      0.28,
      true,
      profile.wave,
      0.09,
    );
    if (beat % 4 === 0)
      tone(
        profile.bass[Math.floor(beat / 4) % profile.bass.length],
        0,
        0.48,
        true,
        "sine",
        0.065,
      );
    if (mood === "challenge" && beat % 2 === 1)
      tone(196, 0, 0.055, true, "triangle", 0.035);
    beat++;
  };
  tick();
  interval = setInterval(tick, 60000 / profile.bpm / 2);
}
export function setAudioMood(next: AudioMood) {
  if (mood === next) return;
  mood = next;
  stopMusic();
  if (music && (backgroundAllowed || !document.hidden)) startMusic();
}
export function setEffectsEnabled(enabled: boolean) {
  effects = enabled;
  if (effectsBus) effectsBus.gain.value = enabled ? 1 : 0;
  if (!enabled) stopNodes(false);
}
export function setMusicEnabled(enabled: boolean) {
  music = enabled;
  if (enabled && (backgroundAllowed || !document.hidden)) startMusic();
  else stopMusic();
}
export function setMasterVolume(value: number) {
  volume = Math.max(0, Math.min(1, value));
  if (master && context)
    master.gain.setTargetAtTime(volume, context.currentTime, 0.025);
}
export function pauseAudio() {
  stopMusic();
  void context?.suspend();
}
export function disposeAudio() {
  stopMusic();
  stopNodes(false);
  void context?.close();
  context = null;
  master = null;
  musicBus = null;
  effectsBus = null;
  nodes.clear();
}
export function getAudioStatus() {
  return {
    mood,
    music,
    effects,
    volume,
    playing: Boolean(interval),
    activeNodes: nodes.size,
    backgroundAllowed,
  };
}

export function setNarrationDucking(speaking: boolean) {
  ducked = speaking;
  if (musicBus && context)
    musicBus.gain.setTargetAtTime(
      audioProfiles[mood].level * (speaking ? 0.22 : 1),
      context.currentTime,
      0.08,
    );
}

export function setBackgroundAudioEnabled(enabled: boolean) {
  backgroundAllowed = enabled;
  if (document.hidden && !enabled) pauseAudio();
  else if (enabled && context) void initializeAudio();
}
