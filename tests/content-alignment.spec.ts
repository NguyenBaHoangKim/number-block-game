import { test, expect, type Page } from "@playwright/test";
import {
  lessons,
  numberCharacters,
  shapeChoices,
  appConfig,
} from "../src/data/mockData";
import { countObjective } from "../src/features/exercises/legacyObjectives";
import { curriculumQuestions } from "../src/data/expansion/curriculum";
import type { LessonStep } from "../src/types/lesson";

test("every legacy question agrees with its actual visual and counting completion target", () => {
  for (const lesson of lessons)
    for (const step of lesson.steps) {
      if (step.activity === "count") {
        const goal = countObjective(step);
        expect(goal.total, step.id).toBeGreaterThan(0);
        expect(
          goal.groups.every((i) => i >= 0 && i < step.values.length),
          step.id,
        ).toBe(true);
      }
      if (step.config?.splitTarget !== undefined)
        expect(step.config.splitTarget).toBe(step.values[1]);
      if (step.config?.balanceTarget)
        expect(step.config.balanceTarget.reduce((a, b) => a + b, 0)).toBe(
          step.values.reduce((a, b) => a + b, 0),
        );
      const q = step.question;
      if (!q) continue;
      const [a, b] = step.values;
      let answer: string | number;
      switch (step.activity) {
        case "count": {
          const wanted =
            typeof q.answer === "number"
              ? q.answer
              : numberCharacters.find((c) => c.name === q.answer)?.value;
          // Unlike checking answer alone, this checks the amount the child must actually touch.
          expect(countObjective(step).total, `${step.id}: ${q.prompt}`).toBe(
            wanted,
          );
          continue;
        }
        case "merge":
        case "numberline":
          answer = a + b;
          break;
        case "split":
          answer = a - b;
          break;
        case "compare":
          answer = a === b ? "=" : a > b ? ">" : "<";
          break;
        case "pattern":
          answer = step.values.at(-1)! + (step.config?.patternIncrement ?? 1);
          break;
        case "missing":
          answer = b - a;
          break;
        case "grouping":
          answer = a * b;
          break;
        case "sharing":
          answer = a / b;
          break;
        case "parity":
          answer = a % 2 ? "Lẻ" : "Chẵn";
          break;
        case "bridge":
          answer = b;
          break;
        case "clock":
          answer = `${a} giờ`;
          break;
        case "memory":
          answer = a;
          break;
        case "shapes":
          answer = shapeChoices.find(
            (s) => s.kind === (step.config?.targetShape ?? "triangle"),
          )!.corners;
          break;
        case "match":
          answer = step.values.at(-1)!;
          break;
        default:
          throw Error(`Unreviewed question: ${step.id}`);
      }
      expect(q.answer, `${step.id}: ${q.prompt}`).toBe(answer);
      expect(q.options.includes(answer), step.id).toBe(true);
    }
  const play = lessons[1].steps.find((s) => s.type === "interact")!;
  expect(play.values).toEqual([4, 5]);
  expect(countObjective(play)).toEqual({ groups: [1], total: 5 });
  const sky = lessons[3].steps.find((s) => s.type === "interact")!;
  expect(sky.values).toEqual([10]);
  expect(countObjective(sky).total).toBe(10);
  expect(() =>
    countObjective({ ...play, config: { countTargetGroups: [8] } }),
  ).toThrow();
});
test("all 800 new questions have consistent quantities, source items and explicit multiple answers", () => {
  for (const q of curriculumQuestions) {
    const p = q.payload;
    if (p.kind === "count") {
      const capacity = p.capacity ?? p.count,
        prefilled = p.prefilled ?? 0;
      expect(capacity, q.id).toBe(p.count);
      expect(prefilled, q.id).toBeGreaterThanOrEqual(0);
      expect(prefilled, q.id).toBeLessThanOrEqual(capacity);
      if (q.type === "ten_frame_completion") {
        expect(capacity).toBe(10);
        expect(q.instruction).toContain(String(prefilled));
      }
    } else if (p.kind === "distribution") {
      expect(
        p.targets.reduce((a, b) => a + b, 0),
        q.id,
      ).toBe(p.total);
      expect(p.labels.length, q.id).toBe(p.targets.length);
      if (p.items)
        for (let i = 0; i < p.targets.length; i++)
          expect(
            p.items.filter((item) => item.category === i).length,
            q.id,
          ).toBe(p.targets[i]);
      if (p.mode === "groups" || p.mode === "share")
        expect(
          p.targets.every((n) => n === p.targets[0]),
          q.id,
        ).toBe(true);
    } else if (p.kind === "parts")
      expect(p.target, q.id).toBeGreaterThanOrEqual(2 * p.minPart);
    else if (p.kind === "choice") {
      const r = p.rule;
      if (r.kind === "arithmetic") {
        const value =
          r.op === "+"
            ? r.a + r.b
            : r.op === "-"
              ? r.a - r.b
              : r.op === "×"
                ? r.a * r.b
                : r.a / r.b;
        const wanted =
          r.ask === "operator" ? r.op : r.ask === "missing" ? r.b : value;
        if (r.ask === "equation" || r.ask === "reverse") {
          const matching = p.options.filter((option) => {
            if (typeof option !== "string") return false;
            const parts = /^(\d+)\s*([+−×÷-])\s*(\d+)$/.exec(option);
            if (!parts) return false;
            const a = Number(parts[1]),
              b = Number(parts[3]),
              op = parts[2];
            const result =
              op === "+"
                ? a + b
                : op === "-" || op === "−"
                  ? a - b
                  : op === "×"
                    ? a * b
                    : a / b;
            return r.ask === "reverse"
              ? result === value
              : result === value && op.replace("−", "-") === r.op;
          });
          expect(matching.length, q.id).toBeGreaterThan(0);
        } else expect(p.options.includes(wanted), q.id).toBe(true);
      }
      if (r.kind === "chart") {
        const values = r.bars.map(
          (b, i) =>
            b.value + (r.ask === "predict" ? (r.additional?.[i] ?? 0) : 0),
        );
        if (r.ask !== "difference") {
          const target =
            r.ask === "min" ? Math.min(...values) : Math.max(...values);
          if (values.filter((n) => n === target).length > 1)
            expect(p.multiple, q.id).toBe(true);
        }
      }
      if (r.kind === "constraints") expect(p.multiple, q.id).toBe(true);
    }
  }
});
test.beforeEach(async ({ page }) => {
  await page.addInitScript(
    (key) =>
      localStorage.setItem(
        key,
        JSON.stringify({
          settings: { voice: false, music: false, effects: false },
        }),
      ),
    appConfig.storageKey,
  );
});
async function skipGreeting(page: Page, id: string) {
  await page.goto(`/#play/${id}`);
  await page
    .getByRole("button", { name: "Bỏ qua lời chào", exact: true })
    .click();
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
}
test("lesson 2 requires only Đào's five blocks, ignores Lá, and reset revokes completion", async ({
  page,
}) => {
  await skipGreeting(page, "lesson-2");
  await expect(page.locator(".lesson-heading")).toContainText(
    "Đào đứng bên phải",
  );
  const leaf = page.locator('[data-count-group="0"] .count-block'),
    peach = page.locator('[data-count-group="1"] .count-block');
  await expect(leaf).toHaveCount(4);
  await expect(peach).toHaveCount(5);
  for (const block of await leaf.all()) await expect(block).toBeDisabled();
  await expect(page.locator(".workspace-caption")).toContainText("0 / 5");
  await peach.first().click();
  await peach.first().click();
  await expect(page.locator(".count-block.counted")).toHaveCount(1);
  for (let i = 1; i < 4; i++) await peach.nth(i).click();
  const next = page.getByRole("button", { name: "Tiếp tục", exact: true });
  await expect(next).toBeDisabled();
  await expect(page.locator(".workspace-caption")).toContainText("4 / 5");
  await peach.nth(4).click();
  await expect(next).toBeEnabled();
  await expect(page.locator(".workspace-caption")).toContainText(
    "5 khối của bạn Đào",
  );
  await page.getByRole("button", { name: "Đếm lại", exact: true }).click();
  await expect(next).toBeDisabled();
  await expect(page.locator(".workspace-caption")).toContainText("0 / 5");
  for (const block of await peach.all()) await block.click();
  await next.click();
  await page.getByRole("button", { name: "Đào", exact: true }).click();
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await expect(page.locator(".feedback.success")).toContainText("5 khối");
});
test("lesson 4 counts ten blocks of Trời rather than all forty blocks from the introduction", async ({
  page,
}) => {
  await skipGreeting(page, "lesson-4");
  await expect(page.locator(".lesson-heading")).toContainText("Trời");
  await expect(page.locator(".count-block")).toHaveCount(10);
  for (const block of await page.locator(".count-block").all())
    await block.click();
  await expect(
    page.getByRole("button", { name: "Tiếp tục", exact: true }),
  ).toBeEnabled();
});
async function mount(page: Page, step: LessonStep) {
  await page.goto("/");
  await page.evaluate(async (data) => {
    const path = "/tests/fixtures/LegacyActivityHarness.tsx";
    const harness = await import(path);
    harness.mountActivity(data);
  }, step);
  await expect(page.locator("#audit-next")).toBeVisible();
}
test("every legacy counting scene completes exactly its stated target and reset makes it pending", async ({
  page,
}) => {
  for (const step of lessons
    .flatMap((l) => l.steps)
    .filter((s) => s.activity === "count")) {
    await mount(page, step);
    const target = page.locator(".count-block:not(:disabled)"),
      next = page.locator("#audit-next");
    const expected = countObjective(step).total;
    await expect(target).toHaveCount(expected);
    await expect(next).toBeDisabled();
    for (let i = 0; i < expected - 1; i++) await target.nth(i).click();
    await expect(next).toBeDisabled();
    await target.nth(expected - 1).click();
    await expect(next).toBeEnabled();
    await page.getByRole("button", { name: "Đếm lại", exact: true }).click();
    await expect(next).toBeDisabled();
  }
});
test("number line waits for all steps; balance waits for the specified groups; wrong choice cancels ready", async ({
  page,
}) => {
  const base: LessonStep = {
    id: "audit",
    activity: "numberline",
    type: "interact",
    title: "Đi hai bước",
    instruction: "Từ 3 đi thêm 2 bước",
    values: [3, 2],
    hint: "",
  };
  await mount(page, base);
  await page.getByRole("button", { name: "Tiến 1 bước", exact: true }).click();
  await expect(page.locator("#audit-next")).toBeDisabled();
  await page.getByRole("button", { name: "Tiến 1 bước", exact: true }).click();
  await expect(page.locator("#audit-next")).toBeEnabled();
  await page.getByRole("button", { name: "Làm lại", exact: true }).click();
  await expect(page.locator("#audit-next")).toBeDisabled();
  const balance = lessons[12].steps.find((s) => s.id === "l13-balance")!;
  await mount(page, balance);
  await page
    .getByRole("button", { name: "Chuyển sang phải", exact: false })
    .click();
  await expect(page.locator("#audit-next")).toBeDisabled();
  await page.getByRole("button", { name: "Về 3 và 3", exact: true }).click();
  await expect(page.locator("#audit-next")).toBeEnabled();
  await page
    .getByRole("button", { name: "Chuyển sang trái", exact: false })
    .click();
  await expect(page.locator("#audit-next")).toBeDisabled();
  await mount(page, { ...base, activity: "missing", values: [3, 7] });
  await page.locator(".number-option").getByText("4", { exact: true }).click();
  await expect(page.locator("#audit-next")).toBeEnabled();
  await page.locator(".number-option").getByText("5", { exact: true }).click();
  await expect(page.locator("#audit-next")).toBeDisabled();
  await expect(page.locator(".missing-workspace")).toContainText(
    "Nhiều khối quá",
  );
});
