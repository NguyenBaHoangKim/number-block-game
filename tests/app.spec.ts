import { expect, test, type Page } from "@playwright/test";
import {
  lessons,
  learningStages,
  numberCharacters,
  appConfig,
} from "../src/data/mockData";
import type { LessonStep } from "../src/types/lesson";
test.beforeEach(async ({ page }) => {
  await page.addInitScript((key) => {
    let p;
    try {
      p = JSON.parse(localStorage.getItem(key) ?? "{}");
    } catch {
      p = {};
    }
    p ??= {};
    p.settings = { ...p.settings, voice: false };
    localStorage.setItem(key, JSON.stringify(p));
  }, appConfig.storageKey);
});
async function openLesson(page: Page, id: string) {
  await page.goto(`/#play/${id}`);
  await expect(page.locator(".lesson-board")).toBeVisible();
}
async function playActivity(page: Page, activity: string, step?: LessonStep) {
  if (activity === "meet") {
    await page.locator(".meet-controls .button").click();
    await expect(
      page.getByRole("button", { name: "Tiếp tục", exact: true }),
    ).toBeEnabled({ timeout: 15000 });
    return;
  }
  if (activity === "memory") {
    await page.getByRole("button", { name: "Mở hộp bí mật" }).click();
    await expect(page.locator(".memory-box")).toHaveClass(/hidden/, {
      timeout: 4000,
    });
    return;
  }
  if (activity === "grouping") {
    const button = page.getByRole("button", { name: "Trồng thêm một luống" });
    while ((await button.count()) && (await button.isEnabled()))
      await button.click();
    return;
  }
  if (activity === "sharing") {
    for (let round = 0; round < 2; round++)
      for (const button of await page.locator(".share-friend").all())
        await button.click();
    return;
  }
  if (activity === "parity") {
    const button = page.getByRole("button", { name: "Ghép một cặp" });
    while (await button.isEnabled()) await button.click();
    return;
  }
  if (activity === "shapes") {
    await page.locator(".shape-choice").filter({ hasText: "Tam giác" }).click();
    return;
  }
  if (activity === "bridge") {
    const button = page.getByRole("button", { name: "Đặt một khối vào cầu" });
    while ((await button.count()) && (await button.isEnabled()))
      await button.click();
    return;
  }
  if (activity === "clock") {
    await page.getByRole("button", { name: "3 giờ", exact: true }).click();
    return;
  }
  if (activity === "match")
    await page.getByRole("button", { name: "Chọn nhóm 5 khối" }).click();
  else if (activity === "count") {
    for (const b of await page.locator(".count-block").all()) await b.click();
  } else if (activity === "compare")
    await page.getByRole("button", { name: "Thử 2 và 2" }).click();
  else if (activity === "numberline")
    await page.getByRole("button", { name: "Tiến 1 bước" }).click();
  else if (activity === "pattern")
    await page
      .locator(".number-option")
      .filter({
        hasText: String(
          step
            ? step.values[step.values.length - 1] +
                (step.config?.patternIncrement ?? 1)
            : 4,
        ),
      })
      .click();
  else if (activity === "missing")
    await page.locator(".number-option").filter({ hasText: "4" }).click();
  else
    await page
      .getByRole("button", {
        name: activity === "split" ? "Tách khối" : "Ghép khối",
        exact: true,
      })
      .click();
}
test("mock curriculum is complete, unique and consistent", () => {
  expect(learningStages).toHaveLength(5);
  expect(lessons).toHaveLength(24);
  expect(numberCharacters.map((n) => n.value)).toEqual([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  const ids = lessons.flatMap((l) => [l.id, ...l.steps.map((s) => s.id)]);
  expect(new Set(ids).size).toBe(ids.length);
  for (const l of lessons) {
    expect(l.steps.some((s) => s.type === "interact")).toBeTruthy();
    expect(learningStages.some((s) => s.id === l.stageId)).toBeTruthy();
    for (const s of l.steps) {
      if (s.question) expect(s.question.options).toContain(s.question.answer);
    }
  }
});
test("home, map, every lesson, completion and persistent best stars", async ({
  page,
}) => {
  test.setTimeout(150000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Chơi cùng khối số/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Bắt đầu học" }).click();
  await expect(page.locator(".lesson-card")).toHaveCount(24);
  for (const lesson of lessons) {
    await openLesson(page, lesson.id);
    for (let i = 0; i < lesson.steps.length; i++) {
      const step = lesson.steps[i];
      await expect(
        page.getByRole("heading", { name: step.title, exact: true }),
      ).toBeVisible();
      if (step.activity === "meet") await playActivity(page, "meet");
      if (step.type === "interact") {
        await expect(
          page.getByRole("button", { name: "Tiếp tục", exact: true }),
        ).toBeDisabled();
        await playActivity(page, step.activity, step);
      }
      if (step.question) {
        await page
          .getByRole("button", {
            name: String(step.question.answer),
            exact: true,
          })
          .last()
          .click();
        await page
          .getByRole("button", { name: "Kiểm tra", exact: true })
          .click();
        await expect(page.locator(".feedback.success")).toBeVisible();
      }
      await page
        .getByRole("button", {
          name: i === lesson.steps.length - 1 ? "Hoàn thành" : "Tiếp tục",
          exact: true,
        })
        .click();
    }
    await expect(
      page.getByRole("heading", { name: "Bé làm được rồi!" }),
    ).toBeVisible();
  }
  await page.reload();
  await page.getByRole("button", { name: "Thành tích", exact: true }).click();
  await expect(page.locator(".stats-grid").first()).toContainText("72");
  await expect(page.locator(".badge-card.unlocked")).toHaveCount(3);
  await openLesson(page, "lesson-7");
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  await playActivity(page, "merge");
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  await page.getByRole("button", { name: "4", exact: true }).click();
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await expect(page.locator(".feedback.wrong")).toBeVisible();
  await page.getByRole("button", { name: "5", exact: true }).click();
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await page.getByRole("button", { name: "Hoàn thành", exact: true }).click();
  const stored = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    appConfig.storageKey,
  );
  expect(stored.stars["lesson-7"]).toBe(3);
  expect(
    Object.values(stored.stars).reduce((a: number, b) => a + Number(b), 0),
  ).toBe(72);
  expect(errors).toEqual([]);
});
test("drag merge moves the same five blocks; split preserves each block", async ({
  page,
}) => {
  await openLesson(page, "lesson-7");
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  const blocks = page.locator(".moving-block");
  await expect(blocks).toHaveCount(5);
  const before = await blocks.first().getAttribute("style");
  const rightBefore = await blocks.last().getAttribute("style");
  const box = await blocks.last().boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + 20, box!.y + 20);
  await page.mouse.down();
  await page.mouse.move(box!.x + 170, box!.y + 20, { steps: 12 });
  await expect(blocks.last()).not.toHaveAttribute("style", rightBefore!);
  await expect(blocks.first()).toHaveAttribute("style", before!);
  await page.mouse.up();
  await expect(page.locator(".transform-workspace")).toHaveClass(/transformed/);
  await expect(blocks).toHaveCount(5);
  expect(await blocks.first().getAttribute("style")).not.toBe(before);
  await openLesson(page, "lesson-8");
  await expect(page.locator(".moving-block")).toHaveCount(5);
  await page.getByRole("button", { name: "Tách khối", exact: true }).click();
  await expect(page.locator(".transform-workspace")).toHaveClass(/transformed/);
  await expect(page.locator(".moving-block")).toHaveCount(5);
});
test("drag a missing number into the target; friendly wrong and correct feedback", async ({
  page,
}) => {
  await openLesson(page, "lesson-14");
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  const dt = await page.evaluateHandle(() => new DataTransfer());
  await dt.evaluate((d) => d.setData("text/plain", "4"));
  await page.locator(".drop-zone").dispatchEvent("drop", { dataTransfer: dt });
  await expect(page.locator(".drop-zone")).toHaveClass(/filled/);
  await expect(
    page.getByRole("button", { name: "Tiếp tục", exact: true }),
  ).toBeEnabled();
});
test("counting does not double count, back navigation, invalid route and damaged storage", async ({
  page,
}) => {
  await openLesson(page, "lesson-1");
  await playActivity(page, "meet");
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  await page.locator(".count-block").first().click();
  await page.locator(".count-block").first().click();
  await expect(page.locator(".workspace-caption")).toContainText("1 / 3");
  await page.getByRole("button", { name: "Quay lại", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Xin chào các khối số", exact: true }),
  ).toBeVisible();
  await page.evaluate(
    (key) => localStorage.setItem(key, "{broken"),
    appConfig.storageKey,
  );
  await page.reload();
  await expect(page.locator(".star-counter")).toContainText("0");
  await page.goto("/#play/unknown");
  await expect(page.getByRole("heading", { name: /đi lạc/ })).toBeVisible();
  await page.getByRole("button", { name: "Về bản đồ", exact: true }).click();
  await expect(page.locator(".lesson-card")).toHaveCount(24);
});
test("audio actually starts and stops, settings persist, confirmed reset", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const Original = window.AudioContext;
    const metrics = { created: 0, started: 0, stopped: 0 };
    Object.assign(window, { audioMetrics: metrics });
    window.AudioContext = class extends Original {
      constructor() {
        super();
        metrics.created++;
      }
      override createOscillator() {
        const node = super.createOscillator();
        const start = node.start.bind(node),
          stop = node.stop.bind(node);
        node.start = (...args: Parameters<typeof start>) => {
          metrics.started++;
          start(...args);
        };
        node.stop = (...args: Parameters<typeof stop>) => {
          metrics.stopped++;
          stop(...args);
        };
        return node;
      }
    };
  });
  const metrics = () =>
    page.evaluate(
      () =>
        Reflect.get(window, "audioMetrics") as {
          created: number;
          started: number;
          stopped: number;
        },
    );
  await page.goto("/");
  expect((await metrics()).created).toBe(0);
  await page.getByRole("button", { name: "Mở cài đặt âm thanh" }).click();
  await page.getByRole("checkbox", { name: "Nhạc nền", exact: true }).check();
  await expect.poll(async () => (await metrics()).started).toBeGreaterThan(0);
  await page.getByRole("checkbox", { name: "Nhạc nền", exact: true }).uncheck();
  const afterStop = (await metrics()).started;
  await page.waitForTimeout(850);
  expect((await metrics()).started).toBe(afterStop);
  await page
    .getByRole("checkbox", { name: "Hiệu ứng âm thanh", exact: true })
    .uncheck();
  await page.getByRole("button", { name: "Đóng cài đặt" }).click();
  await openLesson(page, "lesson-7");
  await page.getByRole("button", { name: "Ghép khối", exact: true }).click();
  expect((await metrics()).started).toBe(afterStop);
  await page.getByRole("button", { name: "Mở cài đặt âm thanh" }).click();
  await page
    .getByRole("checkbox", { name: "Hiệu ứng âm thanh", exact: true })
    .check();
  await page.getByRole("button", { name: "Đóng cài đặt" }).click();
  await page.getByRole("button", { name: "Làm lại", exact: true }).click();
  await page.getByRole("button", { name: "Ghép khối", exact: true }).click();
  expect((await metrics()).started).toBeGreaterThan(afterStop);
  await page.evaluate((key) => {
    const p = JSON.parse(localStorage.getItem(key)!);
    p.stars = { "lesson-1": 3 };
    p.lastLesson = "lesson-1";
    localStorage.setItem(key, JSON.stringify(p));
  }, appConfig.storageKey);
  await page.reload();
  await expect(page.locator(".star-counter")).toContainText("3");
  await page.getByRole("button", { name: "Mở cài đặt âm thanh" }).click();
  await expect(
    page.getByRole("checkbox", { name: "Hiệu ứng âm thanh", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Nhạc nền", exact: true }),
  ).not.toBeChecked();
  await page
    .getByRole("button", { name: "Đặt lại tiến độ", exact: true })
    .click();
  await expect(
    page.getByText("Xóa toàn bộ sao và bài đã học trên thiết bị này?"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Xóa tiến độ", exact: true }).click();
  const stored = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    appConfig.storageKey,
  );
  expect(stored.stars).toEqual({});
  expect(stored.lastLesson).toBe(null);
});
for (const width of [1440, 1024, 768, 430, 390, 360])
  test(`responsive ${width}px without horizontal overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "home",
      "map",
      "progress",
      ...lessons.map((l) => `play/${l.id}`),
    ]) {
      await page.goto(`/#${route}`);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBeTruthy();
      if (route === "home")
        await page.screenshot({
          path: `test-results/home-${width}.png`,
          fullPage: true,
        });
    }
  });
test("reduced motion and keyboard settings dialog", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const duration = await page
    .locator(".scene-two")
    .evaluate((el) => getComputedStyle(el).animationDuration);
  expect(duration).toBe("1e-05s");
  await page.getByRole("button", { name: "Mở cài đặt âm thanh" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("quiz pictures preserve question quantities", async ({ page }) => {
  await openLesson(page, "lesson-5");
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  await playActivity(page, "compare");
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  await playActivity(page, "match");
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  await expect(page.locator(".balance-numbers")).toHaveText("3<5");
  await expect(page.getByRole("button", { name: "Thử 2 và 2" })).toHaveCount(0);
  await openLesson(page, "lesson-8");
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  await page.getByRole("slider", { name: "Số khối tách ra" }).fill("3");
  await playActivity(page, "split");
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  await expect(
    page.getByRole("slider", { name: "Số khối tách ra" }),
  ).toHaveCount(0);
  await expect(page.locator(".transform-canvas")).toHaveAttribute(
    "aria-label",
    "Tách 5 thành 3 và 2",
  );
});
