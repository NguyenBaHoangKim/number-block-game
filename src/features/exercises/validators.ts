import type {
  Answer,
  ChoicePayload,
  ExerciseQuestion,
  Operation,
  PathPayload,
  Rule,
  Scalar,
  Validation,
} from "./types";
import { days, shapeNames, solidNames } from "./catalog";
export function calculate(a: number, op: Operation, b: number): number {
  return op === "+"
    ? a + b
    : op === "-"
      ? a - b
      : op === "×"
        ? a * b
        : b === 0
          ? NaN
          : a / b;
}
export function parseEquation(
  text: Scalar,
): { a: number; op: Operation; b: number } | null {
  if (typeof text !== "string") return null;
  const match = /^(\d+)\s*([+\-−×÷])\s*(\d+)$/.exec(text);
  return match
    ? {
        a: Number(match[1]),
        op: (match[2] === "−" ? "-" : match[2]) as Operation,
        b: Number(match[3]),
      }
    : null;
}
export function solutions(rule: Rule, options: Scalar[]): Scalar[] {
  switch (rule.kind) {
    case "arithmetic": {
      const result = calculate(rule.a, rule.op, rule.b);
      if (rule.ask === "operator")
        return options.filter(
          (o) =>
            ["+", "-", "×", "÷"].includes(String(o)) &&
            calculate(rule.a, o as Operation, rule.b) === result,
        );
      if (rule.ask === "equation" || rule.ask === "reverse")
        return options.filter((o) => {
          const e = parseEquation(o);
          return (
            e &&
            (rule.ask === "reverse"
              ? calculate(e.a, e.op, e.b) === result
              : e.op === rule.op &&
                ((e.a === rule.a && e.b === rule.b) ||
                  ((e.op === "+" || e.op === "×") &&
                    e.a === rule.b &&
                    e.b === rule.a)))
          );
        });
      return [rule.ask === "missing" ? rule.b : result];
    }
    case "balance":
      return [rule.a + rule.b - rule.c];
    case "quantity_compare":
      return [
        rule.a === rule.b
          ? "Bằng nhau"
          : rule.a > rule.b
            ? "Bên trái"
            : "Bên phải",
      ];
    case "relation":
      return [rule.a === rule.b ? "=" : rule.a > rule.b ? ">" : "<"];
    case "closest": {
      const distance = Math.min(
        ...rule.candidates.map((n) => Math.abs(n - rule.target)),
      );
      return rule.candidates.filter(
        (n) => Math.abs(n - rule.target) === distance,
      );
    }
    case "neighbor":
      return [rule.n + rule.direction];
    case "distance":
      return [Math.abs(rule.b - rule.a)];
    case "pattern":
      return [
        rule.repeat
          ? rule.repeat[rule.sequence.length % rule.repeat.length]
          : Number(rule.sequence.at(-1)) + (rule.increment ?? 1),
      ];
    case "chain":
      return [
        rule.operations.reduce(
          (n, o) => calculate(n, o.op, o.value),
          rule.start,
        ),
      ];
    case "estimate":
      return [Math.round((rule.a + rule.b) / rule.roundTo) * rule.roundTo];
    case "shape":
      return [
        rule.ask === "shape"
          ? shapeNames[rule.shape]
          : {
              circle: 0,
              square: 4,
              triangle: 3,
              rectangle: 4,
              parallelogram: 4,
              half: 0,
              quarter: 0,
            }[rule.shape],
      ];
    case "solid":
      return [solidNames[rule.solid]];
    case "measure": {
      if (rule.ask === "value") return [rule.quantities[0]];
      const value =
        rule.ask === "max"
          ? Math.max(...rule.quantities)
          : Math.min(...rule.quantities);
      return rule.quantities.flatMap((n, i) =>
        n === value ? [`Vật ${i + 1}`] : [],
      );
    }
    case "money":
      return [rule.ask === "change" ? rule.budget - rule.price : rule.budget];
    case "calendar":
      return [days[(((rule.day + rule.offset) % 7) + 7) % 7]];
    case "clock":
      return rule.elapsed !== undefined
        ? [rule.elapsed]
        : [`${rule.hour}:${String(rule.minute).padStart(2, "0")}`];
    case "odd": {
      const counts = new Map<Scalar, number>();
      for (const item of rule.items) {
        const key = item[rule.attribute];
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      return rule.items.flatMap((item, i) =>
        counts.get(item[rule.attribute]) === 1 ? [`Vật ${i + 1}`] : [],
      );
    }
    case "constraints":
      return rule.candidates.filter(
        (n) =>
          n > rule.min &&
          n < rule.max &&
          (!rule.parity || (n % 2 === 0) === (rule.parity === "even")),
      );
    case "claims":
      return rule.claims
        .filter((c) =>
          c.relation === ">"
            ? c.a > c.b
            : c.relation === "<"
              ? c.a < c.b
              : c.a === c.b,
        )
        .map((c) => c.id);
    case "code": {
      const values = rule.symbols.map(
        (symbol) => rule.codes.find((c) => c.symbol === symbol)?.value ?? NaN,
      );
      return [
        values.slice(1).reduce((n, v) => calculate(n, rule.op, v), values[0]),
      ];
    }
    case "hidden":
      return [calculate(rule.a, rule.op, rule.b)];
    case "fraction_compare": {
      const delta = rule.left[0] * rule.right[1] - rule.right[0] * rule.left[1];
      return [delta === 0 ? "=" : delta > 0 ? ">" : "<"];
    }
    case "chart": {
      const data = rule.bars.map(
        (b, i) =>
          b.value + (rule.ask === "predict" ? (rule.additional?.[i] ?? 0) : 0),
      );
      if (rule.ask === "difference") {
        const [a, b] = rule.difference ?? [0, 1];
        return [Math.abs(data[a] - data[b])];
      }
      const value = rule.ask === "min" ? Math.min(...data) : Math.max(...data);
      return rule.bars.flatMap((b, i) => (data[i] === value ? [b.label] : []));
    }
  }
}
export function shortestRoute(p: PathPayload): number[] {
  const queue: number[][] = [[p.start]],
    seen = new Set([p.start]);
  while (queue.length) {
    const path = queue.shift()!,
      last = path.at(-1)!;
    if (last === p.goal) return path;
    for (const next of [last - 1, last + 1, last - p.cols, last + p.cols]) {
      if (
        next < 0 ||
        next >= p.cols * p.rows ||
        Math.abs((next % p.cols) - (last % p.cols)) +
          Math.abs(Math.floor(next / p.cols) - Math.floor(last / p.cols)) !==
          1 ||
        seen.has(next) ||
        p.obstacles.includes(next) ||
        (p.allowed && !p.allowed.includes(next))
      )
        continue;
      seen.add(next);
      queue.push([...path, next]);
    }
  }
  return [];
}
export function solutionFor(q: ExerciseQuestion): Answer {
  const p = q.payload;
  switch (p.kind) {
    case "choice": {
      const allowed = solutions(p.rule, p.options);
      return p.multiple
        ? { kind: "set", values: allowed }
        : { kind: "choice", value: allowed[0] };
    }
    case "count":
      return p.pairs
        ? { kind: "choice", value: p.count % 2 ? "Lẻ" : "Chẵn" }
        : p.flashMs
          ? { kind: "choice", value: p.count }
          : {
              kind: "counted",
              ids: Array.from(
                { length: (p.capacity ?? p.count) - (p.prefilled ?? 0) },
                (_, i) => i + (p.prefilled ?? 0),
              ),
            };
    case "parts":
      return {
        kind: "parts",
        pairs: Array.from({ length: p.required }, (_, i) => [
          p.minPart + i,
          p.target - p.minPart - i,
        ]),
      };
    case "order":
      return {
        kind: "order",
        values: [...p.values].sort((a, b) =>
          p.direction === "asc" ? a - b : b - a,
        ),
      };
    case "placement":
      return {
        kind: "placements",
        items: p.slots.map((slot, i) => ({
          pieceId: p.pieces[i].id,
          slotId: slot.id,
          x: slot.x,
          y: slot.y,
          rotation: slot.rotation,
        })),
      };
    case "path":
      return { kind: "path", cells: shortestRoute(p) };
    case "distribution":
      return {
        kind: "distribution",
        counts: [...p.targets],
        ...(p.items
          ? {
              assignments: Object.fromEntries(
                p.items.map((item) => [item.id, item.category]),
              ),
            }
          : {}),
      };
    case "fraction":
      return {
        kind: "fraction",
        denominator: p.denominator,
        selected: Array.from({ length: p.numerator }, (_, i) => i),
      };
    case "mission":
      return {
        kind: "mission",
        values: p.rounds.map((r) => calculate(r.a, r.op, r.b)),
      };
  }
}
const unique = (items: readonly unknown[]) =>
  new Set(items).size === items.length;
const sameSet = (a: Scalar[], b: Scalar[]) =>
  unique(a) && a.length === b.length && a.every((n) => b.includes(n));
function result(ok: boolean, q: ExerciseQuestion): Validation {
  return {
    status: ok ? "correct" : "incorrect",
    message: ok ? q.explanation : q.hints[0],
  };
}
export function validateQuestion(
  q: ExerciseQuestion,
  raw: unknown,
): Validation {
  if (raw === null || raw === undefined)
    return { status: "incomplete", message: "Bé thử thao tác trước nhé." };
  if (typeof raw !== "object" || !("kind" in raw)) return result(false, q);
  const a = raw as Answer,
    p = q.payload;
  switch (p.kind) {
    case "choice": {
      const correct = solutions(p.rule, p.options);
      if (p.multiple) {
        if (a.kind !== "set" || !Array.isArray(a.values))
          return result(false, q);
        if (!a.values.length)
          return {
            status: "incomplete",
            message: "Bé chọn những đáp án phù hợp nhé.",
          };
        return result(
          a.values.every((v) => p.options.includes(v)) &&
            sameSet(a.values, correct),
          q,
        );
      }
      return result(
        a.kind === "choice" &&
          p.options.includes(a.value) &&
          correct.includes(a.value),
        q,
      );
    }
    case "count": {
      if (p.pairs || p.flashMs) {
        const value = p.pairs ? (p.count % 2 ? "Lẻ" : "Chẵn") : p.count;
        return result(a.kind === "choice" && a.value === value, q);
      }
      if (a.kind !== "counted" || !Array.isArray(a.ids))
        return result(false, q);
      const goal = (p.capacity ?? p.count) - (p.prefilled ?? 0);
      if (a.ids.length < goal)
        return {
          status: "incomplete",
          message: "Bé tiếp tục với những ô còn lại nhé.",
        };
      return result(
        unique(a.ids) &&
          a.ids.length === goal &&
          a.ids.every(
            (n) =>
              Number.isInteger(n) &&
              n >= (p.prefilled ?? 0) &&
              n < (p.capacity ?? p.count),
          ),
        q,
      );
    }
    case "parts": {
      if (a.kind !== "parts" || !Array.isArray(a.pairs))
        return result(false, q);
      if (a.pairs.length < p.required)
        return {
          status: "incomplete",
          message: `Bé tìm đủ ${p.required} cách ghép nhé.`,
        };
      const keys = a.pairs.map((pair) =>
        Array.isArray(pair) && pair.length === 2
          ? (p.commutative ? [...pair].sort((x, y) => x - y) : pair).join(":")
          : "invalid",
      );
      return result(
        a.pairs.length === p.required &&
          unique(keys) &&
          a.pairs.every(
            (pair) =>
              Array.isArray(pair) &&
              pair.length === 2 &&
              pair.every((n) => Number.isInteger(n) && n >= p.minPart) &&
              pair[0] + pair[1] === p.target,
          ),
        q,
      );
    }
    case "order":
      if (
        a.kind === "order" &&
        Array.isArray(a.values) &&
        a.values.length < p.values.length
      )
        return {
          status: "incomplete",
          message: "Bé xếp tiếp những thẻ còn lại nhé.",
        };
      return result(
        a.kind === "order" &&
          Array.isArray(a.values) &&
          a.values.length === p.values.length &&
          a.values.every(
            (n, i) =>
              n ===
              (solutionFor(q) as Extract<Answer, { kind: "order" }>).values[i],
          ),
        q,
      );
    case "placement": {
      if (a.kind !== "placements" || !Array.isArray(a.items))
        return result(false, q);
      if (a.items.length < p.slots.length)
        return {
          status: "incomplete",
          message: "Bé còn một vài mảnh chưa đặt nhé.",
        };
      if (a.items.some((item) => !item || typeof item !== "object"))
        return result(false, q);
      return result(
        a.items.length === p.slots.length &&
          unique(a.items.map((i) => i.pieceId)) &&
          unique(a.items.map((i) => i.slotId)) &&
          a.items.every((item) => {
            const piece = p.pieces.find((i) => i.id === item.pieceId),
              slot = p.slots.find((i) => i.id === item.slotId);
            if (!piece || !slot) return false;
            const period =
              piece.shape === "circle"
                ? 1
                : piece.shape === "square"
                  ? 90
                  : piece.shape === "rectangle"
                    ? 180
                    : 360;
            const rotation =
              (((item.rotation - slot.rotation) % period) + period) % period;
            return (
              piece.shape === slot.shape &&
              (!slot.polygon ||
                (Math.abs((piece.width ?? 0) - (slot.width ?? 0)) < 0.01 &&
                  Math.abs((piece.height ?? 0) - (slot.height ?? 0)) < 0.01)) &&
              (!slot.color || slot.color === piece.color) &&
              Number.isFinite(item.x) &&
              Number.isFinite(item.y) &&
              Math.hypot(item.x - slot.x, item.y - slot.y) <= p.tolerance &&
              (rotation <= 1 || period - rotation <= 1)
            );
          }),
        q,
      );
    }
    case "path": {
      if (a.kind !== "path" || !Array.isArray(a.cells)) return result(false, q);
      if (a.cells.at(-1) !== p.goal)
        return {
          status: "incomplete",
          message: "Bé đưa bạn tới ngôi sao đích nhé.",
        };
      return result(
        a.cells[0] === p.start &&
          a.cells.every(
            (cell, i) =>
              Number.isInteger(cell) &&
              cell >= 0 &&
              cell < p.cols * p.rows &&
              !p.obstacles.includes(cell) &&
              (!p.allowed || p.allowed.includes(cell)) &&
              (!i ||
                Math.abs((cell % p.cols) - (a.cells[i - 1] % p.cols)) +
                  Math.abs(
                    Math.floor(cell / p.cols) -
                      Math.floor(a.cells[i - 1] / p.cols),
                  ) ===
                  1),
          ) &&
          (!p.shortest || a.cells.length === shortestRoute(p).length),
        q,
      );
    }
    case "distribution": {
      if (a.kind !== "distribution" || !Array.isArray(a.counts))
        return result(false, q);
      if (a.counts.reduce((n, v) => n + v, 0) < p.total)
        return {
          status: "incomplete",
          message: "Bé còn vật để phân chia nhé.",
        };
      if (
        p.items &&
        (!a.assignments ||
          typeof a.assignments !== "object" ||
          Object.keys(a.assignments).length !== p.items.length ||
          !p.items.every((item) => a.assignments![item.id] === item.category))
      )
        return result(false, q);
      return result(
        a.counts.length === p.targets.length &&
          a.counts.every((n, i) => Number.isInteger(n) && n === p.targets[i]) &&
          a.counts.reduce((n, v) => n + v, 0) === p.total,
        q,
      );
    }
    case "fraction":
      return result(
        a.kind === "fraction" &&
          a.denominator === p.denominator &&
          Array.isArray(a.selected) &&
          a.selected.length === p.numerator &&
          unique(a.selected) &&
          a.selected.every(
            (i) => Number.isInteger(i) && i >= 0 && i < p.denominator,
          ),
        q,
      );
    case "mission": {
      if (a.kind !== "mission" || !Array.isArray(a.values))
        return result(false, q);
      if (a.values.length < p.rounds.length)
        return {
          status: "incomplete",
          message: "Còn một chặng nữa, bé thử tiếp nhé.",
        };
      return result(
        a.values.length === p.rounds.length &&
          a.values.every(
            (v, i) =>
              v === calculate(p.rounds[i].a, p.rounds[i].op, p.rounds[i].b),
          ),
        q,
      );
    }
  }
}
export function validateChoicePayload(p: ChoicePayload): boolean {
  const answers = solutions(p.rule, p.options);
  return (
    unique(p.options) &&
    answers.length > 0 &&
    answers.every((a) => p.options.includes(a)) &&
    p.options.some((a) => !answers.includes(a))
  );
}
