import { test, expect } from "@playwright/test";
import { lessons } from "../src/data/mockData";
import {
  validateLegacyQuestion,
  validateCount,
  validateSharing,
} from "../src/features/exercises/legacyValidators";
test("legacy validators distinguish incomplete, right and wrong without UI", () => {
  for (const step of lessons
    .flatMap((l) => l.steps)
    .filter((s) => s.question)) {
    expect(validateLegacyQuestion(step, null).status).toBe("incomplete");
    expect(validateLegacyQuestion(step, step.question!.answer).status).toBe(
      "correct",
    );
    for (const wrong of step.question!.options.filter(
      (o) => o !== step.question!.answer,
    ))
      expect(validateLegacyQuestion(step, wrong).status).toBe("incorrect");
  }
  expect(validateCount(3, ["a", "b", "c"])).toBe(true);
  expect(validateCount(3, ["a", "a", "b"])).toBe(false);
  expect(validateCount(0, [])).toBe(true);
  expect(validateCount(3, ["a", "b", "c", "c"])).toBe(false);
  expect(validateSharing(6, 3, [2, 2, 2])).toBe(true);
  expect(validateSharing(6, 3, [3, 2, 1])).toBe(false);
  expect(validateSharing(5, 3, [2, 2, 1])).toBe(false);
  expect(validateSharing(6, 0, [])).toBe(false);
});
