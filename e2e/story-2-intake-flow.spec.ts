import { test, expect } from "@playwright/test";

test.describe("Story 2: Client Magic Link + Intake", () => {
  test("demo mode loads questionnaire without token", async ({ page }) => {
    await page.goto("/intake");

    // Should show the questionnaire (no token = demo mode)
    await expect(page.getByText("Intake Questionnaire")).toBeVisible();
    await expect(page.getByText("Dr. Maya Chen")).toBeVisible();
    await expect(page.getByText(/1 of/)).toBeVisible();
  });

  test("invalid token shows error page", async ({ page }) => {
    await page.goto("/intake?token=00000000-0000-0000-0000-000000000000");

    // Should show error state
    await expect(page.getByText("Link unavailable")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/contact your coach/i)).toBeVisible();
  });

  test("malformed token shows error page", async ({ page }) => {
    await page.goto("/intake?token=not-a-uuid");

    await expect(page.getByText("Link unavailable")).toBeVisible({ timeout: 10000 });
  });

  test("token validate API returns correct response for missing token", async ({ request }) => {
    const response = await request.get("/api/token/validate");
    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.valid).toBe(false);
    expect(data.reason).toContain("required");
  });

  test("token validate API returns not found for unknown token", async ({ request }) => {
    const response = await request.get("/api/token/validate?token=00000000-0000-0000-0000-000000000000");
    expect(response.status()).toBe(404);

    const data = await response.json();
    expect(data.valid).toBe(false);
  });

  test("token use API rejects missing token", async ({ request }) => {
    const response = await request.post("/api/token/use", {
      data: {},
    });
    expect(response.status()).toBe(400);
  });
});
