import type { LessonStep } from "../../types/lesson";

export type ValidationResult = {
  status: "incomplete" | "correct" | "incorrect";
  message: string;
};
export function validateLegacyQuestion(
  step: LessonStep,
  answer: unknown,
): ValidationResult {
  if (!step.question || answer === undefined || answer === null)
    return { status: "incomplete", message: "Bé chọn một đáp án trước nhé." };
  if (!step.question.options.includes(answer as string | number))
    return { status: "incorrect", message: step.hint };
  return answer === step.question.answer
    ? { status: "correct", message: step.question.explanation }
    : { status: "incorrect", message: step.hint };
}
export function validateCount(
  expected: number,
  ids: readonly string[],
): boolean {
  return (
    Number.isInteger(expected) &&
    expected >= 0 &&
    ids.length === expected &&
    new Set(ids).size === expected
  );
}
export function validateSharing(
  total: number,
  recipients: number,
  counts: readonly number[],
): boolean {
  return (
    Number.isInteger(total) &&
    total >= 0 &&
    Number.isInteger(recipients) &&
    recipients > 0 &&
    total % recipients === 0 &&
    counts.length === recipients &&
    counts.every((n) => Number.isInteger(n) && n === total / recipients)
  );
}
