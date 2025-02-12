import { test, expect } from "@playwright/test";
import { env } from "@/env-variables";

const path = env.urlPage;

test.describe("Test producto download", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(path);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("Download link free", async ({ page }) => {
    await page.goto(path + "/product/estados-financieros-safis-2/");

    const links = await page.locator("a.downloadLinkFree").all();

    const downloadLinks: string[] = [];

    for (const link of links) {
      const fileName = await link.getAttribute("href");

      if (fileName) {
        downloadLinks.push(fileName);
      }
    }

    expect(downloadLinks.length).toBeGreaterThan(0);
  });
});
