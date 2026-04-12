import { test, expect } from "@playwright/test";

test.describe("Story 1: Client Management", () => {
  test("create a new client from dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    // Wait for sidebar to load, then open client switcher
    // The switcher button contains the current client name — find it by its container structure
    const switcher = page.locator("[class*='px-3 mb-4'] > button").first();
    await switcher.waitFor({ timeout: 10000 });
    await switcher.click();

    // Click Add Client in the dropdown
    await page.getByText("Add Client").click();

    // Fill out the form
    await page.getByPlaceholder("e.g. Sarah").fill("Test");
    await page.getByPlaceholder("e.g. Johnson").fill("Client");
    await page.getByPlaceholder("sarah@example.com").fill("test@example.com");

    // Submit
    await page.getByRole("button", { name: /create client/i }).click();

    // Modal should close
    await expect(page.getByRole("button", { name: /create client/i })).not.toBeVisible({ timeout: 5000 });
  });

  test("edit a client from dashboard", async ({ page }) => {
    // Navigate to a client dashboard (use first demo client)
    await page.goto("/dashboard");

    // Wait for dashboard to load with a client
    await page.waitForSelector("[class*='font-display']", { timeout: 10000 });

    // Click Edit button
    const editButton = page.getByRole("button", { name: /edit/i });
    if (await editButton.isVisible()) {
      await editButton.click();

      // Modal should open with Edit Client title
      await expect(page.getByText("Edit Client")).toBeVisible();

      // Change notes
      const notesField = page.getByPlaceholder(/context, referral/i);
      await notesField.fill("Updated via E2E test");

      // Save
      await page.getByRole("button", { name: /save changes/i }).click();

      // Modal should close
      await expect(page.getByText("Edit Client")).not.toBeVisible({ timeout: 5000 });
    }
  });

  test("archive client shows confirmation", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForSelector("[class*='font-display']", { timeout: 10000 });

    const editButton = page.getByRole("button", { name: /edit/i });
    if (await editButton.isVisible()) {
      await editButton.click();
      await expect(page.getByText("Edit Client")).toBeVisible();

      // Click Archive Client
      await page.getByRole("button", { name: /archive client/i }).click();

      // Confirmation view should appear
      await expect(page.getByText("Archive Client")).toBeVisible();
      await expect(page.getByText(/will be preserved/i)).toBeVisible();

      // Cancel instead of confirming (don't actually archive demo data)
      await page.getByRole("button", { name: /cancel/i }).click();

      // Should be back to edit form
      await expect(page.getByRole("button", { name: /save changes/i })).toBeVisible();
    }
  });

  test("GET /api/clients excludes archived clients", async ({ request }) => {
    const response = await request.get("/api/clients");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.clients).toBeDefined();
    expect(Array.isArray(data.clients)).toBeTruthy();

    // All returned clients should not have archived_at set
    for (const client of data.clients) {
      expect(client.archived_at ?? null).toBeNull();
    }
  });
});
