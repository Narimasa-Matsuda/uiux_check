import type { Browser } from "playwright-core";

export interface ScreenshotResult {
  screenshot: string | null;
  renderedText: string | null;
}

// Chromium pack URL must match the revision playwright expects.
// Update this URL when upgrading playwright.
const CHROMIUM_PACK_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

async function launchBrowser(): Promise<Browser> {
  if (process.env.VERCEL) {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    const { chromium: playwrightCore } = await import("playwright-core");
    const executablePath = await chromium.executablePath(CHROMIUM_PACK_URL);
    return playwrightCore.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    });
  }
  const { chromium } = await import("playwright");
  return chromium.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
}

export async function takeScreenshot(url: string): Promise<ScreenshotResult> {
  let browser: Browser | null = null;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });

    const [buffer, renderedText] = await Promise.all([
      page.screenshot({ type: "jpeg", quality: 80 }),
      page.evaluate(() => {
        const el = document.body;
        if (!el) return "";
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
