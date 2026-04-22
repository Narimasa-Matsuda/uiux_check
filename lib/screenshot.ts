import type { Browser } from "playwright-core";

export interface ScreenshotResult {
  screenshot: string | null;
  renderedText: string | null;
}

// Chromium pack URL must match the revision playwright expects.
// Update this URL when upgrading playwright.
const CHROMIUM_PACK_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

function isServerlessChromiumRuntime(): boolean {
  return Boolean(
    process.env.VERCEL
      || process.env.VERCEL_ENV
      || process.env.AWS_REGION
      || process.env.LAMBDA_TASK_ROOT
  );
}

async function launchBrowser(): Promise<Browser> {
  if (isServerlessChromiumRuntime()) {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    const { chromium: playwrightCore } = await import("playwright-core");
    const executablePath = await chromium.executablePath(CHROMIUM_PACK_URL);
    console.log("[screenshot] launching serverless chromium", {
      runtime: {
        vercel: process.env.VERCEL ?? null,
        vercelEnv: process.env.VERCEL_ENV ?? null,
        awsRegion: process.env.AWS_REGION ?? null,
      },
      executablePath,
    });
    return playwrightCore.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    });
  }
  console.log("[screenshot] launching local playwright chromium");
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
