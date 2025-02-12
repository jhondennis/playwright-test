import { test, expect } from "@playwright/test";
import { env } from "@/env-variables";

const path = env.urlPage;

test.describe("Test Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(path);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("Has title search", async ({ page }) => {
    const text = await page.locator("span.title-search").textContent();
    expect(text).toContain("¿Qué dato estadístico necesitas?");
  });

  test("Has login button", async ({ page }) => {
    const text = await page.locator("li.login-item").textContent();
    expect(text).toContain("Iniciar sesión");
  });

  test("Has register button", async ({ page }) => {
    const text = await page.locator("li.register-item").textContent();
    expect(text).toContain("Registrate");
  });

  test("Has accordion text header", async ({ page }) => {
    const contents = await page
      .locator("span.text-item-accordion")
      .allTextContents();

    expect(contents).toEqual([
      "¿Qué puedo encontrar en DATAX Bolivia?",
      "¿Qué archivos te entregamos?",
      "¿Cuáles son las fuentes?",
    ]);
  });

  test("Has accordion text body", async ({ page }) => {
    const contents = await page.locator("div.accordion-body").allTextContents();
    expect(contents.length).toEqual(3);
  });

  test("Search product", async ({ page }) => {
    const searchQuery = "banco";

    await page.getByPlaceholder("Buscar productos...").fill(searchQuery);
    await page.locator("button.btn-search").click();
    await page.locator("button.btn-search").click();

    await page.waitForURL(/productos-categoria/);
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveTitle("Productos Categoria");
    const locator = await page.locator("div.card-product").all();
    expect(locator.length).toBeGreaterThan(0);
  });

  test("Login button redirect", async ({ page }) => {
    await page.locator("li.login-item").click();
    await page.waitForURL(/wp-login/);
    await expect(page).toHaveURL(/wp-login/);
  });

  test("Register button redirect", async ({ page }) => {
    await page.locator("li.register-item").click();
    await page.waitForURL(/wp-login/);
    await expect(page).toHaveURL(/wp-login/);
    await expect(page).toHaveURL(/action=register/);
  });
});
