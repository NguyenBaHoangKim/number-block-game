import { expect, test } from "@playwright/test";
import {
  lessons,
  appConfig,
  audioProfiles,
  audioEffects,
  challengeConfig,
} from "../src/data/mockData";
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
test("greeting happens before counting and the question", async ({ page }) => {
  await page.clock.install();
  await page.goto("/#play/lesson-1");
  const next = page.getByRole("button", { name: "Tiếp tục", exact: true });
  await expect(next).toBeDisabled();
  await expect(page.locator(".count-block")).toHaveCount(0);
  await expect(page.locator(".quiz")).toHaveCount(0);
  await page.getByRole("button", { name: "Gọi các bạn ra chơi!" }).click();
  await expect(
    page.getByRole("button", { name: "Chào Mầm", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Chào Mây", exact: true }),
  ).toHaveCount(0);
  await page.clock.runFor(2200);
  await expect(
    page.getByRole("button", { name: "Chào Mây", exact: true }),
  ).toBeVisible();
  await expect(next).toBeDisabled();
  await page.clock.runFor(2200);
  await expect(
    page.getByRole("button", { name: "Chào Nắng", exact: true }),
  ).toBeVisible();
  await expect(next).toBeDisabled();
  await page.clock.runFor(2200);
  await expect(next).toBeEnabled();
  await expect(page.locator(".meet-dialogue")).toContainText(
    "Cả ba bạn đã đến rồi",
  );
  await page.getByRole("button", { name: "Chào lại các bạn" }).click();
  await expect(
    page.getByRole("button", { name: "Gọi các bạn ra chơi!" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Gọi các bạn ra chơi!" }).click();
  await page.clock.runFor(6600);
  await next.click();
  await expect(page.locator(".count-block")).toHaveCount(3);
  await expect(page.locator(".number-label")).toHaveText("Nắng");
  await expect(page.locator(".quiz")).toHaveCount(0);
  for (const block of await page.locator(".count-block").all())
    await block.click();
  await next.click();
  await expect(page.locator(".quiz h2")).toHaveText(
    "Bạn Nắng có bao nhiêu khối?",
  );
});
test("free playground merges twenty actual blocks, builds, moves and clears", async ({
  page,
}) => {
  await page.goto("/#playground");
  await page.getByRole("slider", { name: "Số khối nhóm đầu" }).fill("10");
  await page.getByRole("slider", { name: "Số khối nhóm thứ hai" }).fill("10");
  await expect(page.locator(".moving-block")).toHaveCount(20);
  await page.getByRole("button", { name: "Ghép khối", exact: true }).click();
  await expect(page.locator(".result-number")).toHaveText("20");
  // Every transformed unit stays inside the SVG coordinate space.
  const inside = await page.locator(".moving-block").evaluateAll((elements) =>
    elements.every((el) => {
      const match = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(
        el.getAttribute("style")!,
      );
      return (
        match &&
        Number(match[1]) >= 0 &&
        Number(match[1]) + 60 <= 600 &&
        Number(match[2]) >= 0 &&
        Number(match[2]) + 64 <= 360
      );
    }),
  );
  expect(inside).toBeTruthy();
  await page
    .getByRole("button", { name: "Xưởng xây dựng", exact: true })
    .click();
  await page.getByRole("button", { name: "Xếp nhà", exact: true }).click();
  await expect(page.locator(".construction-cell.occupied")).toHaveCount(20);
  const dt = await page.evaluateHandle(() => new DataTransfer());
  await dt.evaluate((d) => d.setData("text/plain", "cell:11"));
  await page
    .locator(".construction-cell")
    .nth(0)
    .dispatchEvent("drop", { dataTransfer: dt });
  await expect(page.locator(".construction-cell").nth(0)).toHaveClass(
    /occupied/,
  );
  await expect(page.locator(".construction-cell").nth(11)).not.toHaveClass(
    /occupied/,
  );
  await expect(page.locator(".construction-cell.occupied")).toHaveCount(20);
  await page.getByRole("button", { name: "Dọn sân", exact: true }).click();
  await expect(page.locator(".construction-cell.occupied")).toHaveCount(0);
  await page.getByRole("button", { name: "Ô xây dựng 1", exact: true }).click();
  await expect(page.locator(".construction-cell.occupied")).toHaveCount(1);
});
test("quick challenge checks answers, saves a separate best, supports replay and timer", async ({
  page,
}) => {
  await page.goto("/#challenge");
  await page
    .getByRole("combobox", { name: "Nội dung thử thách" })
    .selectOption("1");
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await page
    .getByRole("button", { name: "Bắt đầu thử thách", exact: true })
    .click();
  const questions = lessons.flatMap((l) =>
    l.steps.flatMap((s) => (s.question ? [s.question] : [])),
  );
  for (let i = 0; i < 5; i++) {
    const prompt = await page.locator(".lesson-heading h1").textContent();
    const question = questions.find((q) => q.prompt === prompt)!;
    expect(question).toBeDefined();
    if (i === 0) {
      const wrong = question.options.find((o) => o !== question.answer)!;
      await page
        .locator(".quiz-option")
        .getByText(String(wrong), { exact: true })
        .click();
      await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
      await expect(page.locator(".feedback.wrong")).toBeVisible();
    }
    await page
      .locator(".quiz-option")
      .getByText(String(question.answer), { exact: true })
      .click();
    await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
    await expect(page.locator(".feedback.success")).toBeVisible();
    await page
      .getByRole("button", {
        name: i === 4 ? "Xem kết quả" : "Câu tiếp theo",
        exact: true,
      })
      .click();
  }
  await expect(page.locator(".challenge-score")).toHaveText("5 / 5");
  const stored = await page.evaluate(
    (k) => JSON.parse(localStorage.getItem(k)!),
    appConfig.storageKey,
  );
  expect(stored.stars).toEqual({});
  expect(stored.practice).toEqual({ quickBest: 5, rounds: 1 });
  await page.reload();
  await expect(page.getByText("Kỷ lục của bé: 5 / 5 câu")).toBeVisible();
  await page.clock.install();
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Bắt đầu thử thách", exact: true })
    .click();
  await page.clock.runFor(61000);
  await expect(page.getByText("Hết giờ rồi.", { exact: false })).toBeVisible();
  const after = await page.evaluate(
    (k) => JSON.parse(localStorage.getItem(k)!),
    appConfig.storageKey,
  );
  expect(after.practice.quickBest).toBe(5);
  expect(after.practice.rounds).toBe(2);
});
test("music follows the route and preserves mute and volume", async ({
  page,
}) => {
  const status = () =>
    page.evaluate(async () => {
      const source = "/src/services/audioService.ts";
      const audio = await import(source);
      return audio.getAudioStatus() as {
        mood: string;
        playing: boolean;
        volume: number;
        activeNodes: number;
      };
    });
  await page.goto("/");
  await page.getByRole("button", { name: "Mở cài đặt âm thanh" }).click();
  await page.getByRole("checkbox", { name: "Nhạc nền", exact: true }).check();
  await expect.poll(async () => (await status()).mood).toBe("lobby");
  await expect.poll(async () => (await status()).playing).toBe(true);
  await page.getByRole("button", { name: "Đóng cài đặt" }).click();
  for (const [route, mood] of [
    ["play/lesson-7", "lesson"],
    ["playground", "playground"],
    ["challenge", "challenge"],
    ["home", "lobby"],
  ]) {
    await page.goto(`/#${route}`);
    await expect.poll(async () => (await status()).mood).toBe(mood);
    expect((await status()).playing).toBe(true);
  }
  expect(audioProfiles.lesson.level).toBeGreaterThan(audioProfiles.lobby.level);
  expect(audioProfiles.challenge.bpm).toBeGreaterThan(audioProfiles.lesson.bpm);
  expect(Object.keys(audioEffects).length).toBeGreaterThanOrEqual(18);
  await page.getByRole("button", { name: "Mở cài đặt âm thanh" }).click();
  await page
    .getByRole("slider", { name: "Âm lượng", exact: true })
    .fill("0.25");
  await page.getByRole("checkbox", { name: "Nhạc nền", exact: true }).uncheck();
  await page.getByRole("button", { name: "Đóng cài đặt" }).click();
  await page.goto("/#play/lesson-7");
  await expect.poll(async () => (await status()).playing).toBe(false);
  expect((await status()).volume).toBe(0.25);
});
test("sharing requires equal groups, parity reveals a leftover, bridge moves only after completion", async ({
  page,
}) => {
  await page.goto("/#play/lesson-20");
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  const next = page.getByRole("button", { name: "Tiếp tục", exact: true });
  for (let i = 0; i < 6; i++)
    await page.locator(".share-friend").first().click();
  await expect(next).toBeDisabled();
  await expect(page.locator(".activity-feedback")).toContainText("Chia lại");
  await page.getByRole("button", { name: "Chia lại", exact: true }).click();
  for (let round = 0; round < 2; round++)
    for (const b of await page.locator(".share-friend").all()) await b.click();
  await expect(next).toBeEnabled();
  await page.goto("/#play/lesson-17");
  await page.getByRole("button", { name: "Thử 9 khối", exact: true }).click();
  for (let i = 0; i < 4; i++)
    await page
      .getByRole("button", { name: "Ghép một cặp", exact: true })
      .click();
  await expect(page.locator(".activity-feedback")).toContainText("số lẻ");
  await page.goto("/#play/lesson-22");
  await expect(page.locator(".river-scene")).not.toHaveClass(/bridge-complete/);
  await page
    .getByRole("button", { name: "Đặt một khối vào cầu", exact: true })
    .click();
  await expect(page.locator(".river-scene")).not.toHaveClass(/bridge-complete/);
  await page
    .getByRole("button", { name: "Đặt một khối vào cầu", exact: true })
    .click();
  await expect(page.locator(".river-scene")).toHaveClass(/bridge-complete/);
});
for (const width of [360, 768, 1440])
  test(`new play screens fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "playground",
      "challenge",
      ...Array.from({ length: 10 }, (_, i) => `play/lesson-${15 + i}`),
    ]) {
      await page.goto(`/#${route}`);
      await expect(page.locator("main")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBeTruthy();
    }
    await page.goto("/#playground");
    await page
      .getByRole("button", { name: "Xưởng xây dựng", exact: true })
      .click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  });
test("difficulty pools have valid questions and progress migrates from the original version", async ({
  page,
}) => {
  for (const d of challengeConfig.difficultyLabels.filter((d) => d.value)) {
    expect(
      lessons
        .filter((l) => l.difficulty === d.value)
        .some((l) => l.steps.some((s) => s.question)),
    ).toBeTruthy();
  }
  await page.addInitScript(
    (k) =>
      localStorage.setItem(
        k,
        JSON.stringify({
          stars: { "lesson-1": 3 },
          lastLesson: "lesson-1",
          settings: { effects: false, music: false, volume: 0.3 },
        }),
      ),
    appConfig.storageKey,
  );
  await page.goto("/#progress");
  await expect(page.locator(".star-counter")).toContainText("3");
  await expect(page.locator(".practice-stats")).toContainText("0/5");
});
