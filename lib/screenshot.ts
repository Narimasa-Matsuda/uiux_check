import { chromium } from "playwright";

export interface ScreenshotResult {
  screenshot: string | null;
  renderedText: string | null;
}

export async function takeScreenshot(url: string): Promise<ScreenshotResult> {
  let browser = null;
  try {
    browser = await chromium.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });

    const [buffer, renderedText] = await Promise.all([
      page.screenshot({ type: "jpeg", quality: 80 }),
      page.evaluate(() => {
        const el = document.body;
        if (!el) return "";
        // スクリプト・スタイルを除いたテキストを取得
        const clone = el.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("script, style, noscript").forEach((n) => n.remove());
        return (clone.innerText || clone.textContent || "").replace(/\s+/g, " ").trim().slice(0, 3000);
      }),
    ]);

    return {
      screenshot: buffer.toString("base64"),
      renderedText: renderedText || null,
    };
  } catch (err) {
    console.error("[screenshot] failed:", err);
    return { screenshot: null, renderedText: null };
  } finally {
    if (browser) await browser.close();
  }
}
