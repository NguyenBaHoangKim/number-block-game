import { test, expect } from "@playwright/test";
import {
  worlds,
  curriculumLessons,
  curriculumQuestions,
  lessonById,
  aliasTypes,
} from "../src/data/expansion/curriculum";
import {
  definitions,
  definitionByType,
} from "../src/features/exercises/catalog";
import {
  validateQuestion,
  validateChoicePayload,
  solutionFor,
} from "../src/features/exercises/validators";
import {
  dailyQuestions,
  practiceQuestions,
} from "../src/features/worlds/practice";
import {
  freshLearning,
  recordLearningAttempt,
  completeLearning,
} from "../src/services/learningStorage";
test("80 lesson blueprint, 800 valid questions, all 67 types and acyclic prerequisites", () => {
  expect(worlds).toHaveLength(8);
  expect(curriculumLessons).toHaveLength(80);
  expect(curriculumQuestions).toHaveLength(800);
  expect(new Set(curriculumQuestions.map((q) => q.id)).size).toBe(800);
  expect(new Set(curriculumQuestions.map((q) => q.type)).size).toBe(67);
  for (const world of worlds) {
    expect(world.lessonIds).toHaveLength(10);
    expect(
      world.lessonIds.every((id) => lessonById[id]?.worldId === world.id),
    ).toBe(true);
  }
  for (const lesson of curriculumLessons) {
    expect(lesson.learningObjectives.length).toBeGreaterThan(0);
    expect(lesson.questionIds).toHaveLength(10);
    for (const prereq of lesson.prerequisites)
      expect(curriculumLessons.indexOf(lessonById[prereq])).toBeLessThan(
        curriculumLessons.indexOf(lesson),
      );
  }
  for (const q of curriculumQuestions) {
    expect(definitionByType[q.type]).toBeDefined();
    expect(definitionByType[q.type].engine).toBe(q.payload.kind);
    expect(validateQuestion(q, solutionFor(q)).status, q.id).toBe("correct");
    if (q.payload.kind === "choice")
      expect(validateChoicePayload(q.payload), JSON.stringify(q)).toBe(true);
  }
  for (const type of Object.values(aliasTypes))
    expect(definitionByType[type]).toBeDefined();
});
test("daily seed is stable, learning adapts safely and stars cannot grow by replay", () => {
  expect(dailyQuestions("2026-10-30")).toEqual(dailyQuestions("2026-10-30"));
  expect(dailyQuestions("2026-10-30")).toHaveLength(3);
  expect(dailyQuestions("2026-10-31")).not.toEqual(
    dailyQuestions("2026-10-30"),
  );
  const p = freshLearning();
  const event = {
    eventId: "one",
    type: definitions[0].type,
    correct: false,
    difficulty: 3 as const,
    guided: false,
    hints: 0,
  };
  const failed = recordLearningAttempt(p, event);
  expect(recordLearningAttempt(failed, event)).toBe(failed);
  const questions = practiceQuestions(failed, "tap_counting");
  expect(questions).toHaveLength(5);
  expect(questions.every((q) => q.difficulty === 2)).toBe(true);
  const completed = completeLearning(p, "W1-L01");
  expect(completeLearning(completed, "W1-L01").stars).toEqual({ "W1-L01": 3 });
  expect(p.stars).toEqual({});
});
