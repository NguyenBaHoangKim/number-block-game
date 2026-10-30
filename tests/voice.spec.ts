import { exerciseVoicePrompts } from "../src/data/expansion/voicePrompts";
import { expect, test } from "@playwright/test";
import { existsSync, statSync, readFileSync, readdirSync } from "node:fs";
import {
  lessons,
  voiceCopy,
  spokenNumbers,
  appConfig,
  numberCharacters,
  narrationConfig,
} from "../src/data/mockData";
const manifest = JSON.parse(
  readFileSync("src/data/narrationManifest.json", "utf8"),
) as Record<string, { src: string; durationMs: number }>;
const clips: Record<string, { src: string; durationMs: number }> = manifest;
async function installTracking(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    const Original = window.Audio;
    const audios: HTMLAudioElement[] = [];
    Object.assign(window, { voiceAudios: audios });
    Object.defineProperty(window, "Audio", {
      configurable: true,
      value: function (src?: string) {
        const a = new Original(src);
        audios.push(a);
        return a;
      },
    });
  });
}
const voiceStatus = async (page: import("@playwright/test").Page) =>
  page.evaluate(async () => {
    const source = "/src/services/narrationService.ts";
    const service = await import(source);
    return service.getNarrationSnapshot() as {
      enabled: boolean;
      speaking: boolean;
      blocked: boolean;
      text: string;
    };
  });
