import { test, expect } from "@playwright/test";

test("homepage loads and displays navigation tiles", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Meridian/i);

  await expect(page.getByRole("link", { name: /Practitioner/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Client View/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Intake/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Check-In/i })).toBeVisible();
});

test("practitioner tile links to dashboard", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /Practitioner/i }).click();

  await expect(page).toHaveURL(/\/dashboard/);
});
