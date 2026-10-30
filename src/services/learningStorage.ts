import type { ExerciseType, Difficulty } from "../features/exercises/types";
import { definitionByType } from "../features/exercises/catalog";
export interface SkillProgress {
  attempts: number;
  correct: number;
  guided: number;
  hints: number;
  lastDifficulty: Difficulty;
  streak: number;
}
export interface LearningProgress {
  version: 1;
  stars: Record<string, number>;
  skills: Partial<Record<ExerciseType, SkillProgress>>;
  sessions: number;
  recent: {
    eventId: string;
    type: ExerciseType;
    correct: boolean;
    difficulty: Difficulty;
  }[];
  daily: Record<string, string[]>;
  unlockAll: boolean;
  session: { lessonId: string; index: number; questionIds: string[] } | null;
}
export const LEARNING_KEY = "daoKhoiSo.learning.v1";
export const freshLearning = (): LearningProgress => ({
  version: 1,
  stars: {},
  skills: {},
  sessions: 0,
  recent: [],
  daily: {},
  unlockAll: true,
  session: null,
});
const integer = (value: unknown, min = 0, max = 1000000): value is number =>
  typeof value === "number" &&
  Number.isInteger(value) &&
  value >= min &&
  value <= max;
export function loadLearningProgress(): LearningProgress {
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem(LEARNING_KEY) ?? "null",
    );
    if (!raw || typeof raw !== "object") return freshLearning();
    const source = raw as Partial<LearningProgress>,
      p = freshLearning();
    if (source.stars && typeof source.stars === "object")
      for (const [id, n] of Object.entries(source.stars))
        if (/^W[1-8]-L(?:0[1-9]|10)$/.test(id) && integer(n, 1, 3))
          p.stars[id] = n;
    if (source.skills && typeof source.skills === "object")
      for (const [type, value] of Object.entries(source.skills)) {
        if (
          !definitionByType[type as ExerciseType] ||
          !value ||
          typeof value !== "object"
        )
          continue;
        const s = value as SkillProgress;
        if (
          [s.attempts, s.correct, s.guided, s.hints, s.streak].every((n) =>
            integer(n),
          ) &&
          integer(s.lastDifficulty, 1, 5) &&
          s.correct <= s.attempts
        )
          p.skills[type as ExerciseType] = {
            attempts: s.attempts,
            correct: s.correct,
            guided: s.guided,
            hints: s.hints,
            streak: s.streak,
            lastDifficulty: s.lastDifficulty,
          };
      }
    if (integer(source.sessions)) p.sessions = source.sessions;
    if (typeof source.unlockAll === "boolean") p.unlockAll = source.unlockAll;
    if (Array.isArray(source.recent))
      p.recent = source.recent
        .filter(
          (r) =>
            r &&
            typeof r.eventId === "string" &&
            r.eventId.length <= 160 &&
            definitionByType[r.type] &&
            typeof r.correct === "boolean" &&
            integer(r.difficulty, 1, 5),
        )
        .slice(-200);
    if (source.daily && typeof source.daily === "object")
      for (const [day, ids] of Object.entries(source.daily).slice(-31))
        if (/^\d{4}-\d{2}-\d{2}$/.test(day) && Array.isArray(ids))
          p.daily[day] = ids
            .filter(
              (id): id is string => typeof id === "string" && id.length < 100,
            )
            .slice(0, 3);
    const s = source.session;
    if (
      s &&
      typeof s.lessonId === "string" &&
      s.lessonId.length < 100 &&
      integer(s.index, 0, 14) &&
      Array.isArray(s.questionIds) &&
      s.questionIds.length <= 15 &&
      s.questionIds.every((id) => typeof id === "string" && id.length < 100)
    )
      p.session = {
        lessonId: s.lessonId,
        index: s.index,
        questionIds: s.questionIds,
      };
    return p;
  } catch {
    return freshLearning();
  }
}
export function saveLearningProgress(p: LearningProgress) {
  try {
    localStorage.setItem(LEARNING_KEY, JSON.stringify(p));
    window.dispatchEvent(new Event("number-block-learning-changed"));
  } catch {
    /* Learning remains usable for this session. */
  }
}
export function resetLearningProgress() {
  try {
    localStorage.removeItem(LEARNING_KEY);
  } catch {
    /* Unavailable storage. */
  }
  window.dispatchEvent(new Event("number-block-learning-reset"));
  window.dispatchEvent(new Event("number-block-learning-changed"));
}
export function totalLearningStars() {
  return Object.values(loadLearningProgress().stars).reduce((n, s) => n + s, 0);
}
export function recordLearningAttempt(
  p: LearningProgress,
  event: {
    eventId: string;
    type: ExerciseType;
    correct: boolean;
    difficulty: Difficulty;
    guided: boolean;
    hints: number;
  },
): LearningProgress {
  if (p.recent.some((r) => r.eventId === event.eventId)) return p;
  const old = p.skills[event.type] ?? {
    attempts: 0,
    correct: 0,
    guided: 0,
    hints: 0,
    lastDifficulty: event.difficulty,
    streak: 0,
  };
  return {
    ...p,
    skills: {
      ...p.skills,
      [event.type]: {
        attempts: old.attempts + 1,
        correct: old.correct + Number(event.correct),
        guided: old.guided + Number(event.guided),
        hints: old.hints + event.hints,
        lastDifficulty: event.difficulty,
        streak:
          event.correct && !event.guided && event.hints === 0
            ? old.streak + 1
            : 0,
      },
    },
    recent: [
      ...p.recent,
      {
        eventId: event.eventId,
        type: event.type,
        correct: event.correct,
        difficulty: event.difficulty,
      },
    ].slice(-200),
  };
}
export function completeLearning(
  p: LearningProgress,
  lessonId: string,
): LearningProgress {
  return {
    ...p,
    stars: /^W[1-8]-L(?:0[1-9]|10)$/.test(lessonId)
      ? { ...p.stars, [lessonId]: 3 }
      : p.stars,
    sessions: p.sessions + 1,
    session: null,
  };
}
