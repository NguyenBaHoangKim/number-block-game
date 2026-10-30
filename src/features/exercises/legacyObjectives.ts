import type { LessonStep } from "../../types/lesson";

/** The groups displayed in a scene are not necessarily the groups being counted. */
export function countObjective(step: LessonStep) {
  const groups =
    step.config?.countTargetGroups ?? step.values.map((_, index) => index);
  if (
    !groups.length ||
    new Set(groups).size !== groups.length ||
    groups.some(
      (index) =>
        !Number.isInteger(index) || index < 0 || index >= step.values.length,
    )
  )
    throw new RangeError(`Invalid count targets: ${step.id}`);
  return {
    groups,
    total: groups.reduce((sum, index) => sum + step.values[index], 0),
  };
}
