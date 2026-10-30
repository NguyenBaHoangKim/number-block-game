import { appConfig, lessons } from "../data/mockData";
import type { Progress } from "../types/lesson";
export const emptyProgress = (): Progress => ({
  stars: {},
  lastLesson: null,
  practice: { quickBest: 0, rounds: 0 },
  settings: { ...appConfig.defaultSettings },
});
export function loadProgress(): Progress {
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem(appConfig.storageKey) ?? "null",
    );
    if (!raw || typeof raw !== "object") return emptyProgress();
    const p = raw as Partial<Progress>;
    const result = emptyProgress();
    for (const l of lessons) {
      const n = p.stars?.[l.id];
      if (typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 3)
        result.stars[l.id] = n;
    }
    result.lastLesson = lessons.some((l) => l.id === p.lastLesson)
      ? p.lastLesson!
      : null;
    if (p.settings && typeof p.settings === "object") {
      if (typeof p.settings.background === "boolean")
        result.settings.background = p.settings.background;
      if (typeof p.settings.voice === "boolean")
        result.settings.voice = p.settings.voice;
      if (typeof p.settings.effects === "boolean")
        result.settings.effects = p.settings.effects;
      if (typeof p.settings.music === "boolean")
        result.settings.music = p.settings.music;
      if (
        typeof p.settings.volume === "number" &&
        Number.isFinite(p.settings.volume)
      )
        result.settings.volume = Math.max(0, Math.min(1, p.settings.volume));
    }
    if (p.practice && typeof p.practice === "object") {
      for (const size of [10, 15]) {
        const best = p.practice.bestByLength?.[size];
        if (Number.isInteger(best) && best! >= 0 && best! <= size)
          result.practice.bestByLength = {
            ...result.practice.bestByLength,
            [size]: best!,
          };
      }
      if (
        Number.isInteger(p.practice.quickBest) &&
        p.practice.quickBest >= 0 &&
        p.practice.quickBest <= 5
      )
        result.practice.quickBest = p.practice.quickBest;
      if (Number.isInteger(p.practice.rounds) && p.practice.rounds >= 0)
        result.practice.rounds = p.practice.rounds;
    }
    return result;
  } catch {
    return emptyProgress();
  }
}
export function saveProgress(progress: Progress) {
  try {
    localStorage.setItem(appConfig.storageKey, JSON.stringify(progress));
  } catch {
    /* The current session still works when storage is unavailable. */
  }
}
export function awardStars(
  progress: Progress,
  id: string,
  stars: number,
): Progress {
  return {
    ...progress,
    stars: {
      ...progress.stars,
      [id]: Math.max(progress.stars[id] ?? 0, Math.min(3, Math.max(1, stars))),
    },
  };
}
