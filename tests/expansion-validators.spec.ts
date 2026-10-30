import { test, expect } from "@playwright/test";
import { definitions } from "../src/features/exercises/catalog";
import { generateQuestion } from "../src/features/exercises/generator";
import {
  calculate,
  shortestRoute,
  solutionFor,
  solutions,
  validateChoicePayload,
  validateQuestion,
} from "../src/features/exercises/validators";
import type {
  Difficulty,
  ExerciseQuestion,
} from "../src/features/exercises/types";
for (const definition of definitions)
  test(`validator ${definition.number}: ${definition.type}, three levels and reproducible variants`, () => {
    for (const difficulty of [1, 3, 5] as Difficulty[])
      for (let seed = 1; seed <= 8; seed++) {
        const q = generateQuestion(definition.type, difficulty, seed);
        expect(generateQuestion(definition.type, difficulty, seed)).toEqual(q);
        expect(validateQuestion(q, null).status).toBe("incomplete");
        expect(
          validateQuestion(q, solutionFor(q)).status,
          JSON.stringify(q),
        ).toBe("correct");
        expect(
          validateQuestion(q, { kind: "choice", value: "__wrong__" }).status,
        ).not.toBe("correct");
        if (q.payload.kind === "choice") {
          expect(validateChoicePayload(q.payload), JSON.stringify(q)).toBe(
            true,
          );
          const allowed = solutions(q.payload.rule, q.payload.options);
          const wrong = q.payload.options.find((o) => !allowed.includes(o));
          expect(wrong).toBeDefined();
          expect(
            validateQuestion(
              q,
              q.payload.multiple
                ? { kind: "set", values: [wrong] }
                : { kind: "choice", value: wrong },
            ).status,
          ).toBe("incorrect");
        }
      }
  });
test("hand checked arithmetic, multi answers and boundaries", () => {
  expect(calculate(3, "+", 2)).toBe(5);
  expect(calculate(5, "-", 2)).toBe(3);
  expect(calculate(3, "×", 4)).toBe(12);
  expect(Number.isNaN(calculate(4, "÷", 0))).toBe(true);
  expect(solutions({ kind: "balance", a: 3, b: 2, c: 1 }, [])).toEqual([4]);
  expect(solutions({ kind: "neighbor", n: 1, direction: -1 }, [])).toEqual([0]);
  expect(solutions({ kind: "distance", a: 7, b: 3 }, [])).toEqual([4]);
  expect(solutions({ kind: "calendar", day: 6, offset: 1 }, [])).toEqual([
    "Thứ Hai",
  ]);
  expect(
    solutions({ kind: "fraction_compare", left: [1, 2], right: [1, 4] }, []),
  ).toEqual([">"]);
  expect(
    solutions({ kind: "fraction_compare", left: [1, 2], right: [2, 4] }, []),
  ).toEqual(["="]);
  expect(
    solutions({ kind: "closest", target: 8, candidates: [7, 9] }, []),
  ).toEqual([7, 9]);
  expect(
    solutions(
      {
        kind: "constraints",
        candidates: [0, 2, 4, 6, 8, 10],
        min: 5,
        max: 10,
        parity: "even",
        all: true,
      },
      [],
    ),
  ).toEqual([6, 8]);
  expect(
    solutions(
      {
        kind: "chart",
        bars: [
          { label: "A", value: 3 },
          { label: "B", value: 3 },
        ],
        ask: "max",
      },
      [],
    ),
  ).toEqual(["A", "B"]);
});
test("duplicate pairs, malformed values, bad geometry, teleporting and wrong sharing are rejected", () => {
  const parts = generateQuestion("number_bonds", 3, 2);
  if (parts.payload.kind !== "parts") throw Error("parts");
  expect(
    validateQuestion(parts, {
      kind: "parts",
      pairs: [
        [1, parts.payload.target - 1],
        [parts.payload.target - 1, 1],
        [2, parts.payload.target - 2],
      ],
    }).status,
  ).toBe("incorrect");
  const geo = generateQuestion("copy_structure", 3, 1);
  const answer = solutionFor(geo);
  if (answer.kind !== "placements") throw Error("placements");
  const moved = structuredClone(answer);
  moved.items[0].x += 20;
  expect(validateQuestion(geo, moved).status).toBe("incorrect");
  const rotated = generateQuestion("tangram", 3, 1);
  const rotationAnswer = solutionFor(rotated);
  if (rotationAnswer.kind !== "placements") throw Error("placements");
  rotationAnswer.items[0].rotation += 45;
  expect(validateQuestion(rotated, rotationAnswer).status).toBe("incorrect");
  const path = generateQuestion("shortest_path", 3, 1);
  if (path.payload.kind !== "path") throw Error("path");
  expect(shortestRoute(path.payload).length).toBe(7);
  expect(validateQuestion(path, { kind: "path", cells: [0, 15] }).status).toBe(
    "incorrect",
  );
  const share = generateQuestion("equal_sharing_division", 3, 1);
  expect(
    validateQuestion(share, { kind: "distribution", counts: [99, 0] }).status,
  ).toBe("incorrect");
  for (const wrong of [false, 4, "x", [], {}, undefined])
    expect(validateQuestion(share, wrong).status).not.toBe("correct");
  const count: ExerciseQuestion = {
    ...generateQuestion("tap_counting", 1, 1),
    payload: { kind: "count", count: 0 },
  };
  expect(validateQuestion(count, { kind: "counted", ids: [] }).status).toBe(
    "correct",
  );
  expect(validateQuestion(count, { kind: "counted", ids: [0] }).status).toBe(
    "incorrect",
  );
});
