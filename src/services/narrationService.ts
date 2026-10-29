import manifestData from "../data/narrationManifest.json";
import { spokenNumbers, spokenSymbols } from "../data/mockData";
import { setNarrationDucking } from "./audioService";
interface Clip {
  src: string;
  durationMs: number;
}
const manifest: Record<string, Clip> = manifestData;
type Request = { id: number; text: string; clip: Clip };
let enabled = true,
  volume = 0.4,
  unlocked = false,
  sequence = 0;
let active: Request | null = null,
  player: HTMLAudioElement | null = null;
let pending: Request[] = [];
let backgroundAllowed = false;
let state = { enabled: true, speaking: false, blocked: false, text: "" };
const listeners = new Set<() => void>();
const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
function publish(patch: Partial<typeof state>) {
  state = { ...state, ...patch };
  for (const listener of listeners) listener();
}
export function subscribeNarration(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function getNarrationSnapshot() {
  return state;
}
export function narrationDuration(text: string) {
  return enabled ? (manifest[normalize(text)]?.durationMs ?? 0) : 0;
}
function release() {
  if (player) {
    player.onended = null;
    player.onerror = null;
    player.pause();
    player.removeAttribute("src");
    player.load();
    player = null;
  }
  active = null;
  setNarrationDucking(false);
}
export function stopNarration() {
  pending = [];
  release();
  publish({ speaking: false, blocked: false });
}
function startNext() {
  if (
    !enabled ||
    !unlocked ||
    active ||
    !pending.length ||
    (document.hidden && !backgroundAllowed)
  )
    return;
  const request = pending.shift()!;
  active = request;
  const audio = new Audio(request.clip.src);
  player = audio;
  audio.volume = volume;
  audio.preload = "auto";
  publish({ text: request.text, speaking: true, blocked: false });
  setNarrationDucking(true);
  const finish = () => {
    if (active?.id !== request.id) return;
    release();
    publish({ speaking: false });
    startNext();
  };
  audio.onended = finish;
  audio.onerror = finish;
  void audio.play().catch(() => {
    if (active?.id !== request.id) return;
    release();
    pending.unshift(request);
    unlocked = false;
    publish({ speaking: false, blocked: true });
  });
}
export function unlockNarration() {
  unlocked = true;
  startNext();
}
export function setNarrationEnabled(value: boolean) {
  enabled = value;
  if (!value) stopNarration();
  publish({ enabled: value });
}
export function setNarrationVolume(value: number) {
  volume = Math.max(0, Math.min(1, value));
  if (player) player.volume = volume;
}
export function narrate(text: string, options: { queue?: boolean } = {}) {
  const normalized = normalize(text),
    clip = manifest[normalized];
  if (!enabled || !clip) return () => {};
  if (!options.queue) stopNarration();
  const request = { id: ++sequence, text: normalized, clip };
  pending.push(request);
  publish({ text: normalized });
  startNext();
  return () => {
    pending = pending.filter((r) => r.id !== request.id);
    if (active?.id === request.id) {
      release();
      publish({ speaking: false });
      startNext();
    }
  };
}
export function speakAnswer(value: string | number) {
  const text =
    typeof value === "number"
      ? spokenNumbers[value]
      : (spokenSymbols[value] ?? value);
  return text ? narrate(text) : () => {};
}
let counting = false;
export function speakCount(value: number) {
  const text = spokenNumbers[value];
  if (!text) return;
  if (!counting || value === 1) stopNarration();
  counting = true;
  narrate(text, { queue: true });
}
export function stopCounting() {
  counting = false;
  stopNarration();
}

export function setBackgroundNarrationEnabled(enabled: boolean) {
  backgroundAllowed = enabled;
  if (document.hidden && !enabled) stopNarration();
  else if (enabled) startNext();
}
