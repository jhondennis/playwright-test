import { test, expect } from "@playwright/test";
import fs from "fs";
import { env } from "@/env-variables";

const path = env.urlPage;

interface Products {
  img?: string;
  title?: string;
  url?: string;
  variations?: number;
  description?: string;
  keywords?: string[];
  rating?: string;
}

test.describe("Test producto download", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(path);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("Has products count", async ({ page }) => {
    test.setTimeout(120000);
    await page.goto(path + "/productos-categoria/");
    const allProducts: Products[] = [];

    let counter = 0;

    while (await page.locator("a.next.page-numbers").isVisible()) {
      const products = await page.locator("div.card-product").all();
      for (const product of products) {
        const img = await product
          .locator("a.image-link img")
          .getAttribute("src");
        const title = (
          await product.locator("span.name-product").textContent()
        ).trim();
        const variations = await product
          .locator("div.variations-product-content img")
          .count();
        const url = await product
          .locator("div.title-redirect a")
          .getAttribute("href");
        const description = (
          await product.locator("p.description-product").textContent()
        ).trim();
        const keywords = (
          await product.locator("div.keyword-content").innerText()
        )
          .trim()
          .replace(/\n/g, "")
          .split("|");
        const rating = (
          await product.locator("span.review-count").textContent()
        )
          .replace("(", "")
          .replace(")", "");

        allProducts.push({
          img,
          title,
          variations,
          url,
          description,
          keywords,
          rating,
        });
      }

      console.log(counter);
      counter++;
      await page.locator("a.next.page-numbers").click();
      await page.waitForLoadState("domcontentloaded");
    }

    // Guardar en un archivo JSON
    fs.writeFileSync("productos.json", JSON.stringify(allProducts, null, 2));

    expect(allProducts.length).toBeGreaterThan(0);
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
