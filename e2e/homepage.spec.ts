import { test, expect } from "@playwright/test";

test("root redirects to dashboard", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  await expect(page.getByText("Your Clients")).toBeVisible({ timeout: 10000 });
});
