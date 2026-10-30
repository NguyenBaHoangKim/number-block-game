import { test, expect, type Page } from "@playwright/test";
import { definitions } from "../src/features/exercises/catalog";
import { generateQuestion } from "../src/features/exercises/generator";
import {
  solutionFor,
  solutions,
  calculate,
} from "../src/features/exercises/validators";
import { hashText } from "../src/features/worlds/practice";
import type { ExerciseQuestion } from "../src/features/exercises/types";
import { appConfig } from "../src/data/mockData";
import { LEARNING_KEY } from "../src/services/learningStorage";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(
    (key) =>
      localStorage.setItem(
        key,
        JSON.stringify({
          settings: {
            effects: false,
            music: false,
            voice: false,
            background: false,
            volume: 0.3,
          },
        }),
      ),
    appConfig.storageKey,
  );
});
async function solve(page: Page, q: ExerciseQuestion) {
  const p = q.payload;
  const answer = solutionFor(q);
  switch (p.kind) {
    case "choice":
      if (q.type === "number_machine")
        await page
          .getByRole("button", { name: "Chạy máy", exact: true })
          .click();
      for (const value of p.multiple
        ? solutions(p.rule, p.options)
        : [solutions(p.rule, p.options)[0]])
        await page
          .locator(".ex-options>button")
          .getByText(String(value), { exact: true })
          .click();
      break;
    case "count":
      if (p.pairs) {
        for (let i = 0; i < Math.floor(p.count / 2); i++)
          await page
            .getByRole("button", { name: "Ghép một cặp", exact: true })
            .click();
        await page
          .getByRole("button", {
            name: p.count % 2 ? "Lẻ" : "Chẵn",
            exact: true,
          })
          .click();
      } else if (p.flashMs) {
        await page.getByRole("checkbox", { name: "Giữ hộp mở" }).check();
        await page
          .getByRole("button", { name: "Mở hộp bí mật", exact: true })
          .click();
        await page
          .locator(".ex-options>button")
          .getByText(String(p.count), { exact: true })
          .click();
      } else if (p.count === 0 && !p.capacity) {
        await page
          .getByRole("button", { name: "Không có khối nào · 0", exact: true })
          .click();
      } else
        for (const button of await page
          .locator(
            p.capacity
              ? ".ex-ten-frame>button:not(:disabled)"
              : ".ex-tap-field>button",
          )
          .all())
          await button.click();
      break;
    case "parts":
      for (let i = 0; i < p.required; i++) {
        await page.locator(".ex-slider input").fill(String(p.minPart + i));
        await page
          .getByRole("button", { name: "Giữ cách ghép", exact: true })
          .click();
      }
      break;
    case "order":
      if (answer.kind !== "order") throw Error("order");
      for (const n of answer.values)
        await page
          .getByRole("button", { name: `Chọn số ${n}`, exact: true })
          .click();
      break;
    case "placement":
      for (let i = 0; i < p.slots.length; i++) {
        const piece = p.pieces[i],
          slot = p.slots[i];
        await page
          .getByRole("button", { name: `Chọn mảnh ${i + 1}`, exact: true })
          .click();
        for (
          let angle = piece.rotation;
          angle % 360 !== slot.rotation % 360;
          angle += 90
        )
          await page
            .getByRole("button", { name: "Xoay mảnh", exact: true })
            .click();
        const target = page.getByRole("button", {
          name: `Vị trí ghép ${i + 1}`,
          exact: true,
        });
        if (slot.polygon) {
          const box = await target.boundingBox();
          if (!box) throw Error("Missing slot");
          const cx =
            slot.polygon.reduce((sum, point) => sum + point[0], 0) /
            slot.polygon.length;
          const cy =
            slot.polygon.reduce((sum, point) => sum + point[1], 0) /
            slot.polygon.length;
          await target.click({
            position: { x: (box.width * cx) / 100, y: (box.height * cy) / 100 },
          });
        } else await target.click();
      }
      break;
    case "path":
      if (answer.kind !== "path") throw Error("path");
      for (const cell of answer.cells.slice(1))
        await page.locator(".path-grid>button").nth(cell).click();
      break;
    case "distribution":
      if (p.items) {
        for (const item of p.items) {
          await page
            .getByRole("button", {
              name: `Chọn ${p.labels[item.category]} ${item.id}`,
              exact: true,
            })
            .click();
          await page
            .getByRole("button", {
              name: `Khu ${p.labels[item.category]}`,
              exact: true,
            })
            .click();
        }
        break;
      }
      for (let i = 0; i < p.targets.length; i++)
        for (let n = 0; n < p.targets[i]; n++)
          await page
            .getByRole("button", {
              name: `Thêm vào ${p.labels[i]}`,
              exact: true,
            })
            .click();
      break;
    case "fraction":
      await page
        .getByRole("button", {
          name: `Chia ${p.denominator} phần bằng nhau`,
          exact: true,
        })
        .click();
      for (let i = 0; i < p.numerator; i++)
        await page
          .getByRole("button", { name: `Phần bánh ${i + 1}`, exact: true })
          .click();
      break;
    case "mission":
      for (const r of p.rounds) {
        await page
          .locator(".ex-options>button")
          .getByText(String(calculate(r.a, r.op, r.b)), { exact: true })
          .click();
        await page
          .getByRole("button", { name: "Qua chặng", exact: true })
          .click();
      }
      break;
  }
}
for (const definition of definitions)
  test(`play ${definition.number}: ${definition.type} through its actual UI`, async ({
    page,
  }) => {
    test.setTimeout(45000);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const route = `practice/${definition.type}/1`;
    await page.goto(`/#${route}`);
    await expect(page.locator(".expanded-board")).toBeVisible();
    const q = generateQuestion(
      definition.type,
      1,
      hashText(`${route}-0`),
      `${route}-0-0`,
    );
    await solve(page, q);
    await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
    await expect(page.locator(".feedback.success")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Tiếp tục", exact: true }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
test("world map, resume, effort stars, daily tasks, notebook and collection", async ({
  page,
}) => {
  await page.goto("/#worlds");
  await expect(page.locator(".world-card")).toHaveCount(8);
  await page.locator(".world-card").first().click();
  await expect(page.locator(".world-lesson-card")).toHaveCount(10);
  await page.locator(".world-lesson-card").first().click();
  await expect(page.locator(".expanded-board")).toBeVisible();
  for (let i = 0; i < 5; i++) {
    await page.getByRole("button", { name: "Gợi ý", exact: true }).click();
    await page.getByRole("button", { name: "Gợi ý", exact: true }).click();
    await page.getByRole("button", { name: "Gợi ý", exact: true }).click();
    await page
      .getByRole("button", { name: "Xem một cách làm mẫu", exact: true })
      .click();
    await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
    await expect(page.locator(".feedback.success")).toBeVisible();
    if (i === 0) {
      await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
      await page.reload();
      await expect(page.locator(".world-player-top")).toContainText("2/5");
    } else
      await page
        .getByRole("button", {
          name: i === 4 ? "Hoàn thành" : "Tiếp tục",
          exact: true,
        })
        .click();
  }
  await expect(
    page.getByRole("heading", { name: "Bé đã khám phá thêm rồi!" }),
  ).toBeVisible();
  const stored = await page.evaluate(
    (k) => JSON.parse(localStorage.getItem(k)!),
    LEARNING_KEY,
  );
  expect(stored.stars["W1-L01"]).toBe(3);
  await page.goto("/#notebook");
  await expect(page.locator(".notebook-grid article").first()).toBeVisible();
  await page.goto("/#collection");
  await expect(
    page.locator(".character-collection article.unlocked"),
  ).toHaveCount(2);
  await page.goto("/#daily");
  await expect(page.locator(".world-player-top")).toContainText("1/3");
});
for (const width of [360, 768, 1440])
  test(`new worlds and every engine fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "worlds",
      "world/W1",
      "collection",
      "notebook",
      ...[
        "tap_counting",
        "block_addition",
        "number_bonds",
        "number_train",
        "tangram",
        "shortest_path",
        "equal_sharing_division",
        "fraction_partition",
        "rocket_launch_math",
      ].map((t) => `practice/${t}/3`),
    ]) {
      await page.goto(`/#${route}`);
      await expect(page.locator("main").last()).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
    }
  });

test("advanced geometry rotation, multiple answers, machine subtraction and elapsed time are playable", async ({
  page,
}) => {
  test.setTimeout(45000);
  for (const [type, level] of [
    ["tangram", 3],
    ["fraction_composition", 5],
    ["multi_condition_logic", 5],
    ["number_machine", 4],
    ["tell_time_advanced", 5],
  ] as const) {
    const route = `practice/${type}/${level}`;
    await page.goto("/#" + route);
    await expect(page.locator(".expanded-board")).toBeVisible();
    const q = generateQuestion(
      type,
      level,
      hashText(`${route}-0`),
      `${route}-0-0`,
    );
    if (
      type === "number_machine" &&
      q.payload.kind === "choice" &&
      q.payload.rule.kind === "arithmetic"
    )
      expect(q.payload.rule.op).toBe("-");
    if (
      type === "tell_time_advanced" &&
      q.payload.kind === "choice" &&
      q.payload.rule.kind === "clock"
    )
      expect(q.payload.rule.elapsed).toBeDefined();
    await solve(page, q);
    await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
    await expect(page.locator(".feedback.success")).toBeVisible();
  }
});
