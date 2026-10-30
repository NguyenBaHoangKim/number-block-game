import type { Difficulty, ExerciseType } from "../exercises/types";
import type { LearningProgress } from "../../services/learningStorage";
import { definitions } from "../exercises/catalog";
import { generateQuestion, seeded, shuffle } from "../exercises/generator";
export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function hashText(text: string) {
  return [...text].reduce(
    (n, c) => Math.imul(n ^ c.charCodeAt(0), 16777619) >>> 0,
    2166136261,
  );
}
export function dailyQuestions(day: string) {
  const seed = hashText(day),
    random = seeded(seed);
  const sets: ExerciseType[][] = [
    ["tap_counting", "match_number_quantity", "ten_frame_completion"],
    ["block_addition", "block_subtraction", "missing_number"],
    ["shape_recognition", "number_pattern", "before_after_number"],
  ];
  return sets.map((types, i) =>
    generateQuestion(
      types[Math.floor(random() * types.length)],
      (i === 0 ? 1 : 2) as Difficulty,
      seed + i,
      `daily-${day}-${i + 1}`,
    ),
  );
}
export function practiceQuestions(p: LearningProgress, type?: ExerciseType) {
  const seed = hashText(`${dateKey()}-${p.sessions}-${type ?? "adaptive"}`),
    random = seeded(seed);
  const ranking = definitions
    .filter((d) => p.skills[d.type]?.attempts || d.number <= 15)
    .map((d) => ({
      type: d.type,
      weight:
        (p.skills[d.type]
          ? 1 -
            p.skills[d.type]!.correct / Math.max(1, p.skills[d.type]!.attempts)
          : 0.5) +
        (p.skills[d.type]?.guided ?? 0) /
          Math.max(1, p.skills[d.type]?.attempts ?? 1),
    }))
    .sort((a, b) => b.weight - a.weight);
  const candidates = ranking
    .slice(0, Math.max(3, Math.ceil(ranking.length / 2)))
    .map((r) => r.type);
  const types = type
    ? Array<ExerciseType>(5).fill(type)
    : shuffle(candidates, random).slice(0, 5);
  while (types.length < 5)
    types.push(candidates[types.length % candidates.length]);
  return types.map((skill, i) => {
    const record = p.skills[skill];
    const level = record
      ? record.streak >= 3
        ? Math.min(5, record.lastDifficulty + 1)
        : record.correct / Math.max(record.attempts, 1) < 0.5
          ? Math.max(1, record.lastDifficulty - 1)
          : record.lastDifficulty
      : 1;
    return generateQuestion(
      skill,
      level as Difficulty,
      seed + i,
      `practice-${skill}-${seed}-${i}`,
    );
  });
}
