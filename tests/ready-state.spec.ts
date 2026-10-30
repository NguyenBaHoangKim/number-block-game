import { test, expect, type Page } from "@playwright/test";
import { appConfig } from "../src/data/mockData";
import type { LessonStep } from "../src/types/lesson";
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
async function mount(page: Page, step: Partial<LessonStep>) {
  await page.goto("/");
  await page.evaluate(
    async (data) => {
      const path = "/tests/fixtures/LegacyActivityHarness.tsx";
      (await import(path)).mountActivity(data);
    },
    {
      id: "ready-audit",
      type: "interact",
      title: "Kiểm tra trạng thái",
      instruction: "Thử rồi làm lại",
      hint: "",
      values: [2, 3],
      activity: "merge",
      ...step,
    },
  );
  await expect(page.locator("#audit-next")).toBeDisabled();
}
test("merge, bridge, grouping and equal sharing all revoke ready when restarted", async ({
  page,
}) => {
  for (const activity of ["merge", "bridge", "grouping", "sharing"] as const) {
    await mount(page, {
      activity,
      values:
        activity === "merge"
          ? [2, 3]
          : activity === "bridge"
            ? [6, 2]
            : activity === "grouping"
              ? [3, 2]
              : [6, 3],
    });
    const next = page.locator("#audit-next");
    if (activity === "merge")
      await page
        .getByRole("button", { name: "Ghép khối", exact: true })
        .click();
    else if (activity === "bridge")
      for (let i = 0; i < 2; i++)
        await page
          .getByRole("button", { name: "Đặt một khối vào cầu", exact: true })
          .click();
    else if (activity === "grouping")
      for (let i = 0; i < 3; i++)
        await page
          .getByRole("button", { name: "Trồng thêm một luống", exact: true })
          .click();
    else
      for (let round = 0; round < 2; round++)
        for (const friend of await page.locator(".share-friend").all())
          await friend.click();
    await expect(next, activity).toBeEnabled();
    await page
      .getByRole("button", {
        name:
          activity === "merge"
            ? "Làm lại"
            : activity === "bridge"
              ? "Xây lại"
              : activity === "grouping"
                ? "Trồng lại"
                : "Chia lại",
        exact: true,
      })
      .click();
    await expect(next, activity).toBeDisabled();
  }
});
test("match, pattern, clock and shape tasks revoke ready after changing a correct answer to a wrong one", async ({
  page,
}) => {
  for (const activity of ["match", "pattern", "clock", "shapes"] as const) {
    await mount(page, {
      activity,
      values:
        activity === "match"
          ? [3, 4, 5]
          : activity === "pattern"
            ? [1, 2, 3]
            : [3],
    });
    const next = page.locator("#audit-next");
    if (activity === "match")
      await page
        .getByRole("button", { name: "Chọn nhóm 5 khối", exact: true })
        .click();
    else if (activity === "pattern")
      await page
        .locator(".number-option")
        .getByText("4", { exact: true })
        .click();
    else if (activity === "shapes")
      await page
        .locator(".shape-choice")
        .filter({ hasText: "Tam giác" })
        .click();
    else await page.getByRole("button", { name: "3 giờ", exact: true }).click();
    await expect(next, activity).toBeEnabled();
    if (activity === "match")
      await page
        .getByRole("button", { name: "Chọn nhóm 3 khối", exact: true })
        .click();
    else if (activity === "pattern")
      await page
        .locator(".number-option")
        .getByText("5", { exact: true })
        .click();
    else if (activity === "shapes")
      await page
        .locator(".shape-choice")
        .filter({ hasText: "Hình vuông" })
        .click();
    else await page.getByRole("button", { name: "9 giờ", exact: true }).click();
    await expect(next, activity).toBeDisabled();
  }
});
