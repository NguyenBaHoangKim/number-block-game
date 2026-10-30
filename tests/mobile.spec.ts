import { test, expect } from "@playwright/test";
import { appConfig } from "../src/data/mockData";
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
test("world map and all nine engines render without JS errors or horizontal page overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "worlds",
    "world/W1",
    "collection",
    "notebook",
    ...[
      "tap_counting",
      "number_machine",
      "number_bonds",
      "number_train",
      "tangram",
      "spatial_navigation",
      "equal_sharing_division",
      "fraction_partition",
      "rocket_launch_math",
    ].map((t) => `practice/${t}/3`),
  ]) {
    await page.goto("/#" + route);
    await expect(page.locator("main").last()).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});
test("touch counting ignores repeated taps and tap-to-place works on geometry", async ({
  page,
}) => {
  await page.goto("/#practice/tap_counting/3");
  const blocks = page.locator(".ex-tap-field>button");
  await expect(blocks.first()).toBeVisible();
  const count = await blocks.count();
  await blocks.first().tap();
  await blocks.first().tap();
  await expect(page.locator(".ex-tap-field>button.counted")).toHaveCount(1);
  for (let i = 1; i < count; i++) await blocks.nth(i).tap();
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).tap();
  await expect(page.locator(".feedback.success")).toBeVisible();
  await page.goto("/#practice/copy_structure/1");
  await page.getByRole("button", { name: "Chọn mảnh 1", exact: true }).tap();
  await page.getByRole("button", { name: "Vị trí ghép 1", exact: true }).tap();
  await expect(page.locator(".piece-slot.placed")).toHaveCount(1);
});
test("pause and resume preserve a child's activity on touch devices", async ({
  page,
}) => {
  await page.goto("/#practice/number_machine/3");
  await page.getByRole("button", { name: "Chạy máy", exact: true }).tap();
  await page
    .getByRole("button", { name: "Tạm dừng bài học", exact: true })
    .tap();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Tiếp tục chơi", exact: true }).tap();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".ex-number-machine.running")).toBeVisible();
});
