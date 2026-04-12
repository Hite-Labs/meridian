import { test, expect } from "@playwright/test";

test.describe("Story 4: Multiple Clients Dashboard", () => {
  test("dashboard shows client list when no client selected", async ({ page }) => {
    await page.goto("/dashboard");

    // Should show the client list heading
    await expect(page.getByText("Your Clients")).toBeVisible({ timeout: 10000 });

    // Should show Add Client button
    await expect(page.getByRole("button", { name: /add client/i })).toBeVisible();
  });

  test("client cards show key metrics", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.getByText("Your Clients")).toBeVisible({ timeout: 10000 });

    // At least one client card should be visible with ORS or status info
    const cards = page.locator("[class*='card-luxe']");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("clicking a client navigates to their dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.getByText("Your Clients")).toBeVisible({ timeout: 10000 });

    // Click the first client card
    const firstCard = page.locator("[class*='card-luxe']").first();
    await firstCard.click();

    // Should navigate to dashboard with clientId
    await expect(page).toHaveURL(/clientId=/, { timeout: 10000 });

    // Should show Client Snapshot header
    await expect(page.getByText("Client Snapshot")).toBeVisible({ timeout: 10000 });
  });
});
