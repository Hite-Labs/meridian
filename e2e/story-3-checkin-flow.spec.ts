import { test, expect } from "@playwright/test";

test.describe("Story 3: Post-Session Check-In via SMS", () => {
  test("demo mode loads check-in questionnaire without token", async ({ page }) => {
    await page.goto("/check-in");

    await expect(page.getByText("Session Check-In")).toBeVisible();
    await expect(page.getByText("Dr. Maya Chen")).toBeVisible();
    await expect(page.getByText(/1 of/)).toBeVisible();
  });

  test("invalid token shows error page", async ({ page }) => {
    await page.goto("/check-in?token=00000000-0000-0000-0000-000000000000");

    await expect(page.getByText("Link unavailable")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/contact your coach/i)).toBeVisible();
  });

  test("send-checkin API rejects missing clientId", async ({ request }) => {
    const response = await request.post("/api/send-checkin", {
      data: {},
    });
    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.error).toContain("required");
  });

  test("send-checkin API rejects invalid clientId", async ({ request }) => {
    const response = await request.post("/api/send-checkin", {
      data: { clientId: "not-a-uuid" },
    });
    expect(response.status()).toBe(400);
  });

  test("send-checkin API returns 404 for unknown client", async ({ request }) => {
    const response = await request.post("/api/send-checkin", {
      data: { clientId: "00000000-0000-0000-0000-000000000000" },
    });
    expect(response.status()).toBe(404);
  });
});
