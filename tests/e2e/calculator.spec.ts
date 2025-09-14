import { test, expect } from "@playwright/test";

test.describe("Calculator with History", () => {
  test("should display calculator interface", async ({ page }) => {
    await page.goto("/");

    // Check if the main title is visible
    await expect(
      page.getByText("Calculadora com Histórico Ramificado")
    ).toBeVisible();

    // Check if calculator display is present
    await expect(page.locator('[class*="bg-gray-900"]')).toBeVisible();

    // Check if basic calculator buttons are present
    await expect(page.getByRole("button", { name: "1" })).toBeVisible();
    await expect(page.getByRole("button", { name: "2" })).toBeVisible();
    await expect(page.getByRole("button", { name: "+" })).toBeVisible();
    await expect(page.getByRole("button", { name: "=" })).toBeVisible();
  });

  test("should perform basic calculations", async ({ page }) => {
    await page.goto("/");

    // Perform a simple calculation: 5 + 3 = 8
    await page.getByRole("button", { name: "5" }).click();
    await page.getByRole("button", { name: "+" }).click();
    await page.getByRole("button", { name: "3" }).click();
    await page.getByRole("button", { name: "=" }).click();

    // Check if the result is displayed
    await expect(page.locator('[class*="text-3xl"]')).toContainText("8");
  });

  test("should show login prompt for unauthenticated users", async ({
    page,
  }) => {
    await page.goto("/");

    // Check if login button is visible
    await expect(page.getByText("Login com Google")).toBeVisible();

    // Check if warning message is shown
    await expect(
      page.getByText("⚠️ Você não está logado. Seu histórico não será salvo.")
    ).toBeVisible();
  });

  test("should clear calculator with AC button", async ({ page }) => {
    await page.goto("/");

    // Enter some numbers
    await page.getByRole("button", { name: "5" }).click();
    await page.getByRole("button", { name: "+" }).click();
    await page.getByRole("button", { name: "3" }).click();

    // Clear all
    await page.getByRole("button", { name: "AC" }).click();

    // Check if display shows 0
    await expect(page.locator('[class*="text-3xl"]')).toContainText("0");
  });
});
