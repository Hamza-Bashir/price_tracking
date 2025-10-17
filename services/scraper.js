import { chromium } from "playwright";

export const scrapeDaraz = async (url) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    await page.waitForSelector(".pdp-price", { timeout: 15000 });

    const data = await page.evaluate((currentUrl) => {
      const priceEl = document.querySelector(".pdp-price_size_xl, .pdp-price_size_l, .pdp-price_size_m, .pdp-price");
      const nameEl = document.querySelector(".pdp-mod-product-badge-title")
      
      const price = priceEl ? priceEl.innerText.trim() : "Price not found";
      const name = nameEl ? nameEl.innerText.trim() : "Name not found"

      return { url : currentUrl, name, price };
    }, url);
    return data;

  } catch (err) {
    console.error("Error:", err.message);
    return null;
  } finally {
    await browser.close();
  }
};
