import type { Browser } from "puppeteer-core";

/** Common local Chrome/Chromium locations, checked when not on serverless. */
const LOCAL_CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
];

function isServerless(): boolean {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

/**
 * Launch a headless browser for capture. On Vercel/Lambda it uses the bundled
 * @sparticuz/chromium; locally it drives an installed Chrome via puppeteer-core
 * (set CHROME_PATH to override auto-detect).
 */
export async function getRenderBrowser(): Promise<Browser> {
  const puppeteer = await import("puppeteer-core");

  if (isServerless()) {
    const chromium = (await import("@sparticuz/chromium")).default;
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const fs = await import("node:fs");
  const exe =
    process.env.CHROME_PATH || LOCAL_CHROME_CANDIDATES.find((p) => fs.existsSync(p));
  if (!exe) {
    throw new Error(
      "No local Chrome found. Install Chrome or set CHROME_PATH in .env.local."
    );
  }
  return puppeteer.launch({
    executablePath: exe,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}