test("every spoken lesson line, transition and count has a real bundled clip", () => {
  const texts: string[] = [
    ...Object.entries(voiceCopy)
      .filter(([key]) => key !== "quizHelp")
      .map(([, text]) => text),
    ...Object.values(exerciseVoicePrompts),
    ...spokenNumbers,
  ];
  for (const l of lessons)
    for (const step of l.steps) {
      if (step.type !== "quiz" && step.activity !== "meet")
        texts.push(step.instruction);
      texts.push(step.hint);
      if (step.introduction)
        texts.push(
          step.introduction.opening,
          step.introduction.closing,
          ...step.introduction.cues.map((c) => c.greeting),
        );
      if (step.question)
        texts.push(step.question.prompt, step.question.explanation);
    }
  for (const text of texts) {
    const clip = clips[text.replace(/\s+/g, " ").trim()];
    expect(clip, text).toBeDefined();
    expect(clip.durationMs).toBeGreaterThan(100);
    const file = `public${clip.src}`;
    expect(existsSync(file), file).toBeTruthy();
    expect(statSync(file).size).toBeGreaterThan(1000);
  }
});
test("new friends greet and their transition sentence actually plays an MP3", async ({
  page,
}) => {
  await installTracking(page);
  await page.clock.install();
  await page.goto("/#play/lesson-2");
  await page.getByRole("button", { name: "Gọi Lá và Đào ra chơi!" }).click();
  const intro = lessons[1].steps[0].introduction!;
  await expect
    .poll(async () => (await voiceStatus(page)).text)
    .toBe(intro.cues[0].greeting);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const audios = Reflect.get(window, "voiceAudios") as HTMLAudioElement[];
        return audios.some(
          (a) => !a.paused && a.currentTime > 0 && a.readyState >= 2,
        );
      }),
    )
    .toBe(true);
  for (let i = 0; i < intro.cues.length; i++) {
    await page.clock.runFor(
      Math.max(
        intro.cueDurationMs,
        clips[intro.cues[i].greeting].durationMs +
          narrationConfig.greetingPauseMs,
      ) + 20,
    );
    if (i + 1 < intro.cues.length)
      await expect(page.locator(".meet-dialogue")).toHaveText(
        intro.cues[i + 1].greeting,
      );
  }
  await expect(page.locator(".meet-dialogue")).toHaveText(intro.closing);
  await expect
    .poll(async () => (await voiceStatus(page)).text)
    .toBe(intro.closing);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const audios = Reflect.get(window, "voiceAudios") as HTMLAudioElement[];
        const last = audios.at(-1);
        return Boolean(
          last && !last.paused && last.currentTime > 0 && last.duration > 0,
        );
      }),
    )
    .toBe(true);
  const lastURL = await page.evaluate(
    () =>
      (Reflect.get(window, "voiceAudios") as HTMLAudioElement[]).at(-1)!.src,
  );
  expect(lastURL).toContain(clips[intro.closing].src);
  await page.getByRole("button", { name: "Nghe lại hướng dẫn" }).click();
  await expect
    .poll(async () => (await voiceStatus(page)).text)
    .toBe(intro.closing);
});
test("counting says one two three once, queues rapid taps and respects reset", async ({
  page,
}) => {
  await installTracking(page);
  await page.goto("/#play/lesson-3");
  const blocks = page.locator(".count-block");
  await blocks.nth(0).click();
  await expect.poll(async () => (await voiceStatus(page)).text).toBe("một");
  await expect
    .poll(() =>
      page.evaluate(() => {
        const last = (
          Reflect.get(window, "voiceAudios") as HTMLAudioElement[]
        ).at(-1);
        return Boolean(last && !last.paused && last.currentTime > 0);
      }),
    )
    .toBe(true);
  const before = await page.evaluate(
    () => (Reflect.get(window, "voiceAudios") as HTMLAudioElement[]).length,
  );
  await blocks.nth(0).click();
  expect(
    await page.evaluate(
      () => (Reflect.get(window, "voiceAudios") as HTMLAudioElement[]).length,
    ),
  ).toBe(before);
  await blocks.nth(1).click();
  await blocks.nth(2).click();
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const last = (
            Reflect.get(window, "voiceAudios") as HTMLAudioElement[]
          ).at(-1);
          return last?.src ?? "";
        }),
      { timeout: 7000 },
    )
    .toContain(clips["ba"].src);
  await page.getByRole("button", { name: "Đếm lại", exact: true }).click();
  await blocks.nth(0).click();
  await expect.poll(async () => (await voiceStatus(page)).text).toBe("một");
});
test("main speaker toggles music effects and narration together and saves them", async ({
  page,
}) => {
  await installTracking(page);
  await page.goto("/#play/lesson-7");
  await page.getByRole("button", { name: "Tắt tất cả âm thanh" }).click();
  const stored = () =>
    page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)!),
      appConfig.storageKey,
    );
  await expect.poll(async () => (await stored()).settings.voice).toBe(false);
  let p = await stored();
  expect(p.settings.music).toBe(false);
  expect(p.settings.effects).toBe(false);
  expect((await voiceStatus(page)).enabled).toBe(false);
  const audioStatus = () =>
    page.evaluate(async () => {
      const source = "/src/services/audioService.ts";
      return (await import(source)).getAudioStatus() as {
        music: boolean;
        effects: boolean;
        playing: boolean;
      };
    });
  expect((await audioStatus()).playing).toBe(false);
  expect(
    await page.evaluate(() =>
      (Reflect.get(window, "voiceAudios") as HTMLAudioElement[]).every(
        (a) => a.paused,
      ),
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Bật tất cả âm thanh" }).click();
  await expect.poll(async () => (await stored()).settings.music).toBe(true);
  p = await stored();
  expect(p.settings.effects).toBe(true);
  expect(p.settings.voice).toBe(true);
  await expect.poll(async () => (await audioStatus()).playing).toBe(true);
  expect((await voiceStatus(page)).enabled).toBe(true);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Tắt tất cả âm thanh" }),
  ).toBeVisible();
});
test("character questions offer character names and quantity questions offer quantities", async ({
  page,
}) => {
  for (const l of lessons)
    for (const step of l.steps) {
      const q = step.question;
      if (!q) continue;
      if (q.prompt.startsWith("Nhân vật nào")) {
        expect(
          q.options.every((o) => numberCharacters.some((c) => c.name === o)),
        ).toBe(true);
        expect(q.answer).toBe("Đào");
      }
      if (
        q.prompt.includes("bao nhiêu khối?") ||
        q.prompt.includes("mấy khối?")
      )
        expect(typeof q.answer).toBe("number");
    }
  await page.addInitScript(
    (k) =>
      localStorage.setItem(
        k,
        JSON.stringify({
          settings: { voice: false, effects: false, music: false, volume: 0.4 },
        }),
      ),
    appConfig.storageKey,
  );
  await page.clock.install();
  await page.goto("/#play/lesson-2");
  await page.getByRole("button", { name: "Gọi Lá và Đào ra chơi!" }).click();
  await page.clock.runFor(4800);
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  for (const b of await page.locator(".count-block:not(:disabled)").all())
    await b.click();
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  await expect(page.locator(".quiz-option > span")).toHaveText([
    "Mây",
    "Lá",
    "Đào",
  ]);
  await page.getByRole("button", { name: "Đào", exact: true }).click();
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await expect(page.locator(".feedback.success")).toBeVisible();
});
test("background audio option persists and controls hidden-tab playback", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Mở cài đặt âm thanh" }).click();
  await page.getByRole("checkbox", { name: "Nhạc nền", exact: true }).check();
  const background = page.getByRole("checkbox", {
    name: "Tiếp tục phát khi chuyển tab",
    exact: true,
  });
  await expect(background).not.toBeChecked();
  await page.getByRole("button", { name: "Đóng cài đặt" }).click();
  const visibility = (hidden: boolean) =>
    page.evaluate((h) => {
      Object.defineProperty(document, "hidden", {
        configurable: true,
        get: () => h,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    }, hidden);
  const playing = () =>
    page.evaluate(async () => {
      const path = "/src/services/audioService.ts";
      return (await import(path)).getAudioStatus().playing as boolean;
    });
  await visibility(true);
  await expect.poll(playing).toBe(false);
  await visibility(false);
  await expect.poll(playing).toBe(true);
  await page.getByRole("button", { name: "Mở cài đặt âm thanh" }).click();
  await background.check();
  await page.getByRole("button", { name: "Đóng cài đặt" }).click();
  await visibility(true);
  await expect.poll(playing).toBe(true);
  await page.waitForTimeout(400);
  expect(await playing()).toBe(true);
  await visibility(false);
  await page.reload();
  await page.getByRole("button", { name: "Mở cài đặt âm thanh" }).click();
  await expect(background).toBeChecked();
});
test("canonical question answers agree with the visual mathematics", () => {
  for (const lesson of lessons)
    for (const step of lesson.steps) {
      if (!step.question) continue;
      const [a, b] = step.values;
      let expected: string | number | undefined;
      switch (step.activity) {
        case "merge":
        case "numberline":
          expected = a + b;
          break;
        case "split":
          expected = a - b;
          break;
        case "compare":
          expected = a === b ? "=" : a > b ? ">" : "<";
          break;
        case "pattern":
          expected = step.values.at(-1)! + (step.config?.patternIncrement ?? 1);
          break;
        case "missing":
          expected = b - a;
          break;
        case "grouping":
          expected = a * b;
          break;
        case "sharing":
          expected = a / b;
          break;
        case "parity":
          expected = a % 2 ? "Lẻ" : "Chẵn";
          break;
        case "bridge":
          expected = b;
          break;
        case "clock":
          expected = `${a} giờ`;
          break;
        case "memory":
          expected = a;
          break;
        case "count":
          expected =
            typeof step.question.answer === "number"
              ? (numberCharacters.find((c) =>
                  step.question!.prompt.includes(c.name),
                )?.value ?? a)
              : numberCharacters.find((c) => c.value === 5)?.name;
          break;
        case "shapes":
          expected = 3;
      }
      if (expected !== undefined)
        expect(
          step.question.answer,
          `${lesson.title}: ${step.question.prompt}`,
        ).toBe(expected);
    }
});

test("audio budget is reduced without orphan files or faster playback", () => {
  const files = readdirSync("public/audio/narration").filter((f) =>
    f.endsWith(".mp3"),
  );
  const referenced = new Set(
    Object.values(clips).map((c) => c.src.split("/").at(-1)),
  );
  expect(files.length).toBeLessThanOrEqual(
    Math.ceil(221 * 0.8) + Object.keys(exerciseVoicePrompts).length,
  );
  expect(files.length).toBe(referenced.size);
  expect(files.every((f) => referenced.has(f))).toBe(true);
  expect(
    Object.values(clips).reduce((sum, c) => sum + c.durationMs, 0),
  ).toBeLessThan(757470 * 0.8);
});
