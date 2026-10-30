import type { ExerciseQuestion, Payload } from "./types";
export function payloadOf<K extends Payload["kind"]>(
  question: ExerciseQuestion,
  kind: K,
): Extract<Payload, { kind: K }> {
  if (question.payload.kind !== kind)
    throw new Error(`Payload ${question.payload.kind} does not match ${kind}`);
  return question.payload as Extract<Payload, { kind: K }>;
}
