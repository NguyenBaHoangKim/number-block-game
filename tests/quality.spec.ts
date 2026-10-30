import { test, expect } from "@playwright/test";
import {
  curriculumLessons,
  curriculumQuestions,
  questionById,
} from "../src/data/expansion/curriculum";
import { generateQuestion } from "../src/features/exercises/generator";
import {
  solutionFor,
  validateQuestion,
} from "../src/features/exercises/validators";
import { tangramSlots, cakeSlots } from "../src/features/exercises/tangram";
import { LEARNING_KEY } from "../src/services/learningStorage";
import { appConfig } from "../src/data/mockData";

test("each lesson has real content variation, not only changed identifiers", () => {
  for (const lesson of curriculumLessons) {
    const signatures = lesson.questionIds.map((id) => {
      const p = questionById[id].payload;
      return JSON.stringify(p.kind === "choice" ? p.rule : p);
    });
    expect.soft(new Set(signatures).size, lesson.id).toBeGreaterThanOrEqual(3);
  }
  expect(curriculumQuestions.every((q) => q.hints.length === 3)).toBe(true);
  const order = generateQuestion("number_train", 3, 2);
  expect(validateQuestion(order, { kind: "order", values: [] }).status).toBe(
    "incomplete",
  );
  const sorted = solutionFor(order);
  if (sorted.kind !== "order") throw Error("order");
  expect(
    validateQuestion(order, { ...sorted, values: sorted.values.slice(0, -1) })
      .status,
  ).toBe("incomplete");
});
test("Tangram tiles a square and cake sectors form a whole of equal parts", () => {
  function area(slot: ReturnType<typeof tangramSlots>[number]) {
    const points = slot.polygon!;
    return (
      ((Math.abs(
        points.reduce((sum, p, i) => {
          const next = points[(i + 1) % points.length];
          return sum + p[0] * next[1] - next[0] * p[1];
        }, 0),
      ) /
        2) *
        slot.width! *
        slot.height!) /
      10000
    );
  }
  for (let seed = 0; seed < 4; seed++) {
    const slots = tangramSlots(seed);
    expect(slots).toHaveLength(7);
    expect(slots.reduce((sum, s) => sum + area(s), 0)).toBeCloseTo(3600, 5);
    expect(slots.map(area).sort((a, b) => a - b)).toEqual(
      expect.arrayContaining([expect.closeTo(225, 5), expect.closeTo(900, 5)]),
    );
    // Sample interior points to check that the dissection has neither gaps nor overlapping pieces.
    for (let x = 20.31; x < 80; x += 3.19)
      for (let y = 20.47; y < 80; y += 3.13) {
        let covered = 0;
        for (const slot of slots) {
          const pts = slot.polygon!.map(([px, py]) => [
            slot.x - slot.width! / 2 + (px * slot.width!) / 100,
            slot.y - slot.height! / 2 + (py * slot.height!) / 100,
          ]);
          let inside = false;
          for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
            const [xi, yi] = pts[i],
              [xj, yj] = pts[j];
            if (
              yi > y !== yj > y &&
              x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
            )
              inside = !inside;
          }
          if (inside) covered++;
        }
        expect(covered, `${seed}:${x},${y}`).toBe(1);
      }
  }
  for (const n of [2, 4] as const) {
    const slots = cakeSlots(n, 1),
      areas = slots.map(area);
    expect(areas.every((a) => Math.abs(a - areas[0]) < 0.0001)).toBe(true);
    expect(areas.reduce((a, b) => a + b, 0)).toBeCloseTo(Math.PI * 34 * 34, -1);
  }
  const q = generateQuestion("tangram", 3, 1),
    a = solutionFor(q);
  if (a.kind !== "placements") throw Error("placements");
  expect(
    validateQuestion(q, { ...a, items: a.items.map(() => null) }).status,
  ).toBe("incorrect");
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
test("pause traps keyboard focus, Escape resumes, and repeated correct submissions record once", async ({
  page,
}) => {
  await page.goto("/#practice/number_machine/1");
  await page.getByRole("button", { name: "Tạm dừng bài học" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() => !!document.activeElement?.closest("dialog")),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Gợi ý", exact: true }).click();
  await page
    .getByRole("button", { name: "Xem một cách làm mẫu", exact: true })
    .click();
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await page.evaluate(() => {
    const button = Array.from(
      document.querySelectorAll<HTMLButtonElement>("button"),
    ).find((b) => b.textContent?.trim() === "Kiểm tra");
    button?.click();
    button?.click();
  });
  const progress = await page.evaluate(
    (k) => JSON.parse(localStorage.getItem(k)!),
    LEARNING_KEY,
  );
  expect(progress.skills.number_machine.attempts).toBe(1);
  expect(progress.skills.number_machine.guided).toBe(1);
  expect(progress.skills.number_machine.streak).toBe(0);
});
test("pointer dragging places a piece; undo and tap placement work without drag", async ({
  page,
}) => {
  await page.goto("/#practice/copy_structure/1");
  const piece = page.getByRole("button", { name: "Chọn mảnh 1", exact: true });
  const slot = page.getByRole("button", { name: "Vị trí ghép 1", exact: true });
  await piece.scrollIntoViewIfNeeded();
  // Keep both board and tray visible in the viewport.
  await page.setViewportSize({ width: 1200, height: 1300 });
  const a = await piece.boundingBox(),
    b = await slot.boundingBox();
  if (!a || !b) throw Error("Missing piece/slot");
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect(page.locator(".piece-slot.placed")).toHaveCount(1);
  await page.getByRole("button", { name: "Hoàn tác", exact: true }).click();
  await expect(page.locator(".piece-slot.placed")).toHaveCount(0);
  await piece.click();
  await slot.click();
  await expect(page.locator(".piece-slot.placed")).toHaveCount(1);
});
test("free building supports tap move and undo/redo; quick rounds offer 5/10/15", async ({
  page,
}) => {
  await page.goto("/#playground");
  await page
    .getByRole("button", { name: "Xưởng xây dựng", exact: true })
    .click();
  await page.getByRole("button", { name: "Ô xây dựng 1", exact: true }).click();
  await page
    .getByRole("button", { name: "Di chuyển khối", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Ô xây dựng 1, có khối", exact: true })
    .click();
  await page.getByRole("button", { name: "Ô xây dựng 2", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Ô xây dựng 2, có khối", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Hoàn tác", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Ô xây dựng 1, có khối", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Làm lại bước", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Ô xây dựng 2, có khối", exact: true }),
  ).toBeVisible();
  await page.goto("/#challenge");
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await page
    .getByRole("combobox", { name: "Số câu mỗi vòng" })
    .selectOption("15");
  await page.getByRole("button", { name: "Bắt đầu thử thách" }).click();
  await expect(page.locator(".challenge-status")).toContainText("1 / 15");
});
test("corrupt learning storage recovers and reduced motion disables new game animations", async ({
  page,
}) => {
  await page.addInitScript(
    (k) => localStorage.setItem(k, "{broken"),
    LEARNING_KEY,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#worlds");
  await expect(page.locator(".world-card")).toHaveCount(8);
  await page.goto("/#practice/answer_platform_jump/1");
  expect(
    await page
      .locator(".platform-traveler")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
